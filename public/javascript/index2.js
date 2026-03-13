let socket;
const $url = document.getElementById('url');
const $qr = document.getElementById('qr');
const $emoties = document.getElementById('emoties');
const $emotiesTekst = document.getElementById('emotiesTekst');
const $defaultImage = document.getElementById('defaultImage');
const $emotionAnimation = document.getElementById('emotionAnimation');
let currentPeer = null;
let currentAnimation = null;
let resetToDefaultTimer = null;

const emotionAnimationMap = {
    shake: './assets/angst.json',
    swipe: './assets/blij.json',
    tap: './assets/angry.json',
    pinch: './assets/disgust.json'
};

const directionAnimationMap = {
    up: './assets/boven.json',
    down: './assets/onder.json',
    left: './assets/links.json',
    right: './assets/rechts.json'
};

const clearDefaultTimer = () => {
    if (resetToDefaultTimer) {
        clearTimeout(resetToDefaultTimer);
        resetToDefaultTimer = null;
    }
};

const triggerSenderSound = (sound) => {
    if (!currentPeer || !currentPeer.connected) {
        return;
    }

    currentPeer.send(JSON.stringify({
        type: 'playSound',
        sound
    }));
};

const showDefaultState = (label = 'no emotion detected') => {
    clearDefaultTimer();

    if (currentAnimation) {
        currentAnimation.destroy();
        currentAnimation = null;
    }

    if ($emotiesTekst) {
        $emotiesTekst.textContent = label;
    }

    if ($emotionAnimation) {
        $emotionAnimation.style.display = 'none';
        $emotionAnimation.innerHTML = '';
    }

    if ($defaultImage) {
        $defaultImage.style.display = 'flex';
    }

    triggerSenderSound('default');
};

const showEmotionAnimation = (assetPath, label, sound) => {
    if (!$emoties || !$emotionAnimation || !$defaultImage) {
        return;
    }

    clearDefaultTimer();

    if ($emotiesTekst) {
        $emotiesTekst.textContent = label;
    }

    $defaultImage.style.display = 'none';
    $emotionAnimation.style.display = 'block';
    $emotionAnimation.innerHTML = '';

    if (!window.lottie) {
        showDefaultState('no emotion detected');
        return;
    }

    if (currentAnimation) {
        currentAnimation.destroy();
        currentAnimation = null;
    }

    currentAnimation = window.lottie.loadAnimation({
        container: $emotionAnimation,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: assetPath
    });

    triggerSenderSound(sound);

    resetToDefaultTimer = setTimeout(() => {
        showDefaultState('no emotion detected');
    }, 2000);
};

// Initialize socket connection
const initSocket = () => {
    socket = io.connect('/');

    socket.on('connect', () => {
        console.log('Desktop connected:', socket.id);
        const url = `${window.location.origin}/sender.html?id=${socket.id}`;
        $url.textContent = url;
        $url.setAttribute('href', url);
        generateQRCode(url);
    });

    socket.on('peerReady', peerId => {
        console.log(`Smartphone connected: ${peerId}`);
        currentPeer = connectPeer(peerId);
    });

    socket.on('signal', (peerId, signal, socketId) => {
        console.log(`Received WebRTC signal from ${socketId}`);
        if (currentPeer) {
            currentPeer.signal(signal);
        }
    });
};

const generateQRCode = (url) => {
    const typeNumber = 4;
    const errorCorrectionLevel = 'L';
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(url);
    qr.make();
    $qr.innerHTML = qr.createImgTag(3);
    console.log('Controller URL:', url);
};

// WebRTC setup
const connectPeer = (peerId) => {
    const peer = new SimplePeer({
        initiator: true,
        trickle: true,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
            ]
        }
    });

    peer.on('signal', data => {
        socket.emit('signal', peerId, data);
    });

    peer.on('connect', () => {
        console.log(`WebRTC connected to ${peerId}`);
    });

    peer.on('data', data => {
        console.log('Received data:', data.toString());
        const message = JSON.parse(data.toString());

        if (message.type === 'shake') {
            console.log('Shake detected via WebRTC!');
            if ($emoties) {
                showEmotionAnimation(emotionAnimationMap.shake, 'fear detected', 'fear');
            }
        }

        if (message.type === 'swipe') {
            console.log('Swipe detected via WebRTC!');
            if ($emoties) {
                showEmotionAnimation(emotionAnimationMap.swipe, 'laugh detected', 'laugh');
            }
        }

        if (message.type === 'tap') {
            console.log('Tap detected via WebRTC!');
            if ($emoties) {
                showEmotionAnimation(emotionAnimationMap.tap, 'anger detected', 'anger');
            }
        }

        if (message.type === 'pinch') {
            console.log('Pinch detected via WebRTC!');
            if ($emoties) {
                showEmotionAnimation(emotionAnimationMap.pinch, 'disgust detected', 'disgust');
            }
        }

        if (message.type === 'tilt') {
            console.log('Tilt detected via WebRTC!', message.direction);
            if ($emoties) {
                const directionAsset = directionAnimationMap[message.direction];
                if (directionAsset) {
                    showEmotionAnimation(directionAsset, 'looking detected (' + message.direction + ')', 'looking');
                    triggerSenderSound('looking');
                } else {
                    showDefaultState('no emotion detected');
                }
            }
        }
    });

    return peer;
};

// init
const init = () => {
    initSocket();
    showDefaultState();
};

init();