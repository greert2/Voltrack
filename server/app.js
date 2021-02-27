/*
 * Voltrack Server
 * A server built with socket.io
 * 
 * To Run: 'node app.js'
 * To view control panel, open 'localhost:3000/' in a browser
 */ 

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
const { brotliCompressSync } = require('zlib');
const e = require('express');

server.listen(3000);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Connect to Database
var sql_connection = mysql.createConnection({
    host: 'localhost', // Use the server address of XAMPP!
    user: 'root',
    password: 'Voltrack2021!DB',
    database: 'voltrack',
    debug: true
});

sql_connection.connect(function(err) {
    if(err) throw err;
    console.log('You are now connected to the db!');
});


// Returns 'result = false' if a user does not exist... Returns an error if the user does already exist
let accountExists = function(username) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('SELECT id FROM users WHERE username = ?', username, function(err, results) {
            if(err) {
                console.log("Error selecting username: " + username);
                var doesExist = true; // don't let them register..just in case
            }else {
                // console.log("size of res: " + results.length);
                if(results.length > 0) {
                    // console.log("func: User already exists.");
                    reject(new Error("User exists"));
                }else {
                    // console.log("func: registering...");
                    doesExist = false;
                    resolve(doesExist);
                }
            }
        });
    })
}


// Returns 'result = false' if a user does not exist... Returns an error if the user does already exist
let getAccountInfo = function(username) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('SELECT id, firstName, lastName, phone FROM users WHERE username = ?', username, function(err, results) {
            if(err) {
                console.log("Error selecting username: " + username);
            }else {
                console.log("size of res: " + results.length); // DEBUG
                if(results.length > 0) {
                    console.log("func: Got user."); // DEBUG
                    resolve(results[0]);
                }else {
                    reject(new Error("Could not retrieve user info."));
                }
            }
        });
    })
}


// Returns 'result = false' if an event does not exist... Returns an error if the event does already exist
let eventExists = function(eventId) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('SELECT id FROM events WHERE id = ?', eventId, function(err, results) {
            if(err) {
                console.log("Error selecting eventId: " + eventId);
                var doesExist = true; // don't let them register event..just in case
            }else {
                // console.log("size of res: " + results.length); // DEBUG
                if(results.length > 0) {
                    // console.log("func: User already exists.");
                    reject(new Error("Event with this id already exists"));
                }else {
                    // console.log("func: registering...");
                    doesExist = false;
                    resolve(doesExist); // no event with this Id exists
                }
            }
        });
    })
}


// canJoinEvent()
// Given an eventId and a passcode, determines if a user can join the event (by seeing if it exists and comparing the passcode)
// If successful, returns an object containing the eventName, description, and default location string.
let canJoinEvent = function(eventId, passcode) {
    return new Promise(function(resolve, reject) {
        console.log("canJoinEvent-- id:" + eventId + " passcode:" + passcode);
        sql_connection.query('SELECT name, description, location FROM events WHERE id = ? AND passcode = ?', [eventId, passcode], function(err, results) {
            if(err) {
                console.log("Error selecting eventId: " + eventId);
            }else {
                // console.log("canJoinEvent-- size of res: " + results.length); // DEBUG
                if(results.length > 0) {
                    resolve(results[0]) // user can join this event.. send back event info
                }else {
                    reject(new Error("EventId or Passcode incorrect"));
                }
            }
        });
    })
}


// doJoinEvent()
// Given a userId, eventId, and location string, makes a user join an event by putting an entry in the 'joined_events' table
let doJoinEvent = function(userId, eventId, location) {
    return new Promise(function(resolve, reject) {
        // Check if user is already in this event
        sql_connection.query('SELECT * FROM joined_events WHERE userid = ? AND eventid = ?', [userId, eventId], function(err, results) {
            if(err) {
                console.log("Error while checking if user is already in event.");
                reject(new Error("Error while checking if user is already in event."));
            }else {
                if(results.length > 0) {
                    // the user is already in this event. do not let them join again.
                    console.log("Error: user is already in this event.")
                    reject(new Error("Error: user is already in this event."));
                }else {
                    // add the user to the event
                    sql_connection.query('INSERT INTO joined_events (userid, eventid, location) VALUES (?, ?, ?)', [userId, eventId, location], function(err, result) {
                        if(err) throw err;
                        console.log("Inserted into db!");
                        resolve(true);
                    })
                }
            }
        })
    })
}




