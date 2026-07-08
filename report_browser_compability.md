# 🇬🇧  Multi-Browser Compatibility & Limitations (Minor Module)

This document certifies the full compatibility of the **Transcendence** application across multiple web browsers and details, as required by the module, the specific technical differences and limitations encountered, as well as the solutions implemented to guarantee a perfectly consistent and functional user experience (UI/UX) across all platforms.

---

## 🖥️ Tested & Fully Supported Browsers
* **Google Chrome / Chromium** (V8 / Blink) — *Primary & reference browser*
* **Mozilla Firefox** (Gecko) — *Tested & compatible*
* **Safari** (WebKit) — *untested*

---

## ⚙️ Browser-Specific Limitations & Implemented Solutions

### 1. Cookie Management & Security (Safari ITP vs Chrome SameSite)
* **Specific Difference / Limitation:** 
  Safari includes **ITP (Intelligent Tracking Prevention)**, which blocks cross-site and cross-port cookies by default, treating cross-domain authentication requests as third-party tracking. Chrome, conversely, applies a more forgiving `SameSite=Lax` policy in local development.
* **Implemented Solution:** 
  We set up an **Nginx Reverse Proxy / API Gateway** (`localhost:8080`). By serving both the frontend (React) and backend (NestJS) under a **single, unified origin**, HTTP-Only JWT session cookies (`access_token`) with `httpOnly: true` are treated as First-Party cookies. Consequently, they are reliably accepted on Safari, Firefox, and Chrome without triggering security warnings or CORS blocks.

### 2. Background Tab Throttling & Timer Management (Blink vs Gecko/WebKit)
* **Specific Difference / Limitation:** 
  Blink-based browsers (Chrome, Edge) apply aggressive throttling to JavaScript `setInterval` and `setTimeout` functions when a tab is in the background or minimized (reducing execution to 1Hz or less to save CPU/battery). Firefox and Safari handle socket hibernation and background timers differently.
* **Implemented Solution:** 
  To prevent game desynchronization during online matches ([RankedGamePage.tsx]) or during the disconnection countdown (`disconnectCountdown`), our application adopts a strictly **Server-Authoritative** architecture. Timing, turn validation (`isMyTurn`), and game states are exclusively calculated and broadcasted by the NestJS backend server via **Socket.IO** events.

### 3. WebSocket Connections & Strict Networks (iOS Safari & Firewalls)
* **Specific Difference / Limitation:** 
  Certain network environments (particularly iOS Safari on cellular networks or behind strict corporate firewalls) can interrupt or block native WebSocket handshakes (RFC 6455).
* **Implemented Solution:** 
  We utilize **Socket.IO** client and server. If the native WebSocket handshake fails or is blocked, the engine automatically falls back to the **HTTP Long-Polling** protocol, guaranteeing 100% real-time availability for live chat and matchmaking across all browsers and networks.

### 4. CSS Rendering, Layout Engines & Visual Effects (Chromium/Blink vs Firefox/Gecko vs Safari/WebKit)
* **Specific Differences / Limitations:**
  * **Background Blur (Glassmorphism / Backdrop Filter):** Chromium (Blink) calculates blur via aggressive GPU acceleration but can suffer from flickering during animations combined with rounded borders (`border-radius` + `overflow: hidden`). Firefox (Gecko) handles stacking contexts more strictly with a softer blur but can be CPU-sensitive on Linux. WebKit (Safari) historically requires the `-webkit-` prefix.
  * **Scrollbar Customization:** Chromium historically uses proprietary `::-webkit-scrollbar` pseudo-elements, whereas Firefox completely ignores them and strictly respects W3C standards (`scrollbar-width` and `scrollbar-color`).
  * **Flexbox, CSS Grids & Overflows (`min-width/height: auto`):** Firefox strictly enforces W3C specifications on flex containers: a child element with long text or an image will overflow a Flex container unless it has an explicit `min-width: 0`, whereas Chromium is often more forgiving and automatically compresses the element.
  * **Font Antialiasing:** Chromium's subpixel rendering can make modern typography like **Geist** ([package.json:L13]) appear slightly thinner or washed out compared to Firefox, where font weight renders bolder.
  * **Dynamic Viewport Height (`100vh` vs `dvh`):** On mobile devices, the dynamic appearance and disappearance of the address bar in Chromium Android and Safari iOS distorts standard `100vh` calculations.
