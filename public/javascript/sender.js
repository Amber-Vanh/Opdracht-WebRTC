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

//test button
const TestButton = () => {
    $button.addEventListener('click', () => {
        if (peer && peer.connected) {
            peer.send(JSON.stringify({ type: 'button', value: 'test' }));
        }
    });
};

// BANG
const setupShakeDetection = () => {
    let lastX = null;
    let lastY = null;
    let lastZ = null;
    let lastTime = 0;

    window.addEventListener("devicemotion", (event) => {
        const acc = event.accelerationIncludingGravity;
        const currentTime = Date.now();

        if ((currentTime - lastTime) > 100) {
            const deltaX = Math.abs(acc.x - (lastX || 0));
            const deltaY = Math.abs(acc.y - (lastY || 0));
            const deltaZ = Math.abs(acc.z - (lastZ || 0));

            if (deltaX + deltaY + deltaZ > 10) {
                console.log("Shake detected!");
                if (peer && peer.connected) {
                    peer.send(JSON.stringify({ type: "shake", emotion: "fear" }));
                }
            }

            lastX = acc.x;
            lastY = acc.y;
            lastZ = acc.z;
            lastTime = currentTime;
        }
    });
};

const swipeDetection = () => {
    const swipeArea = document.getElementById('swipeArea');
    const hammer = new Hammer(swipeArea);

    // Configure swipe recognizer
    hammer.get('swipe').set({
        direction: Hammer.DIRECTION_ALL,
        threshold: 10,
        velocity: 0.3
    });

    hammer.on('swipe', (event) => {
        let direction = 'unknown';
        if (event.direction === Hammer.DIRECTION_LEFT) direction = 'left';
        if (event.direction === Hammer.DIRECTION_RIGHT) direction = 'right';
        if (event.direction === Hammer.DIRECTION_UP) direction = 'up';
        if (event.direction === Hammer.DIRECTION_DOWN) direction = 'down';

        if (peer && peer.connected) {
            peer.send(JSON.stringify({
                type: "swipe",
                emotion: "laugh",
                direction: direction
            }));
        }
    });
};


const init = () => {
    TestButton();
    setupShakeDetection();
    swipeDetection();

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