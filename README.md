- [Planning](#planning)
- [Briefing](#briefing)
- [Concept](#gekozen-concept)
- [Hammer.js](#hammerjs)
- [Feedback](#feedback)
- [Code](#code)


# REMINDER AAN MEZELF
- thuis werken met hotspot en 4G, niet met wifi want dat blokkeert de WebRTC verbinding door beveiliging op wifi

# Planning
### TEGEN 26/02 -> OK
- Briefing herlezen OK
- Github aanmaken + indienen OK
- concepten uitwerken OK
- qr-code communicatie tussen desktop en gsm OK
### TEGEN 05/03 -> OK
- planning rest van het project OK
- concept uitwerken OK
- core feautures bepalen + onderzoeken OK
- webrtc communicatie maken OK
### TEGEN 12/03 -> OK
- html - css - javascript scheiden OK
- index.html en receiver.html samenvoegen OK
- javascript library zoeken (hammer.js) voor touch events OK
- checken of iets wel wordt doorgestuurd OK
- schudden detectie maken -> desktop reageert met "fear detected" -> PROBLEEM -> opgelost OK
- swipen detectie maken -> desktop reageert met "laugh detected" OK
- tikken detectie maken -> desktop reageert met "anger detected" OK
- pinch detectie maken -> desktop reageert met "disgust detected" OK
- tilt detectie maken -> desktop reageert met "looking left/right" OK
- css aangepast OK
- gsm ui verbeteren -> duidelijke instructies, minimalistisch design -> css OK
- images toevoegen bij het detecteren van emoties -> PROBLEEM
### TEGEN 19/03
- code consistentie -> camelCase functies + soort functie hetzelfde houden OK
- script in html aanpassen naar script type module OK
- js -> init zonder domcontent maar gwn init() OK
- probleem met images oplossen OK
- karakter en emoties animeren OK
- animaties tonen bij het detecteren van emoties + standaard gezicht tonen als er geen emotie is OK
- overgangen tussen de emoties maken OK
- extra features toevoegen (bv. geluid op gsm bij emotie tonen op desktop) 
### TEGEN 22/03 = DEADLINE
- code simplifieren -> geen shake doorsturen wel de emotie, 1 if block voor alle emoties (index2.js)
- laatste problemen oplossen, testen, finetunen
- zorg voor consistentie in code (camelCase, functie-soort)


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

## 12/03
- 

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
-> voorbeeld van laugh gevolgd om dit te bekomen
-> HET WERKT
- tikken op het scherm zorgt ervoor dat er "anger detected" verschijnt op de desktop

## Pinch detectie -> disgust
#### sender.js
```javascript
const pinchDetection = () => {
    const hammer = new Hammer(document.body);
    hammer.on('pinch', (event) => {
        console.log("Pinch detected!");
        if (peer && peer.connected) {
            peer.send(JSON.stringify({ type: "pinch", emotion: "disgust" }));
        }
    });
};
```
#### index2.js
``` javascript
if (message.type === 'pinch') {
  console.log('Pinch detected via WebRTC!');
  if ($emoties) {
    $emoties.textContent = 'disgust detected';
    $emoties.style.display = 'block';
  }
}
```

### Werkt niet
Ik heb pinch detectie gerepareerd - het probleem was dat pinch niet standaard geactiveerd is in Hammer.js:

Wijzigingen:
sender.js:129-178:

- hammer.get('pinch').set({ enable: true }) toegevoegd (ESSENTIEEL!)
- Visuele feedback: oranje achtergrond en scaling bij pinchen
- Gele rand bij pinch start/end
- Throttling om dubbele berichten te voorkomen
- Werkt nu op dezelfde #area als tap en swipe
- sender.html:16-20: Tekst toegevoegd "Use 2 fingers to pinch" als hint
- sender.js:109-126: Tap detectie ook naar #area verplaatst voor consistentie

### NU werkt het wel
- fout was vooral de hammer.get op enabled zetten
- alle onnodige code terug verwijderd

```javascript
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
```

## Tilt detectie -> andere kant kijken
#### sender.js
```javascript
const TiltDetection = () => {
    const hammer = new Hammer(document.body);
    hammer.on('rotate', (event) => {
        console.log("Tilt detected!");
        if (peer && peer.connected) {
            peer.send(JSON.stringify({ type: "tilt", emotion: "looking" }));
        }
    });
};
```
#### index2.js
``` javascript
if (message.type === 'tilt') {
  console.log('Tilt detected via WebRTC!');
  if ($emoties) {
    $emoties.textContent = 'looking detected';
    $emoties.style.display = 'block';
  }
}
```

### werkt niet
-> ik dacht dat ik de rotate event van hammerjs ging kunnen gebruiken maar blijkbaar werkt dit niet zo

De tilt detectie is gerepareerd! Het probleem was dat Hammer.js 'rotate' voor screen gestures is, niet voor device tilt.

Wijzigingen in sender.js:157-210:
- Gebruikt nu DeviceOrientation API in plaats van Hammer.js
- Detecteert wanneer telefoon > 60° gekanteld is
- Leest beta (X-as) en gamma (Y-as) rotatie
- iOS permission handling toegevoegd (tap scherm om toe te staan)
- Throttling van 500ms om spam te voorkomen

Test het:
- Herstart de server
- Op iOS: tap het scherm één keer om orientation permission te geven
- Kantel je telefoon naar links/rechts of voor/achter
- Bij > 60° tilt verschijnt "looking detected" op desktop
- De tilt werkt alleen met fysiek kantelen van de telefoon, niet met screen gestures!

### NOG altijd niet
-> console.log("DEBUG tilt:", event.beta, event.gamma, event.alpha);

- debug om te zien of je tilt waarden binnen krijgt
- blijkt dat zowel tilt als shake denied worden
- website moet op https draaien om dit te kunnen oplossen

## https gebruiken
-> terminal:
```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

-> Update the server initialization code to use the SSL certificate:
```javascript
const fs = require('fs');
const options = {
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.cert')
};
const server = require('https').Server(options, app); // httpS instead of http
```

### Foutmelding
```
Error: ENOENT: no such file or directory, open '/localhost.key'
    at Object.openSync (node:fs:561:18)
    at Object.readFileSync (node:fs:445:35)
    at Object.<anonymous> (/Users/ambervanhooren/Desktop/CC4/Opdracht - webRTC/index.js:7:11)
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
  path: '/localhost.key'
}
```

-> oplossing
- de foutmelding kwam door een typfout in het pad van de naam van het certificaat

### Shake werkt al, tilt nog niet
-> tilt versimpelen om te zien waar het probleem zit
```javascript
const tiltDetection = () => {
    const debug = document.getElementById("debug");

    window.addEventListener("deviceorientation", (event) => {
        debug.textContent = `beta: ${event.beta}, gamma: ${event.gamma}`;
    });
};
```
-> tilt wordt gedetecteerd dus OK

```javascript
const tiltDetection = () => {
    const debug = document.getElementById("debug");
    let lastTiltTime = 0;

    window.addEventListener("deviceorientation", (event) => {
        const beta = event.beta;
        const gamma = event.gamma;

        debug.textContent = `beta: ${beta}, gamma: ${gamma}`;

        if (beta === null || gamma === null) return;

        const tiltThreshold = 15;
        const now = Date.now();

        // cooldown van 500ms
        if (now - lastTiltTime < 500) return;

        if (Math.abs(beta) > tiltThreshold || Math.abs(gamma) > tiltThreshold) {
            lastTiltTime = now;

            debug.textContent = `TILT DETECTED! beta: ${beta}, gamma: ${gamma}`;

            if (peer && peer.connected) {
                peer.send(JSON.stringify({
                    type: "tilt",
                    emotion: "looking"
                }));
            }
        }
    });
};
```
-> tilt detectie werkt nu ook!

kleine opmerking: 
- het is gevoelig -> treshold verhogen ??
- weet soms niet of ik shake of tilt bedoel

-> door de treshold te verhogen naar 30 is het minder gevoelig en weet het of ik shake of tilt

```javascript
const tiltDetection = () => {
    const debug = document.getElementById("debug");
    let lastTiltTime = 0;

    window.addEventListener("deviceorientation", (event) => {
        const beta = event.beta;
        const gamma = event.gamma;

        debug.textContent = `beta: ${beta}, gamma: ${gamma}`;

        if (beta === null || gamma === null) return;

        const tiltThreshold = 30;
        const now = Date.now();

        if (now - lastTiltTime < 500) return;

        let direction = null;
        if (Math.abs(beta) > tiltThreshold) {
            direction = beta > 0 ? "forward" : "backward";
        } else if (Math.abs(gamma) > tiltThreshold) {
            direction = gamma > 0 ? "right" : "left";
        }

        if (direction) {
            lastTiltTime = now;
            debug.textContent = `TILT DETECTED! Direction: ${direction}`;

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
```

### naar welke kant tilt het?
-> ik wil ook weten naar welke kant het tilt zodat ik dit kan gebruiken in de desktop animaties
-> zou dit ongeveer werken zoals swipe detectie dat ik richtingen meegaf?
-> werkt dus met de gamma en beta waarden

- links = gamma < 0
- rechts = gamma > 0
- boven = beta < 0
- onder = beta > 0

#### sender.js
```javascript
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
```
#### index2.js
```javascript
if (message.type === 'tilt') {
  console.log('Tilt detected via WebRTC!', message.direction);
  if ($emoties) {
    $emoties.textContent = 'looking detected (' + message.direction + ')';
    $emoties.style.display = 'block';
  }
}
```

## Aanpassingen swipe
-> eigenlijk moet ik daar niet weten in welke richting geswiped wordt
```javascript
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
```

-> versimpeling van de code aangezien ik de richting toch niet gebruik in de desktop animaties

## Reflectie op AI gebruik
- eenmaal de eerste emotie werkte ging het vlot en gebruikte ik AI enkel voor foutmeldingen of wanneer het niet werkte in ik niet zag hoe ik het kon oplossen
- ik snap wat er is gebeurd maar ik weet niet of ik dit zelf had kunnen bedenken

## Emotie images toevoegen (later omzetten naar animaties)
#### index.html
```html
    <div class="emoties" id="emotions">
        <img id="fear" src="/assets/fear.png">
        <img id="laugh" src="/assets/laugh.png">
        <img id="anger" src="/assets/anger.png">
        <img id="disgust" src="/assets/disgust.png">
        <img id="looking" src="/assets/looking.png">
    </div>
```
-> display none in css zodat ze niet zichtbaar zijn tot er een emotie gedetecteerd wordt

#### index2.js
```javascript
if (message.type === 'shake') {
    console.log('Shake detected via WebRTC!');
    if ($emoties) {
        $emoties.textContent = 'fear detected';
        document.getElementById('fear').style.display = 'block';
        setTimeout(() => {
            document.getElementById('fear').style.display = 'none';
        }, 2000);
    }
}
```
-> voorbeeld van shake gevolgd om dit te bekomen
-> ik heb dit gedaan voor alle emoties zodat er een afbeelding verschijnt bij elke emotie
 
KLIEN PROBLEEM
- in de console log wordt nog gedetecteer welke emotie er is
- geen image wordt getoond bij het detecteren van een emotie

### Probleem Images oplossen
#### Tijdens consult
- in de index.html stond een typfout, daar stond "emoticons" ipv "emotions"
- foutmelding in console.log
    ```
    index2.js:96 Uncaught ReferenceError: $emotiesTekst is not defined
    at p.<anonymous> (index2.js:96:17)
    at r.emit (simplepeer.min.js:6:29537)
    at c (simplepeer.min.js:6:43442)
    at l (simplepeer.min.js:6:43301)
    at s.push (simplepeer.min.js:6:47421)
    at p._onChannelMessage (simplepeer.min.js:6:95965)
    at _channel.onmessage (simplepeer.min.js:6:88652)
    ```

- typfout in index2.js, daar stond bovenaan $emotiestekst terwijl bij de emoties $emotiesTekst stond

-> nu worden wel de images en de tekst getoond bij het detecteren van een emotie

## Emotie animaties toevoegen
- animatie per emotie
- standaard emotie afbeelding wordt getoond als geen emotie gedetecteerd wordt

### prompt
```
Zorg ervoor dat wanneer geen emotie gedecteerd wordt dat de image "default.png" getoond wordt, als een emotie gedetecteerd wordt moet de animatie passend bij de emotie getoond worden, deze staan als .json files in mijn assets.
```

### antwoord
Aangepast: als er geen emotie is, wordt nu standaard de default-afbeelding getoond; bij detectie wordt de juiste JSON-animatie geladen.

#### index.html:
- Nieuwe default + animatiecontainer in de desktop-UI:index.html:17
- Default afbeelding staat op index.html:19
- Lottie script toegevoegd op index.html:30
- Centrale weergavelogica toegevoegd:

``` html
<body>
    <h1 class="titel">Desktop</h1>
    <a class="url" id="url" href=""></a>
    <div class="qr" id="qr"></div>
    <div class="emoties" id="emoties">
        <div id="emotiesTekst"></div>
        <img id="defaultImage" src="./assets/Default.png" alt="Default emotie">
        <div id="emotionAnimation" aria-live="polite"></div>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"
        integrity="sha512-ZDSPMa/JM1D+7kdg2x3BsruQ6T/JpJo3jWDWkCZsP+5yVyp1KfESqLI+7RqB5k24F7p2cV7i2YHh/890y6P6Sw=="
        crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/simple-peer/9.11.1/simplepeer.min.js"
        integrity="sha512-0f7Ahsuvr+/P2btTY4mZIw9Vl23lS6LY/Y7amdkmUg2dqsUF+cTe4QjWvj/NIBHJoGksOiqndKQuI9yzn2hB0g=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script type="module" src="/javascript/index2.js"></script>
</body>
```

#### index2.js:
- Mapping van events naar JSON assets op index2.js:12
- Mapping van tilt-richtingen naar JSON assets op index2.js:19
- Fallback naar default via showDefaultState op index2.js:33
- Animatie tonen via showEmotionAnimation op index2.js:55
- button event valt expliciet terug op default (geen emotie): index2.js:152
- shake/swipe/tap/pinch tonen respectievelijke animaties: index2.js:160
- tilt toont richting-animatie (boven/onder/links/rechts) of default bij onbekende richting: index2.js:188
- Bij init wordt direct default getoond: index2.js:205

```javascript
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
};

const showEmotionAnimation = (assetPath, label) => {
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

    resetToDefaultTimer = setTimeout(() => {
        showDefaultState('no emotion detected');
    }, 2000);
};
```

```javascript
if (message.type === 'button') {
            console.log(`Button ${message.value} pressed via WebRTC!`);
            if ($emoties) {
                $emoties.style.display = 'block';
                showDefaultState('no emotion detected');
            }
        }

        if (message.type === 'shake') {
            console.log('Shake detected via WebRTC!');
            if ($emoties) {
                showEmotionAnimation(emotionAnimationMap.shake, 'fear detected');
            }
        }

        if (message.type === 'swipe') {
            console.log('Swipe detected via WebRTC!');
            if ($emoties) {
                showEmotionAnimation(emotionAnimationMap.swipe, 'laugh detected');
            }
        }

        if (message.type === 'tap') {
            console.log('Tap detected via WebRTC!');
            if ($emoties) {
                showEmotionAnimation(emotionAnimationMap.tap, 'anger detected');
            }
        }

        if (message.type === 'pinch') {
            console.log('Pinch detected via WebRTC!');
            if ($emoties) {
                showEmotionAnimation(emotionAnimationMap.pinch, 'disgust detected');
            }
        }

        if (message.type === 'tilt') {
            console.log('Tilt detected via WebRTC!', message.direction);
            if ($emoties) {
                const directionAsset = directionAnimationMap[message.direction];
                if (directionAsset) {
                    showEmotionAnimation(directionAsset, 'looking detected (' + message.direction + ')');
                } else {
                    showDefaultState('no emotion detected');
                }
            }
        }
```


#### index.css:
- CSS bijgewerkt voor nieuwe elementen
```css
#emotionAnimation {
    width: 25rem;
    min-height: 25rem;
}
```

### Reflectie op AI gebruik
- ik had echt geen idee hoe ik dit moest aanpakken
- ik snap wat er is gebeurd maar ik weet niet of ik dit zelf had kunnen bedenken


## Geluid toevoegen bij emotie detectie
#### index.html
```html
<audio id="fearAudio" src="./assets/fear.mp3"></audio>
<audio id="laughAudio" src="./assets/laugh.mp3"></audio>
<audio id="angryAudio" src="./assets/angry.mp3"></audio>
<audio id="disgustAudio" src="./assets/disgust.mp3"></audio>
<audio id="lookingAudio" src="./assets/looking.mp3"></audio>
```
-> audio elementen toegevoegd voor elke emotie
#### index2.js
```javascript
const emotionAudioMap = {
    shake: document.getElementById('fearAudio'),
    swipe: document.getElementById('laughAudio'),
    tap: document.getElementById('angryAudio'),
    pinch: document.getElementById('disgustAudio'),
    tilt: document.getElementById('lookingAudio')
};  

```
-> mapping van emotie types naar audio elementen
```javascript
const playEmotionAudio = (type) => {
    const audio = emotionAudioMap[type];
    if (audio) {
        audio.currentTime = 0; 
        audio.play();
    }
};
```
-> functie om audio af te spelen bij emotie detectie
```javascript
if (message.type === 'shake') {
    console.log('Shake detected via WebRTC!');
    if ($emoties) {
        showEmotionAnimation(emotionAnimationMap.shake, 'fear detected');
        playEmotionAudio('shake');
    }
}
```
-> bij elke emotie detectie wordt nu ook de bijhorende audio afgespeeld bij shake, swipe, tap, pinch en tilt events.
