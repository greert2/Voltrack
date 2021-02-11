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

export function createEvent(eventName, passcode, description, location) {
    if(socket.connected) {
        socket.emit('createEvent', eventName, passcode, description, location, function(confirmation) {
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
                    console.log("output: " + res[0].firstName);
                    let arr = [res[0].firstName, res[0].lastName, res[0].phone];
                    resolve(arr);
                }
            })
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




