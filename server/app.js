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
    const defaultLocation = 'default';
    sql_connection.query('INSERT INTO joined_events (userid, eventid, location) VALUES (?, ?, ?)', [userId, eventId, location], function(err, result) {
        if(err) throw err;
        console.log("Inserted into db!");
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
    socket.on('createEvent', function(eventName, passcode, description, location, fn) { 
        // Generate a Unique ID for this event
        let eventId = generateId();

        eventExists(eventId)
        .then(function(result) {
            // Event does not exist
            console.log("The event: " + eventId + " does not exist."); // DEBUG

             // Insert Event into database
            sql_connection.query('INSERT INTO events (id, name, passcode, description, location) VALUES (?, ?, ?, ?, ?)', [eventId, eventName, passcode, description, location], function(err) {
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
    
    // Join event
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

    socket.on('doJoinEvent', function(userId, eventId, location) {
        doJoinEvent(userId, eventId, location);
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
