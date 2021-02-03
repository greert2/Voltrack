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
    host: '192.168.64.2', // Use the server address of XAMPP!
    user: 'admin',
    password: 'VoltrackDemo',
    database: 'voltrack'
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
            // console.log("hashedPass: " + hashedPass);
            
            
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
                sql_connection.query('INSERT INTO users (id, firstName, lastName, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)', ['', firstName, lastName, phone, email, username, password], function(err, result) {
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


});

