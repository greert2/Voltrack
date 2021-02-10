import socketIO from 'socket.io-client';

const socket = socketIO('http://192.168.1.15:3000', {  // NOTE: change this to your local IP
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

// This may be entirely unneeded depending on our structure.
// Just here for now to keep our unnecessary 'update' function working
function addBasicListeners() {
    /* Update event: upon click on Server Control Panel, gives alert on phone */
    socket.on('update', () => {
        //console.log("update");
        alert("test")
    });
}