// Promises a hashed password (given it is used on a previously proven username)
let getHashedPassFromDB = function(username) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('SELECT password FROM users WHERE username = ?', username, function(err, results) {
            
            if(err) {
                console.log("Error selecting username: " + username);
            }else {
                // console.log("size of res: " + results.length);
                if(results.length > 0) {
                    resolve(results[0].password);
                }else {
                    reject(err);
                }
            }
        });
    })
}

// Used for getting location of all users in an event. 
// Resolves an array of objects of the following form
// results[0] {
//      userid: their userid,
//      firstname: their first name,
//      lastname: their last name,
//      location: their location string
// }
let getLocations = function(eventId) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('SELECT userid, firstname, lastname, joined_events.location FROM joined_events JOIN users ON joined_events.userid = users.id WHERE eventid = ?', eventId, function(err, results) {
            if(err) {
                console.log("Error selecting eventid: " + eventId);
            }else {
                if(results.length > 0) {
                    console.log("Got results. Lenght: " + results.length);
                    resolve(results);
                }else {
                    reject(err);
                }
            }
        });
    })
}

// Used to check if a user is in an event
// Resolves an object of the following form
// result {
//      eventid: the id of the event they're in
//      name: the name of the event they're in
// }
let isUserInEvent = function(userId) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('SELECT eventid, name FROM joined_events JOIN events ON joined_events.eventid = events.id WHERE userid = ?', userId, function(err, results) {
            if(err) {
                console.log("Error selecting userid: " + userId);
            }else {
                if(results.length > 0) {
                    resolve(results[0]); // resolve the first (and theoretically only) result
                }else {
                    reject(err);
                }
            }
        });
    })
}


// Used for getting information of all users in an event (including contact info)
// Resolves an array of objects of the following form
// results[0] {
//      userid: their userid,
//      firstname: their first name,
//      lastname: their last name,
//      phone: their phone string
// }
let getUsersInEvent = function(eventId) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('SELECT userid, firstname, lastname, phone FROM users JOIN joined_events ON joined_events.userid = users.id WHERE eventid = ?', eventId, function(err, results) {
            if(err) {
                console.log("Error selecting eventid: " + eventId);
            }else {
                if(results.length > 0) {
                    resolve(results);
                }else {
                    reject(err);
                }
            }
        });
    })
}

// Used to leave an event by a user. If the user is the manager of the event, it deletes the event
//  and removes everyone from the event as well.
let leaveEvent = function(eventId, userId) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('SELECT id, managerid FROM events WHERE id = ? AND managerid = ?', [eventId, userId], function(err, results) {
            if(err) {
                console.log("Error selecting eventid: " + eventId);
            }else {
                if(results.length > 0) {
                    // The event manager is leaving the event. Delete the event.
                    sql_connection.query('DELETE FROM events WHERE id = ?', eventId, function(err, results) {
                        if(err) {
                            console.log("Error deleting event with eventid: " + eventId);
                        }else {
                            // Remove any other volunteer that was still in the event
                            sql_connection.query('DELETE FROM joined_events WHERE eventid = ?', eventId, function(err, results) {
                                if(err) {
                                    console.log("Error deleting from joined_events for eventid: " + eventId);
                                }else {
                                    resolve(true);
                                }
                            })
                        }
                    })
                }else {
                    // Not the event manager. Leave the event like normal.
                    sql_connection.query('DELETE FROM joined_events WHERE userid = ?', [userId], function(err, results) {
                        if(err) {
                            console.log("Error leaving event for userid = " + userId);
                        }else if(results) {
                            resolve(true);
                        }
                    })
                }
            }
        });
    })
}

