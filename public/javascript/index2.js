let socket;
const $url = document.getElementById('url');
const $qr = document.getElementById('qr');
const $emoties = document.getElementById('emoties');
const $tekst = document.getElementById('emotiesTekst')
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
        console.log('Received data:', data.toString());
        const message = JSON.parse(data.toString());
        if (message.type === 'button') {
            console.log(`Button ${message.value} pressed via WebRTC!`);
            if ($emoties) {
                $emotiestekst.textContent = 'button clicked';
                $emoties.style.display = 'block';
            }
        }
        if (message.type === 'shake') {
            console.log('Shake detected via WebRTC!');
            if ($emoties) {
                $emotiesTekst.textContent = 'fear detected';
                document.getElementById('fear').style.display = 'flex';
                setTimeout(() => {
                    document.getElementById('fear').style.display = 'none';
                }, 2000);
            }
        }
        if (message.type === 'swipe') {
            console.log('Swipe detected via WebRTC!');
            if ($emoties) {
                $emotiesTekst.textContent = 'laugh detected';
                document.getElementById('laugh').style.display = 'flex';
                setTimeout(() => {
                    document.getElementById('laugh').style.display = 'none';
                }, 2000);
            }
        }
        if (message.type === 'tap') {
            console.log('Tap detected via WebRTC!');
            if ($emoties) {
                $emotiesTekst.textContent = 'anger detected';
                document.getElementById('anger').style.display = 'flex';
                setTimeout(() => {
                    document.getElementById('anger').style.display = 'none';
                }, 2000);
            }
        }
        if (message.type === 'pinch') {
            console.log('Pinch detected via WebRTC!');
            if ($emoties) {
                $emotiesTekst.textContent = 'disgust detected';
                document.getElementById('disgust').style.display = 'flex';
                setTimeout(() => {
                    document.getElementById('disgust').style.display = 'none';
                }, 2000);
            }
        }
        if (message.type === 'tilt') {
            console.log('Tilt detected via WebRTC!', message.direction);
            //hoe kan ik hier een image per direction kiezen ???
            if ($emoties) {
                $emotiesTekst.textContent = 'looking detected (' + message.direction + ')';
                document.getElementById('looking').style.display = 'flex';
                setTimeout(() => {
                    document.getElementById('looking').style.display = 'none';
                }, 2000);
            }
        }
    });

    return peer;
};

// init
const init = () => {
    initSocket();
};

init();