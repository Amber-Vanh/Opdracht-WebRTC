import Hammer from 'hammerjs';
let socket;
let myStream;
let peer;

const servers = {
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
};

const init = async () => {
    initSocket();
};

const initSocket = () => {
    socket = io.connect('/');

    socket.on('connect', () => {
        console.log(socket.id);
    });

    socket.on('signal', async (myId, signal, peerId) => {
        console.log(`Received signal from ${peerId}`);
        console.log(signal);
        peer.signal(signal);
    });
};

const callPeer = async (peerId) => {
    peer = new SimplePeer({
        initiator: true,
        stream: myStream
    });

    peer.on('signal', data => {
        socket.emit('signal', peerId, data);
    });
};

init();
