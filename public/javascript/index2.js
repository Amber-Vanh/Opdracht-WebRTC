let socket;
const $url = document.getElementById('url');
const $qr = document.getElementById('qr');
let currentPeer = null;

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
        const message = JSON.parse(data.toString());
        if (message.type === 'button') {
            console.log(`Button ${message.value} pressed via WebRTC!`);
        }
    });

    return peer;
};

// DOM updates


// init
const init = () => {
    initSocket();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}