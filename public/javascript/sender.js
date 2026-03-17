const socket = io();
let targetSocketId;
let peer;

const audioBySound = Object.fromEntries([
    ['fear', 'fear'],
    ['laugh', 'laugh'],
    ['anger', 'anger'],
    ['disgust', 'disgust'],
    ['looking', 'tilt']
].map(([sound, id]) => [sound, document.getElementById(id)]));

// afspelen van geluid bij emotie
const playSound = (sound) => {
    const selectedAudio = audioBySound[sound];
    if (!selectedAudio) {
        return;
    }

    selectedAudio.currentTime = 0;
    selectedAudio.play().catch(err => {
        console.warn('Audio play was blocked or failed:', err);
    });
};

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

    peer.on('data', data => {
        const message = JSON.parse(data.toString());
        if (message.type === 'playSound') {
            playSound(message.sound);
        }
    });

    peer.on('error', err => {
        console.error("Peer error:", err);
    });
};

const getUrlParameter = (name) => new URLSearchParams(window.location.search).get(name);

const sendIfConnected = (payload, onDisconnected) => {
    if (!peer || !peer.connected) {
        if (onDisconnected) {
            onDisconnected();
        }
        return false;
    }

    peer.send(JSON.stringify(payload));
    return true;
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
                sendIfConnected({ type: "shake", emotion: "fear" });
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

    hammer.on('swipe', () => {
        sendIfConnected({
            type: "swipe",
            emotion: "laugh"
        });
    });
};

// BOOS
const tapDetection = () => {
    const area = document.getElementById('area');

    const hammer = new Hammer(area);
    hammer.on('tap', () => {
        sendIfConnected({ type: "tap", emotion: "anger" });
    });
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

        sendIfConnected({
            type: "pinch",
            emotion: "disgust"
        });
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

            sendIfConnected({
                type: "tilt",
                emotion: "looking",
                direction: direction
            });
        }
    });
};

const init = () => {
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

init();