// This sets a volunteer's task in an event. This should only be called after the user has
//  joined an event. The database supports up to 50 characters for the task.
let setTask = function(userId, task) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('UPDATE joined_events SET task = ? WHERE userid = ?', [task, userId], function(err, results) {
            if(err) {
                console.log("Error updating task for userId: " + userId);
            }else {
                if(results.changedRows > 0) {
                    resolve(true);
                }else {
                    reject(err);
                }
            }
        });
    })
}

// Used to get the task of a specific user. Useful to show the user their own current task.
let getTask = function(userId) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('SELECT task FROM joined_events WHERE userid = ?', userId, function(err, results) {
            if(err) {
                console.log("Error selecting task for userId: " + userId);
            }else {
                if(results.length > 0) {
                    resolve(results[0].task);
                }else {
                    reject(err);
                }
            }
        });
    })
}

// Given a userId and the inEvent variable, this deletes a user's account
//  If the user is in an event at the time of deletion, this should be invoked after leaveEvent.
let deleteAccount = function(userId) {
    return new Promise(function(resolve, reject) {
        sql_connection.query('DELETE FROM users WHERE id = ?', userId, function(err, results) {
            if(err) {
                console.log("Error deleting user for userId: " + userId);
                reject(err);
            }else {
                resolve(true)
            }
        });
    })
}

