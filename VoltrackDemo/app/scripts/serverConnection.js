import socketIO from 'socket.io-client';

const socket = socketIO('http://voltrackapp.com:3000', {  // NOTE: this is currently set to the server's static IP
        transports: ['websocket'], jsonp: false
    });

export function connect() {
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to server.');
    });

    addBasicListeners();
}

export function disconnect() {
    socket.disconnect();
}

export function getSocket() { return socket; }

export function authUser(username, password, callback) {
    if(socket.connected) {
        socket.emit('auth', username, password);
    }
}

export function checkIfEventExists(eventId) {
    if(socket.connected) {
        socket.emit('checkIfEventExists', eventId, function(confirmation) {
            // server will call this callback
            console.log("confirmation: " + confirmation);
        });
    }
}

export function createEvent(managerId, eventName, passcode, description, location) {
    if(socket.connected) {
        socket.emit('createEvent', managerId, eventName, passcode, description, location, function(confirmation) {
            console.log("Event created: " + confirmation);
            if(confirmation != false) {
                alert("Event Created!\n\nSave this information.\n Event ID: " + confirmation + "\n Passcode: " + passcode);
            }else {
                alert("Please try again later.");
            }
            
        });
    }
}


export let getAccountInfo = function(username, userInfoObj) {
    return new Promise(function(resolve, reject) {
        username = username.username; // 'unwrap' the object to text
        if(socket.connected) {
            socket.emit('getAccountInfo', username, function(res) {
                if(res == false) {
                    // alert("Error retrieving account information.");  // DEBUG
                    reject(new Error("Error retrieving account information."))
                }else {
                    console.log("output: " + res.firstName);
                    // let arr = [res[0].firstName, res[0].lastName, res[0].phone];
                    // resolve(arr);
                    resolve(res);
                }
            })
        }
    })
}


export let canJoinEvent = function(eventId, passcode) {
    return new Promise(function(resolve, reject) {
        if(socket.connected) {
            socket.emit('canJoinEvent', eventId, passcode, function(res) {
                console.log("eventId: " + eventId + ", passcode: " + passcode);
                console.log("type?: " + Object.prototype.toString.call(passcode));
                if(res == false) {
                    reject(new Error("EventId or Passcode incorrect"))
                }else {
                    resolve(res); // got the event
                }
            })
        }
    })
}


export let doJoinEvent = function(userId, eventId, location) {
    return new Promise(function(resolve, reject) {
        if(socket.connected) {
            socket.emit('doJoinEvent', userId, eventId, location, function(res) {
                if(res == true) {
                    // the user joined the event successfully
                    resolve(true);
                }else {
                    // issue when attempting to join the event
                    reject(false);
                }
            });
        }
    })
    
}

export function updateLocation(userId, location) {
    if(socket.connected) {
        socket.emit('updateLocation', [userId, location]);
    }
}

export let getLocations = function(eventId) {
    return new Promise(function(resolve, reject) {
        if(socket.connected) {
            socket.emit('getLocations', eventId, function(res) {
                if(res) {
                    // got the locations
                    resolve(res);
                }else {
                    // issue when attempting to get locations
                    reject(false);
                }
            });
        }
    })
}

export let isUserInEvent = function(userId) {
    return new Promise(function(resolve, reject) {
        if(socket.connected) {
            socket.emit('isUserInEvent', userId, function(res) {
                if(res) {
                    // got the event
                    resolve(res);
                }else {
                    // issue when attempting to get locations
                    reject(false);
                }
            });
        }
    })
}

export let getUsersInEvent = function(eventId) {
    return new Promise(function(resolve, reject) {
        if(socket.connected) {
            socket.emit('getUsersInEvent', eventId, function(res) {
                if(res) {
                    // got the users
                    resolve(res);
                }else {
                    // issue when attempting to get locations
                    reject(false);
                }
            });
        }
    })
}

export let leaveEvent = function(eventId, userId) {
    return new Promise(function(resolve, reject) {
        if(socket.connected) {
            socket.emit('leaveEvent', eventId, userId, function(res) {
                if(res) {
                    // got the users
                    resolve(true);
                }else {
                    // issue when attempting to get locations
                    reject(false);
                }
            });
        }
    })
}

export let setTask = function(userId, task) {
    return new Promise(function(resolve, reject) {
        if(socket.connected) {
            socket.emit('setTask', userId, task, function(res) {
                if(res) {
                    // task was set
                    resolve(true);
                }else {
                    // could not set the task
                    reject(false);
                }
            });
        }
    })
}

export let getTask = function(userId) {
    return new Promise(function(resolve, reject) {
        if(socket.connected) {
            socket.emit('getTask', userId, function(res) {
                if(res) {
                    // got task
                    resolve(res);
                }else {
                    // could not get the task
                    reject(false);
                }
            });
        }
    })
}

export let deleteAccount = function(userId) {
    return new Promise(function(resolve, reject) {
        if(socket.connected) {
            socket.emit('deleteAccount', userId, function(res) {
                if(res) {
                    // deleted account
                    resolve(res);
                }else {
                    // could not delete account
                    reject(false);
                }
            });
        }
    })
}


// This may be entirely unneeded depending on our structure.
// Just here for now to keep our unnecessary 'update' function working
function addBasicListeners() {
    /* Update event: upon click on Server Control Panel, gives alert on phone */
    // socket.on('update', () => {
    //     //console.log("update");
    //     alert("test")
    // });
}




