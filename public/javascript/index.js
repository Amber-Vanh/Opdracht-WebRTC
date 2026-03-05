const $url = document.getElementById('url');
let socket;
let peer;

const servers = {
    iceServers: [{
        urls: `stun:stun.l.google.com:19302`
    }]
};

const init = () => {
    initSocket();
};

const initSocket = () => {
    socket = io.connect('/');

    socket.on('connect', () => {
        console.log(`Connected: ${socket.id}`);

        const url = `${new URL(`/sender.html?id=${socket.id}`, window.location)}`;
        $url.textContent = url;
        $url.setAttribute('href', url);

        try {
            // Check if qrcode library is loaded
            if (typeof qrcode === 'undefined') {
                console.error('QR-code library niet geladen!');
                document.getElementById('qr').innerHTML = '<p style="color: red;">QR-code library kon niet worden geladen</p>';
                return;
            }

            const typeNumber = 4;
            const errorCorrectionLevel = 'L';
            const qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(url);
            qr.make();
            document.getElementById('qr').innerHTML = qr.createImgTag(4);
        } catch (error) {
            console.error('Fout bij het genereren van QR-code:', error);
            document.getElementById('qr').innerHTML = `<p style="color: red;">Fout: ${error.message}</p>`;
        }
    });

    socket.on('signal', async (myId, signal, peerId) => {
        console.log(`Received signal from ${peerId}`);
        console.log(signal);

        if (signal.type === 'offer') {
            answerPeerOffer(myId, signal, peerId);
        }

        peer.signal(signal);
    });
};

const answerPeerOffer = async (myId, offer, peerId) => {
    peer = new SimplePeer();

    peer.on('signal', data => {
        socket.emit('signal', peerId, data);
    });
};

init();
