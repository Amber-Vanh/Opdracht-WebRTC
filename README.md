- [Planning](#planning)
- [Briefing](#briefing)
- [Concept](#gekozen-concept)
- [Hammer.js](#hammerjs)
- [Feedback](#feedback)
- [Code](#code)

# Planning
### Week 2
- Briefing herlezen OK
- Github aanmaken + indienen OK
- concepten uitwerken OK
- qr-code communicatie tussen desktop en gsm OK
### Week 3
- planning rest van het project OK
- concept uitwerken OK
- core feautures bepalen + onderzoeken OK
- webrtc communicatie maken OK
### Week 4
- html - css - javascript scheiden OK
- index.html en receiver.html samenvoegen OK
- javascript library zoeken (hammer.js) voor touch events OK
- checken of iets wel wordt doorgestuurd OK
- schudden detectie maken -> desktop reageert met "fear detected" -> PROBLEEM
- swipen detectie maken -> desktop reageert met "laugh detected" OK
- tikken detectie maken -> desktop reageert met "anger detected" OK
- pinch detectie maken -> desktop reageert met "disgust detected" 
- tilt detectie maken -> desktop reageert met "looking left/right"
### Week 5
- karakter en emoties animeren 
- gezichtsuitdrukking van het karakter aanpassen aan de emoties
- overgangen tussen de emoties maken
### Week 6
- gsm ui verbeteren -> duidelijke instructies, minimalistisch design -> css
- extra features toevoegen (bv. geluid op gsm bij emotie tonen op desktop)
- laatste problemen oplossen, testen, finetunen
- indienen -> deadline 22 maart.

# Briefing
### Minimaal
- 1 op 1  controle met qr-code
- mag oud schoolproject zijn
- instructies en besturing duidelijk maken
- webrtc data channels voor de aansturing
- Websockets voor signalling layer
### Bonuspunten
- accelerometer = versnelling in 3 assen = kantelbesturing, schuddetectie, jump/ boost
- gyroscoop = rotatiesnelheid = camera rotaties, vr-achtige dingen
- device orientation api = combi van bovenstaande = gsm als stuur
- magnetometer = tov noorden = 3d game richting
- proximity meter = "hand-near-device" = interactie zonder scherm aanraken
- ambient light sensor = lichtintensiteit = aanpassingen in de game, of als input
- Touch & Gesture Input = tikken, swipen, knijpen = menu navigatie, acties in game
- microfoon input = geluid detectie
- camera = qr-scannen, video-overlay, AR-elementen

# Concept
## Idee 1 - Karakter
Op de desktop staat een klein 2D/3D‑karakter.
De smartphone stuurt geen knoppen, maar gevoelens via gestures, tilt, snelheid van swipes, of micro‑interacties. 

- bang = schudden
- lachen = swipen (kietelen)
- boos = tikken
- disgust = pinch
- andere kant kijken = tilt

## Idee 2 - Clicker game
aanpassingen van clicker game van CC2. Het is een game waarbij je bloemen moet planten en die moet verzorgen, ook komt nu en dan een gnoom in beeld dat je moet verslaan om geen bloemen te verliezen. 

- bloemen planten = klikken
- gnoom doden = schudden
- bloemen verzorgen = schudden/ tilt

## Idee 3 - Huisdier
Een klein digitaal huisdiertje leeft op de desktop. De smartphone fungeert als controller.

- eten geven = shake (eten shaken)
- aaien = touch
- ander ras = swipe
- speeltje gooien = proximity/ microfoon

## Idee 4 - 3D-wereld
De desktop toont een 3D‑scene (bijv. een kubus, een klein landschap, een character). De smartphone bestuurt de camera of een object.

- rondkijken = tilt/ bewegen
- veranderen van wereld = swipe
- object doen ontploffen = shake


## Idee 5 - presentatie controller
Gebruik je smartphone om slides op de desktop te besturen.

- pointer laser = beweeg
- dia veranderen = swipe

# Gekozen Concept
## Desktop 
= 2d karakter 
## smartphone 
= minimalistische ui 
= "Probeer de emotie van het karkater te veranderen door te schudden, te swipen of te tikken op je scherm. Welke emotie kun jij oproepen?"
## Emotie mapping
### Bang = schudden
- accelerometer detecteert hoge amplitude / random spikes
- Interpretatie: “chaos → angst”
- Gezicht: grote ogen, sippe mond, angsige wenkbrauwen
### Lachen = swipen (kietelen)
- Input: snelle horizontale of verticale swipes
- Interpretatie: “kietelen → lachen”
- lachende mond, vrolijke wenkbrauwen, rode wangen
### Boos — tikken / hard drukken
- Input: korte, krachtige taps (touch events)
- Interpretatie: “prikkel → irritatie → boosheid”
- Gezicht: fronsende wenkbrauwen, strakke mond
### Disgust = pinch
- Input: pinch‑gesture (twee vingers naar elkaar)
- Interpretatie: “iets vies → terugtrekken”
- Gezicht: neus optrekken, mondhoeken naar beneden
### Andere kant kijken = tilt
- Input: tilt van de telefoon (device orientation)
- Interpretatie: kantelen -> kijkrichting
- Gezicht: ogen draaien naar de kant

## Core features
- qr-code koppeling tussen desktop en smartphone
- webrtc data channel communicatie
- accelerometer detectie van schudden -> bang
- swipe detectie met touch events -> lachen
- tik detectie met touch events -> boos
- pinch detectie met touch events en 2 vingers -> disgust
- tilt detectie met device orientation -> andere kant kijken
- desktop ontvangen van emotie en aanpassen van gezicht
- animaties van emoties van karakter -> lottie

## Voorbeeld code (copilot generated)
### bang = shake detectie
```javascript
let lastShake = 0;

window.addEventListener("devicemotion", (e) => {
  const acc = e.accelerationIncludingGravity;
  const magnitude = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);

  if (magnitude > 25 && Date.now() - lastShake > 500) {
    lastShake = Date.now();
    sendEmotion("fear", magnitude / 30);
  }
});
```

### lachen = swipe detectie
```javascript
let startX = 0;
let startY = 0;
let startTime = 0;

window.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  startX = t.clientX;
  startY = t.clientY;
  startTime = Date.now();
});

window.addEventListener("touchend", (e) => {
  const t = e.changedTouches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;
  const dt = Date.now() - startTime;

  const distance = Math.sqrt(dx*dx + dy*dy);
  const velocity = distance / dt;

  if (velocity > 0.5) {
    sendEmotion("laugh", Math.min(velocity, 2));
  }
});
```

### boos = tap detectie
```javascript
window.addEventListener("touchstart", () => {
  this.touchStartTime = Date.now();
});

window.addEventListener("touchend", () => {
  const duration = Date.now() - this.touchStartTime;

  if (duration < 150) {
    sendEmotion("anger", 1);
  }
});
```

### disgust = pinch detectie
```javascript
let initialDistance = null;

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    const [t1, t2] = e.touches;
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (!initialDistance) initialDistance = distance;

    if (distance < initialDistance * 0.7) {
      sendEmotion("disgust", 1);
    }
  }
});

window.addEventListener("touchend", () => {
  initialDistance = null;
});
```

### andere kant kijken = tilt detectie
```javascript
window.addEventListener("deviceorientation", (e) => {
  const gamma = e.gamma; // -45 = links, +45 = rechts

  if (gamma < -10) sendEmotion("look_left", Math.abs(gamma) / 45);
  if (gamma > 10) sendEmotion("look_right", gamma / 45);
});
```

### desktop 
```javascript
function handleEmotion(type, intensity) {
  switch(type) {
    case "fear":
      character.setState("fear", intensity);
      break;
    case "laugh":
      character.setState("laugh", intensity);
      break;
    case "anger":
      character.setState("anger");
      break;
    case "disgust":
      character.setState("disgust");
      break;
    case "look_left":
      character.lookLeft(intensity);
      break;
    case "look_right":
      character.lookRight(intensity);
      break;
  }
}
```

### karakter animaties
```javascript
const animations = {
  idle: lottie.loadAnimation({ container: el, path: "idle.json" }),
  fear: lottie.loadAnimation({ container: el, path: "fear.json" }),
  laugh: lottie.loadAnimation({ container: el, path: "laugh.json" }),
  anger: lottie.loadAnimation({ container: el, path: "anger.json" }),
  disgust: lottie.loadAnimation({ container: el, path: "disgust.json" }),
};

function setState(state) {
  Object.values(animations).forEach(a => a.stop());
  animations[state].play();
}
```
# Hammer.js
Hammer is a open-source library that can recognize gestures made by touch, mouse and pointerEvents.

## usage
By default it adds a set of recognisers for common gestures:
- tap
- doubletap
- press
- horizontal pan
- swipe
- the multi-touch pinch
- rotate

viewport meta tag is recommended, it gives more control back to the webpage by disabling the doubletap/pinch zoom.
``` html
<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
```

```
npm install hammerjs
```

## Gebruiken in project
```
import Hammer from 'hammerjs';

const element = document.getElementById('my-element');
const hammer = new Hammer(element);

hammer.on('pan', (ev) => {
  console.log(ev);
});
```


# Feedback 
## 26/02
Concept 1 is beste
- maak combi met ml5 waardoor mensen op hun eigen gezicht dingen kunnen doen
- zorg dat er logica zit achter de gsm-functies dat ze uitvoeren

WebRTC
- qr-code staat goed
- surf niet via localhost maar via ip-adres:8080
- communicatie tussen desktop en gsm via webrtc ipv websockets
- noteer welk AI-systeem je gebruikt 
- zorg dat website communicatie tegen volgende week in orde is

## 05/03
- mobile moet initiator zijn, zorgt voor een stap minder => al oke
- css en javascript scheiden van html
- idex + receiver samenvoegen tot 1 html bestand
- vb. als boos -> geluid op gsm -> werken in 2 richtingen
- reflectie van ai schrijven bij gebruik van ai
- javascript library gebruiken voor de touch events (hammer.js) -> maakt het makkelijker en betrouwbaarder
- planning week 4 gedetailleerder maken -> per feature


# Code
## foutmelding qr-code
Copilot -> 
(index):29 Uncaught (in promise) TypeError: Cannot set properties of null (setting 'textContent')
at Socket.<anonymous> ((index):29:38)
at Emitter.emit (index.js:136:20)
at Socket.onconnect (socket.js:612:14)
at Socket.onpacket (socket.js:499:26)
at Emitter.emit (index.js:136:20)
at manager.js:217:18

### oplossing
The error occurs because the code is trying to access DOM elements that don't exist in your HTML. At line 29, it's trying to set textContent on an element with id url, but there's no such element in the page.

## foutmelding WebRTC communicatie
Copilot ->
ReferenceError: Cannot access 'app' before initialization
at Object.

-> code fout geplaatst in index.js, app wordt gebruikt voordat het is gedefinieerd.


## Samenvoegen van index.html en receiver.html
### prompt
Zou je de index.html en receiver.html kunnen samenvoegen in de index.html tot 1 bestand sinds dit over hetzelfde gaat

### antwoord
Ik zal de bestanden samenvoegen. Beide zijn voor de desktop/receiver kant - een genereert de QR code en de ander
handelt de WebRTC verbinding af. Ik voeg ze samen in index.html

Klaar! Ik heb index.html bijgewerkt met de functionaliteit van beide bestanden:
- QR code generatie voor het delen van de verbindings-URL
- WebRTC verbindingslogica voor het ontvangen van peer signals
- Styling voor video elementen
- SimplePeer library toegevoegd (deze ontbrak maar is nodig voor WebRTC)

Het bestand bevat nu zowel de QR code setup als de WebRTC receiver functionaliteit in één overzichtelijk bestand.

### Reflectie
- Het samenvoegen van de bestanden maakte het overzichtelijker en verminderde de kans op fouten door ontbrekende elementen of variabelen.
- Door het samenvoegen met Copilot te maken voorkom ik fouten te maken door dingen verkeerd te plaatsen of te vergeten. Ook is dit vlotter dan alles zelf uit te voeren. 
- Alles werkt dus TOP

## html - css - javascript scheiden
### prompt
als ik de html, css, javascript wil scheiden van elkaar zou ik de css en javascript bestanden dan in de public moeten plaatsen of?

### antwoord
Ja, precies! Als je de HTML, CSS en JavaScript wilt scheiden, moeten alle bestanden in de public folder staan (of in subfolders binnen public), omdat dat de folder is die door je server publiek toegankelijk wordt gemaakt.

Een veelgebruikte structuur zou zijn:
public/
  ├── index.html
  ├── sender.html
  ├── css/
  │   └── style.css
  └── js/
      ├── index.js
      └── sender.js
  
### Reflectie
- Ik wist niet zeker hoe het precies moet sinds de algemene index.js file niet in de public folder staan
- het is beter van te vragen en zeker te zijn dan zelf dingen te proberen en fouten te maken die ik kon vermijden.
  
### code aanpassingen
- aanmaken van css/index.css en css/sender.css
- aanmaken van js/index.js en js/sender.js
- verplaatsen van css en javascript code uit index.html en sender.html naar de nieuwe bestanden
- aanpassen van index.html en sender.html om de nieuwe css en js bestanden te linken

### Het loopt fout
- bij het overzetten van de code van index.html naar index.js kreeg ik een rood onderlijnd stuk code

### prompt
hier loopt iets fout, wat is het probleem?

### antwoord
Ik zie het probleem! De template literal syntax is verkeerd geformatteerd. Er staan overal spaties tussen de $ en {, en tussen andere karakters. Dit zou moeten zijn:

Fout: $ { socket.id }
Correct: ${socket.id}

Ook in de URL: /sender.html?id= moet zonder spaties.

Laat me het hele bestand corrigeren:
Opgelost! De problemen waren:

- Template literal syntax: $ {socket.id} moet ${socket.id} zijn (geen spatie tussen $ en {)
- URL formatting: /sender.html?id= moet zonder spaties
- Vreemde puntkommas op aparte regels zijn nu correct geplaatst
- Overbodige witruimte verwijderd
Het bestand is nu correct geformatteerd en JavaScript zal de template literals nu goed interpreteren.

-> Hetzelfde probleem had ik ook bij sender.js, dus dat heb ik ook aangepast met AI.

### Reflectie
- het probleem was dat sinds ik code kopieerde van html naar javascript dat er rare spacing werd gebruikt
- het is vlotter om dit aan te passen met AI dan dit zelf uit te zoeken aangezien ik wist waar de fout zat maar niet hoe ik dit moest oplossen

## Emoties toevoegen
### Hammerjs toevoegen
- npm install hammerjs
- html aanpassen
  ```html
  <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
  ```
- import hammer in sender.js
  ```javascript
  import Hammer from 'hammerjs';
  ```

## Button voor testing van communicatie
- in sender.html een button toevoegen
```html
<button id="testButton">Test Message</button>
```
- in sender.js event listener toevoegen voor de button
```javascript
document.getElementById('testButton').addEventListener('click', () => {
  socket.emit('testMessage', desktopId, 'Hello from the sender!');
});
```
- in index.js event listener toevoegen voor 'testMessage'
```javascript
socket.on('testMessage', (desktopId, message) => {
  console.log(`Test message from ${socket.id} to ${desktopId}: ${message}`);
  io.to(desktopId).emit('testMessage', message);
});
```
- in index.html event listener toevoegen voor ontvangen van 'testMessage'
```javascript
socket.on('testMessage', (message) => {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = `Received test message: ${message}`;
  messageDiv.style.display = 'block';
});
```
### Foutmelding
sender.js:15 Uncaught ReferenceError: desktopId is not defined
    at HTMLButtonElement.<anonymous> (sender.js:15:36)

-> DesktopId is niet gedefnieerd in sender.js

### Oplossing
Ik zie het probleem - de testMessage handler staat verkeerd in de client-side index.js. Dit moet op de server gebeuren. Laat me dit oplossen:
Opgelost! De problemen waren:
- desktopId niet gedeclareerd - Deze wordt nu uit de URL parameters gehaald in sender.js
- Message handler stond verkeerd - Was in client-side code, moet op de server staan in index.js
- Message div ontbrak - Toegevoegd aan index.html

Nu werkt de flow correct:
- Sender button → Socket.IO → Server → Socket.IO → Desktop
- Desktop toont bericht gedurende 5 seconden

### Werkt niet -> fout met connectie
- bij het klikken op de test button in sender.html krijg ik geen console log in index.html en ook geen bericht te zien op de desktop
- WebRTC peer connectie niet beschikbaar of niet verbonden

Hulp van Copilot om probleem op te lossen:
- heel wat console logs om te zien waar het fout gaat
- foutmelding die bleef terugkeren
  installHook.js:1 ❌ Peer error: Error: Connection failed.
    at p._onConnectionStateChange (simplepeer.min.js:6:91542)
    at _pc.onconnectionstatechange (simplepeer.min.js:6:81452)
- dit betekent dat de WebRTC verbinding niet tot stand komt, waardoor de socket communicatie ook niet werkt

-> Fout bleef optreden
-> helemaal opnieuw begonnen
- opnieuw begonnen met een schone index.html en sender.html
- stap voor stap de code toegevoegd en getest
- eerst qr-code communicatie getest -> werkte
- daarna de test button toegevoegd 

### nieuwe error
Error: ENOENT: no such file or directory, open './localhost.key'
    at Object.openSync (node:fs:561:18)
    at Object.readFileSync (node:fs:445:35)
    at Object.<anonymous> (/Users/ambervanhooren/Desktop/CC4/Opdracht - webRTC/index.js:6:11)
    at Module._compile (node:internal/modules/cjs/loader:1706:14)
    at Object..js (node:internal/modules/cjs/loader:1839:10)
    at Module.load (node:internal/modules/cjs/loader:1441:32)
    at Function._load (node:internal/modules/cjs/loader:1263:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:237:24)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: './localhost.key'
}

-> oplossing
De server probeerde HTTPS te gebruiken maar de SSL certificaten bestaan niet. Ik heb het gewijzigd naar HTTP voor lokale ontwikkeling.

### Volgende foutmelding
simplepeer.min.js:6 Uncaught Error: Connection failed.
    at p._onConnectionStateChange (simplepeer.min.js:6:91542)
    at _pc.onconnectionstatechange (simplepeer.min.js:6:81452)

-> fout EINDELIJK gevonden
``` javascript
config: {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
            urls: 'turn:your-turn-server.com:3478',
            username: 'user',
            credential: 'pass'
        }
    ]
}
```
MOET IN peer = new SimplePeer({ initiator: true, config: { iceServers: [...] } }) staan
``` javascript
const peer = new SimplePeer({
        initiator: true,
        trickle: true,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                {
                    urls: 'turn:your-turn-server.com:3478',
                    username: 'user',
                    credential: 'pass'
                }
            ]
        }
    });
```
-> NOPE nog altijd foutmeling
-> PROBLEEM EINDELIJK GEVONDEN
- Blijkt dat op de wifi bij mij thuis extra beveiliging is waardoor WebRTC verbindingen worden geblokkeerd.
- als ik via 4G en dan persoonlijke hotspot verbindt, werkt alles wel
- 3 uur van mijn leven verspild aan een probleem die er eigenlijk niet was

### test button
- nu dat de WebRTC verbinding werkt, kan ik eindelijk testen of de test button ook werkt

-> BUTTON WERKT

## Shake detectie -> Bang
De eerste emotie doe ik met AI zodat ik snap hoe het in elkaar zit met de hammerjs erbij

### prompt
Ik wil dat wanneer met de gsm geschud wordt dat op de desktop een tekstje komt "fear detected" in de div met id="emoties". doe deze communicatie met webrtc en doe de shake detectie met hammerjs

### antwoord
index.js:8: Static route toegevoegd voor node_modules folder
sender.html:19: CDN vervangen door hammer.min.js

Sender.js:
```javascript
const setupShakeDetection = () => {
    const hammer = new Hammer(document.body);
    hammer.on('shake', () => {
        console.log('Shake detected!');
        if (peer && peer.connected) {
            peer.send(JSON.stringify({ type: 'shake', emotion: 'fear' }));
        }
    });
};
```
Index2.js:
```javascript
    peer.on('data', data => {
        const message = JSON.parse(data.toString());
        if (message.type === 'button') {
            console.log(`Button ${message.value} pressed via WebRTC!`);
        } else if (message.type === 'shake') {
            console.log('Shake detected via WebRTC!');
            if ($emoties) {
                $emoties.textContent = 'fear detected';
                $emoties.style.display = 'block';
            }
        }
    });
```

### Foutmelding
Uncaught SyntaxError: Cannot use import statement outside a module (Sender.js:1)

Sender.js:1
``` javascript
  import Hammer from 'hammerjs';
```
-> verwijderen en toevoegen in de sender.html
```html
  <script src="/node_modules/hammerjs/hammer.min.js"></script>
```

### Probleem
- shake detectie werkt niet via hammerjs
- handmatig maken van een shake event

#### index2.js:
```javascript
    if (message.type === 'shake') {
      console.log('Shake detected via WebRTC!');
      if ($emoties) {
        $emoties.textContent = 'fear detected';
        $emoties.style.display = 'block';
      }
    }
```

#### sender.js:
```javascript
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

            if (deltaX + deltaY + deltaZ > 25) {
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
```

### Reflectie op AI gebruik
- de code voor sender.js zou ik echt nooit zelf kunnen schrijven

### Shake werkt niet
Prompt:
- het stuurt geen bericht uit of de desktop ontvangt geen bericht bij het versturen van de shakedetectie

Oplossing:
- console logs toevoegen -> kan je niet zien op mobile dus nutteloos
- ook na aanpassingen lijkt het niet te werken
- vragen op consult volgende week

## Swipe detectie -> lachen
#### sender.js
```javascript
const swipeDetection = () => {
    const hammer = new Hammer(document.body);
    hammer.on('swipe', (event) => {
        console.log("Swipe detected!");
        if (peer && peer.connected) {
            peer.send(JSON.stringify({ type: "swipe", emotion: "laugh" }));
        }
    });
};
```
-> voorbeeld van hammerjs gevolgd om dit te bekomen

#### index2.js
``` javascript
if (message.type === 'swipe') {
  console.log('Swipe detected via WebRTC!');
  if ($emoties) {
    $emoties.textContent = 'laugh detected';
    $emoties.style.display = 'block';
  }
}
```

### Probleem -> werkt niet
Ik heb de swipe detectie verbeterd in sender.js:80-101:

Wijzigingen:
- Swipe recognizer expliciet geconfigureerd met alle richtingen (left, right, up, down)
- Lagere threshold (10) en velocity (0.3) voor meer gevoeligheid
- Swipe richting wordt nu meegestuurd

Mogelijke oorzaken waarom het niet werkte:
- Hammer.js swipe recognizer had geen configuratie
- Default threshold was te hoog
- Alleen horizontale swipes waren mogelijk

Test door op je telefoonscherm te swipen (niet schudden). Je zou nu "laugh detected" moeten zien op de desktop.

### Nope nog altijd niets
Ik heb de swipe detectie volledig vernieuwd met visuele feedback:

Wijzigingen:
- sender.html:7-35: Grote paarse SWIPE AREA toegevoegd met touch-action: none
- sender.html:14-15: Feedback div die swipe richting toont
- sender.js:80-142:
- Swipe op specifieke swipe area (niet hele body)
- Controleert of Hammer.js geladen is
- Oranje feedback toont swipe richting
- Rode melding als peer niet verbonden is
- Console logs voor debugging

Nu zie je:
- Een grote paarse box met "← SWIPE HERE →"
- Oranje melding "SWIPE LEFT/RIGHT/UP/DOWN DETECTED!" bij swipen
- Rode melding als Hammer.js niet geladen is of peer niet verbonden
- Herstart de server en swipe over de paarse box. Je zou direct visuele feedback moeten zien!

### Reflectie
- ik zag het probleem met de swipe detectie echt niet
- ik snap wat AI allemaal heeft uitgevoerd maar weet vaak niet hoe ik dit zelf had kunnen bedenken of schrijven
- ik heb achterna alle overbodige code handmatig weggedaan en het werkte nog altijd dus ik weet dat ik snap wat er is gebeurd

### HET WERKT
- swipe area zorgde ervoor dat het werkte
- alle overbodige code terug weg gedaan
- werkt nog altijd

#### sender.js
```javascript
const swipeDetection = () => {
    const area = document.getElementById('area');
    const hammer = new Hammer(area);

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
```

## Tik detectie -> boos
#### sender.js
```javascript
const tapDetection = () => {
    const hammer = new Hammer(document.body);
    hammer.on('tap', (event) => {
        console.log("Tap detected!");
        if (peer && peer.connected) {
            peer.send(JSON.stringify({ type: "tap", emotion: "laugh" }));
        }
    });
};
```
-> voorbeeld van hammerjs gevolgd om dit te bekomen

#### index2.js
``` javascript
if (message.type === 'tap') {
  console.log('Tap detected via WebRTC!');
  if ($emoties) {
    $emoties.textContent = 'anger detected';
    $emoties.style.display = 'block';
  }
}
```

-> HET WERKT
- tikken op het scherm zorgt ervoor dat er "anger detected" verschijnt op de desktop

## Pinch detectie -> disgust
