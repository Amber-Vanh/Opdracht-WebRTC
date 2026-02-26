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
- Desktop console/log die emoties toont door bewegingen van de smartphone: “fear detected” “laugh detected” “anger detected” “disgust detected” “looking left/right”
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

# Feedback - 26/02
Concept 1 is beste
- maak combi met ml5 waardoor mensen op hun eigen gezicht dingen kunnen doen
- zorg dat er logica zit achter de gsm-functies dat ze uitvoeren

WebRTC
- qr-code staat goed
- surf niet via localhost maar via ip-adres:8080
- communicatie tussen desktop en gsm via webrtc ipv websockets
- noteer welk AI-systeem je gebruikt 
- zorg dat website communicatie tegen volgende week in orde is

# Code qr-code
## foutmelding
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

# Code WebRTC communicatie
## foutmelding - copilot
ReferenceError: Cannot access 'app' before initialization
at Object.

-> code fout geplaatst in index.js, app wordt gebruikt voordat het is gedefinieerd.