// Connect
io.on('connection', function(socket) {
    console.log(socket.id);
    
    // On Update
    socket.on('update', () => {
        console.log('update');
        io.emit('update');
    });

    // On Authorization (user requesting auth)
    socket.on('auth', (username, password) => {
        var hashedPass;
        // Check if user account exists
        accountExists(username)
        .then(function(result) {
            // User does not exist, error
            console.log("The user: " + username + " does not exist.");
            socket.emit('authorized', false);
        })
        .catch(function(err) {

            // User already exists, proceed with login
            getHashedPassFromDB(username)
            .then(function(res) {
                if(res) {
                    // Got the hashed pass
                    hashedPass = res;
                    console.log("hashedPass: " + hashedPass);

                    // Compare hashed pass
                    bcrypt.compare(password, hashedPass, function (err, res) {
                        if(res) {
                            console.log("Login success!");
                            socket.emit('authorized', true);
                            console.log('User Authorized');
                        }else {
                            console.log("Password does not match");
                            socket.emit('authorized', false);
                        }
                    })
                }else {
                    console.log("Error getting hashed pass");
                }
            })
            // console.log("hashedPass: " + hashedPass); // DEBUG
            
            
        })
    });

    // Attempt to register an account
    socket.on('account_register', (firstName, lastName, phone, email, username, password) => {
        console.log(firstName + "," + lastName + "," + phone + "," + email + "," + username + "," + password);
        accountExists(username)
        .then(function(result) {
            // User does not exist, proceed with registration
            //console.log("result: " + result);
            if(firstName == '' || lastName == '' || phone == '' || email == '' || username == '' || password == '') {
                console.log("Registration: A field was empty. No user account created.");
            }else {
                sql_connection.query('INSERT INTO users (firstName, lastName, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?)', [firstName, lastName, phone, email, username, password], function(err, result) {
                    if(err) throw err;
                    console.log("Inserted into db!");
                })
            }
            
        })
        .catch(function(err) {
            // User already exists
            console.log("ERR: " + err);
        })

        
    });

    // Get account info in form of [firstName, lastName, phone]
    socket.on('getAccountInfo', function(username, res) { 
        // Retrieve user information from database
        getAccountInfo(username)
        .then(function(result) {
            // User exists, got data
            console.log("result: " + result[0]);
            res(result);
            
        })
        .catch(function(err) {
            // User already exists
            console.log("ERR: " + err);
            res(false);
        })
    })

    // Check if an event with a given eventId exists already in the DB
    socket.on('checkIfEventExists', function(eventId, fn) {
        eventExists(eventId)
        .then(function(result) {
            // Event does not exist
            console.log("The event: " + eventId + " does not exist."); // DEBUG
            fn(true);
        })
        .catch(function(err) {

            // Event already exists
            fn(false);
            
            
        })
    })

    // Create a new event
    socket.on('createEvent', function(managerId, eventName, passcode, description, location, fn) { 
        // Generate a Unique ID for this event
        let eventId = generateId();

        eventExists(eventId)
        .then(function(result) {
            // Event does not exist
            console.log("The event: " + eventId + " does not exist."); // DEBUG

             // Insert Event into database
            sql_connection.query('INSERT INTO events (id, managerid, name, passcode, description, location) VALUES (?, ?, ?, ?, ?, ?)', [eventId, managerId, eventName, passcode, description, location], function(err) {
                if(err) {
                    fn(false);
                    throw err;
                } 
                console.log("Inserted into db!");

                fn(eventId);
            })

        })
        .catch(function(err) {
            // Event with this ID already exists  
            fn(false);
        })

    })
    
    // checks if the eventId exists and the passcode is correct
    socket.on('canJoinEvent', function(eventId, passcode, fn) {
        canJoinEvent(eventId, passcode)
        .then(function(result) {
            // event and passcode were correct
            fn(result);
        })
        .catch(function(err) {
            // incorrect eventId or passcode
            fn(false);
        })
    })

    // given a userId, eventId, and a starting location string, joins a user to an event
    socket.on('doJoinEvent', function(userId, eventId, location, fn) {
        doJoinEvent(userId, eventId, location)
        .then(function(result) {
            fn(result);
        })
        .catch(function(err) {
            fn(err);
        })
    })

    // given a userId and a location string, updates it in the database
    socket.on('updateLocation', function(userId, location, fn) {
        sql_connection.query('UPDATE joined_events SET location = ? WHERE userid = ?', [location, userId], function(err, result) {
            if(err) throw err;
            console.log("Updated location in db!");
        })
    })

    // given an eventId, gets user location. See function defined above for format of resove
    socket.on('getLocations', function(eventId, fn) {
        getLocations(eventId)
        .then(function(result) {
            fn(result);
        })
        .catch(function(err) {
            fn(err);
        })
    })

    // check if user is in an event
    socket.on('isUserInEvent', function(userId, fn) {
        isUserInEvent(userId)
        .then(function(result) {
            fn(result);
        })
        .catch(function(err) {
            fn(err);
        })
    })

     // given an eventId, gets user information. See function defined above for format of resove
     socket.on('getUsersInEvent', function(eventId, fn) {
        getUsersInEvent(eventId)
        .then(function(result) {
            fn(result);
        })
        .catch(function(err) {
            fn(err);
        })
    })

    // given an eventId and userId, makes the volunteer leave the event. If they're the manager, it deletes it.
    socket.on('leaveEvent', function(eventId, userId, fn) {
        leaveEvent(eventId, userId)
        .then(function(result) {
            fn(result);
        })
        .catch(function(err) {
            fn(err);
        })
    })

    // given a userId and a task string, sets the users task status in the database.
    socket.on('setTask', function(userId, task, fn) {
        setTask(userId, task)
        .then(function(result) {
            fn(result);
        })
        .catch(function(err) {
            fn(err);
        })
    })

    // given a userId and a task string, sets the users task status in the database.
    socket.on('getTask', function(userId, fn) {
        getTask(userId)
        .then(function(result) {
            fn(result);
        })
        .catch(function(err) {
            fn(err);
        })
    })

    // given a userId, deletes the users account. Should be called after leaveEvent if they're in an event.
    socket.on('deleteAccount', function(userId, fn) {
        deleteAccount(userId)
        .then(function(result) {
            fn(result);
        })
        .catch(function(err) {
            fn(err);
        })
    })
    

});




/* ---ID Generation--- */

// Generates and returns a random int from 0 to 9
function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(10));
}

function generateId() {
    let id = "";
    for(let i = 0; i < 9; i++) {
        id = id + getRandomInt();
    }
    console.log("Generated ID: " + id);
    return id;
}
/* ---END ID Generation--- */