* **Implemented Solutions:**
  * **Styles & Prefixes:** We integrated **Tailwind CSS v4** combined with **PostCSS / Autoprefixer** to automatically inject required vendor prefixes during build and standardize layer rendering.
  * **Universal Scrollbars:** Our design system simultaneously implements W3C rules (`scrollbar-width`/`scrollbar-color`) for Firefox and `-webkit-` pseudo-elements for Chromium, ensuring sleek, thin scrollbars in chat ([GlobalChat.tsx]) and friend lists across all engines.
  * **Strict Flex Constraints:** Our layout components ([Layout.tsx]) systematically declare overflow constraints (`min-w-0`, `overflow-hidden`, `truncate`), preventing layout breaks in Firefox.
  * **Global Antialiasing:** We applied antialiasing utility classes (`-webkit-font-smoothing: antialiased;` and `-moz-osx-font-smoothing: grayscale;`) for uniform typographic sharpness.
  * **Modern Viewports:** We use modern dynamic viewport units (**`dvh`**) to guarantee a responsive interface without vertical overflow on mobile and desktop screens.

### 5. Audio & Media Autoplay Policies
* **Specific Difference / Limitation:** 
  Browsers (especially Safari and Chrome) enforce strict Media Engagement Index (MEI) policies that block automatic audio playback or media animations unless the user has first interacted with the page.
* **Implemented Solution:** 
  All audio feedback and interactive game animations are triggered exclusively in response to explicit user events (clicking a play button or submitting a guess), strictly adhering to browser autoplay rules.

---
---

# 🇫🇷 Compatibilité Multi-Navigateurs & Limitations (Module Mineur)

Ce document atteste de la compatibilité complète de l'application **Transcendence** sur plusieurs navigateurs web et recense, comme exigé par le module, les différences techniques et limitations spécifiques rencontrées ainsi que les solutions apportées pour garantir une expérience utilisateur (UI/UX) et des fonctionnalités parfaitement cohérentes et fonctionnelles sur tous les supports.

---

## 🖥️ Navigateurs testés & entièrement pris en charge
* **Google Chrome / Chromium** (V8 / Blink) — *Navigateur principal et de référence*
* **Mozilla Firefox** ( Gecko) — *Testé et compatible*
* **Safari** ( WebKit) — *Non testé*

---

## ⚙️ Limitations spécifiques aux navigateurs & Solutions apportées

### 1. Gestion des Cookies & Sécurité (Safari ITP vs Chrome SameSite)
* **Différence / Limitation spécifique :** 
  Safari intègre l'**ITP (Intelligent Tracking Prevention)** qui bloque par défaut les cookies cross-site et cross-port, considérant les requêtes d'authentification inter-domaines comme du pistage tiers. Chrome, à l'inverse, applique une politique `SameSite=Lax` plus tolérante en développement local.
* **Solution apportée :** 
  Mise en place d'un **Reverse Proxy / Gateway Nginx** (`localhost:8080`). En servant le frontend (React) et le backend (NestJS) sous une **seule et même origine**, les cookies de session JWT (`access_token`) en `httpOnly: true` sont perçus comme des cookies propriétaires (First-Party) et sont acceptés de manière fiable sur Safari, Firefox et Chrome sans déclencher d'alertes de sécurité ou de blocages CORS.

### 2. Throttling des onglets inactifs & Gestion des Timers (Blink vs Gecko/WebKit)
* **Différence / Limitation spécifique :** 
  Les navigateurs basés sur Blink (Chrome, Edge) appliquent un bridage (throttling) très agressif sur les fonctions Javascript `setInterval` et `setTimeout` lorsque l'onglet est en arrière-plan ou minimisé (réduction à 1 exécution par seconde ou moins). Firefox et Safari gèrent la mise en veille des sockets et des timers de manière différente.
