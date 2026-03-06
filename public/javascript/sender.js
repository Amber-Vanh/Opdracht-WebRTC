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
const shakeDetection = () => {
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

// LACHEN
const swipeDetection = () => {
    const area = document.getElementById('area');
    const hammer = new Hammer(area);

    hammer.get('swipe').set({
        direction: Hammer.DIRECTION_ALL,
        threshold: 10,
        velocity: 0.3
    });

    hammer.on('swipe', (event) => {
        if (peer && peer.connected) {
            peer.send(JSON.stringify({
                type: "swipe",
                emotion: "laugh"
            }));
        }
    });
};

// BOOS
const tapDetection = () => {
    const area = document.getElementById('area');
    if (!area) {
        console.error('Area element not found for tap detection');
        return;
    }

    const hammer = new Hammer(area);
    hammer.on('tap', (event) => {
        console.log("Tap detected!");
        if (peer && peer.connected) {
            peer.send(JSON.stringify({ type: "tap", emotion: "laugh" }));
        }
    });

    console.log('Tap detection initialized on area');
};

// DISGUST
const pinchDetection = () => {
    const area = document.getElementById('area');
    const hammer = new Hammer(area);

    // Enable pinch recognizer (not enabled by default!)
    hammer.get('pinch').set({ enable: true });

    let lastPinchTime = 0;

    hammer.on('pinch', (event) => {
        // Throttle to prevent multiple sends
        const now = Date.now();
        if (now - lastPinchTime < 500) return;
        lastPinchTime = now;

        if (peer && peer.connected) {
            peer.send(JSON.stringify({
                type: "pinch",
                emotion: "disgust",
                scale: event.scale
            }));
        } else {
            console.warn('Pinch detected but not connected');
        }
    });
};

// TILT
const tiltDetection = () => {
    let lastTiltTime = 0;

    window.addEventListener("deviceorientation", (event) => {
        const beta = event.beta;   // voor/achter
        const gamma = event.gamma; // links/rechts

        if (beta === null || gamma === null) return;

        const tiltThreshold = 30;
        const now = Date.now();

        // cooldown
        if (now - lastTiltTime < 500) return;

        let direction = null;

        // Links / rechts
        if (gamma < -tiltThreshold) direction = "left";
        else if (gamma > tiltThreshold) direction = "right";

        // Boven / onder
        else if (beta < -tiltThreshold) direction = "up";
        else if (beta > tiltThreshold) direction = "down";

        if (direction) {
            lastTiltTime = now;

            if (peer && peer.connected) {
                peer.send(JSON.stringify({
                    type: "tilt",
                    emotion: "looking",
                    direction: direction
                }));
            }
        }
    });
};

const init = () => {
    TestButton();
    shakeDetection();
    swipeDetection();
    tapDetection();
    pinchDetection();
    tiltDetection();

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