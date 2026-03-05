- [Planning](#planning)
- [Briefing](#briefing)
- [Concept](#gekozen-concept)
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
- html - css - javascript scheiden 
- index.html en receiver.html samenvoegen OK
- javascript library zoeken (hammer.js) voor touch events
- checken of iets wel wordt doorgestuurd met button testen
- schudden detectie maken -> desktop reageert met "fear detected"
- swipen detectie maken -> desktop reageert met "laugh detected"
- tikken detectie maken -> desktop reageert met "anger detected"
- pinch detectie maken -> desktop reageert met "disgust detected"
- tilt detectie maken -> desktop reageert met "looking left/right"
### Week 5
- karakter en emoties animeren 
- gezichtsuitdrukking van het karakter aanpassen aan de emoties
- overgangen tussen de emoties maken
### Week 6
- gsm ui verbeteren -> duidelijke instructies, minimalistisch design -> css
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