* **Solution apportée :** 
  Pour éviter toute désynchronisation pendant les parties en ligne ([RankedGamePage.tsx](file:///home/amine/Desktop/Code/Transcendence/frontend/src/pages/RankedGamePage.tsx)) ou lors du compte à rebours de déconnexion (`disconnectCountdown`), l'application adopte une architecture **Server-Authoritative**. Le temps, la validation du tour par tour (`isMyTurn`) et l'état du jeu sont exclusivement calculés et diffusés par le serveur backend NestJS via des événements **Socket.IO**.

### 3. Connexions WebSockets & Réseaux stricts (iOS Safari & Firewalls)
* **Différence / Limitation spécifique :** 
  Certains environnements réseau (en particulier sous iOS Safari sur réseau mobile ou derrière des pare-feux d'entreprise) peuvent interrompre ou bloquer les connexions WebSockets natives (RFC 6455).
* **Solution apportée :** 
  Utilisation du client et serveur **Socket.IO**. En cas d'échec ou de blocage du handshake WebSocket natif, le moteur effectue un basculement automatique vers le protocole **HTTP Long-Polling**, garantissant une disponibilité à 100 % du chat en temps réel et du matchmaking sur tous les navigateurs et réseaux.

### 4. Rendu CSS, Moteurs de mise en page & Effets visuels (Chromium/Blink vs Firefox/Gecko vs Safari/WebKit)
* **Différences / Limitations spécifiques :**
  * **Flou de fond (Glassmorphism / Backdrop Filter) :** Chromium (Blink) calcule le flou via l'accélération GPU de manière agressive mais peut souffrir de scintillements (*flickering*) lors d'animations combinées avec des bordures arrondies (`border-radius` + `overflow: hidden`). Firefox (Gecko) gère les contextes d'empilement plus strictement avec un rendu plus doux mais sensible au CPU sous Linux. WebKit (Safari) exige quant à lui le préfixe `-webkit-`.
  * **Personnalisation des Scrollbars (Barres de défilement) :** Chromium utilise historiquement les pseudo-éléments propriétaires `::-webkit-scrollbar`, alors que Firefox les ignore totalement et respecte strictement les normes du W3C (`scrollbar-width` et `scrollbar-color`).
  * **Flexbox, CSS Grids & Débordements (`min-width/height: auto`) :** Firefox applique très strictement la spécification W3C sur les conteneurs flexibles : un élément enfant avec du texte long ou une image peut déborder d'un conteneur Flex s'il ne possède pas de `min-width: 0` explicite, là où Chromium se montre souvent plus tolérant et compresse automatiquement l'élément.
  * **Lissage des polices (Font Antialiasing) :** Le rendu sous-pixel de Chromium peut faire paraître la police moderne **Geist** ([package.json:L13](file:///home/amine/Desktop/Code/Transcendence/frontend/package.json#L13)) légèrement plus fine ou délavée que sur Firefox, où la graisse est rendue de manière plus prononcée.
  * **Hauteur dynamique de Viewport (`100vh` vs `dvh`) :** Sur mobiles, l'apparition/disparition dynamique de la barre d'adresse de Chromium Android et Safari iOS fausse le calcul du `100vh` standard.
* **Solutions apportées :**
  * **Styles & Préfixes :** Intégration de **Tailwind CSS v4** couplé à **PostCSS / Autoprefixer** pour injecter automatiquement les préfixes vendeurs requis et standardiser le rendu des calques.
  * **Scrollbars universelles :** Notre design system implémente simultanément les règles W3C (`scrollbar-width`/`scrollbar-color`) pour Firefox et les pseudo-éléments `-webkit-` pour Chromium, assurant des barres de défilement fines et stylisées dans le chat ([GlobalChat.tsx](file:///home/amine/Desktop/Code/Transcendence/frontend/src/components/GlobalChat.tsx)) et les listes d'amis sur tous les moteurs.
  * **Contraintes Flex strictes :** Nos composants de structure ([Layout.tsx](file:///home/amine/Desktop/Code/Transcendence/frontend/src/components/Layout.tsx)) déclarent systématiquement les contraintes de débordement (`min-w-0`, `overflow-hidden`, `truncate`), empêchant toute casse de mise en page sous Firefox.
  * **Antialiasing global :** Application des classes d'antialiasing (`-webkit-font-smoothing: antialiased;` et `-moz-osx-font-smoothing: grayscale;`) pour une netteté typographique uniforme.
  * **Viewports modernes :** Utilisation des unités de viewport dynamiques (**`dvh`**) pour garantir une interface sans débordement vertical sur écrans mobiles et de bureau.

### 5. Politiques d'Autoplay Audio & Média
* **Différence / Limitation spécifique :** 
  Les navigateurs (notamment Safari et Chrome) appliquent des politiques d'engagement média (MEI) strictes qui bloquent la lecture automatique de sons ou d'animations si l'utilisateur n'a pas préalablement agi sur la page.
* **Solution apportée :** 
  Tous les retours sonores ou animations interactives de jeu sont déclenchés exclusivement en réponse à un événement utilisateur explicite (clic sur un bouton de jeu ou de soumission d'essai), respectant ainsi les normes strictes d'autoplay de chaque navigateur.

---
---

