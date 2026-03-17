let socket;
const $url = document.getElementById('url');
const $qr = document.getElementById('qr');
const $emoties = document.getElementById('emoties');
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

//voorkomt dat oude timeouts huidige animaties onderbreken
const clearDefaultTimer = () => {
    if (resetToDefaultTimer) {
        clearTimeout(resetToDefaultTimer);
        resetToDefaultTimer = null;
    }
};

//afspelen van juiste geluid bij emotie
const triggerSenderSound = (sound) => {
    if (!currentPeer || !currentPeer.connected) {
        return;
    }

    currentPeer.send(JSON.stringify({
        type: 'playSound',
        sound
    }));
};

//toont standaard image na animatie af te spelen
const showDefaultState = () => {
    clearDefaultTimer();

    if (currentAnimation) {
        currentAnimation.destroy();
        currentAnimation = null;
    }

    if ($emotionAnimation) {
        $emotionAnimation.style.display = 'none';
        $emotionAnimation.innerHTML = '';
    }

    if ($defaultImage) {
        $defaultImage.style.display = 'flex';
    }
};

// emotie + geluid afspelen
const showEmotionAnimation = (assetPath, sound) => {
    if (!$emoties || !$emotionAnimation || !$defaultImage) {
        return;
    }

    clearDefaultTimer();

    $defaultImage.style.display = 'none';
    $emotionAnimation.style.display = 'block';
    $emotionAnimation.innerHTML = '';

    if (!window.lottie) {
        showDefaultState();
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
        showDefaultState();
    }, 2000);
};

// Initialize socket connection
const initSocket = () => {
    socket = io.connect('/');

    socket.on('connect', () => {
        //console.log('Desktop connected:', socket.id);
        const url = `${window.location.origin}/sender.html?id=${socket.id}`;
        $url.textContent = url;
        $url.setAttribute('href', url);
        generateQRCode(url);
    });

    socket.on('peerReady', peerId => {
        //console.log(`Smartphone connected: ${peerId}`);
        currentPeer = connectPeer(peerId);
    });

    socket.on('signal', (peerId, signal, socketId) => {
        //console.log(`Received WebRTC signal from ${socketId}`);
        if (currentPeer) {
            currentPeer.signal(signal);
        }
    });
};

//qr generen
const generateQRCode = (url) => {
    const qr = qrcode(4, 'L');
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
        //console.log(`WebRTC connected to ${peerId}`);
    });

    peer.on('data', data => {
        const message = JSON.parse(data.toString());

        const emotionHandlers = {
            shake: () => {
                if ($emoties) {
                    showEmotionAnimation(emotionAnimationMap.shake, 'fear');
                }
            },
            swipe: () => {
                if ($emoties) {
                    showEmotionAnimation(emotionAnimationMap.swipe, 'laugh');
                }
            },
            tap: () => {
                if ($emoties) {
                    showEmotionAnimation(emotionAnimationMap.tap, 'anger');
                }
            },
            pinch: () => {
                if ($emoties) {
                    showEmotionAnimation(emotionAnimationMap.pinch, 'disgust');
                }
            },
            tilt: () => {
                if ($emoties) {
                    const directionAsset = directionAnimationMap[message.direction];
                    if (directionAsset) {
                        showEmotionAnimation(directionAsset, 'looking');
                    } else {
                        showDefaultState();
                    }
                }
            }
        };
        emotionHandlers[message.type]?.();
    });

    return peer;
};

// init
const init = () => {
    initSocket();
    showDefaultState();
};

init();