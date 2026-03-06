//import Hammer from 'hammerjs';
const $peerSelect = document.getElementById('peerSelect');
const $button = document.getElementById('testButton');

const socket = io();
let targetSocketId;
let peer;


// WebRTC setup
const createPeer = () => {
    peer = new SimplePeer({
        initiator: false,
        trickle: true,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
            ]
        }
    });

    peer.on('signal', data => {
        socket.emit('signal', targetSocketId, data);
    });

    peer.on('connect', () => {
        console.log(`Connected to desktop!`);
    });

    peer.on('error', err => {
        console.error("Peer error:", err);
    });
};


const getUrlParameter = (name) => {
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const TestButton = () => {
    $button.addEventListener('click', () => {
        if (peer && peer.connected) {
            peer.send(JSON.stringify({ type: 'button', value: 'test' }));
        }
    });
};

const init = () => {
    TestButton();

    
    targetSocketId = getUrlParameter('id');
    if (!targetSocketId) {
        alert('Missing target ID in querystring');
        return false;
    }

    socket.emit('peerReady', targetSocketId);
    return true;
};

socket.on('signal', (peerId, signal) => {
    if (!peer) createPeer();
    peer.signal(signal);
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}