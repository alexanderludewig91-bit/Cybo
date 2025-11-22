# 🛡️ Cybo Browser Extension – Installation & Setup (Standalone)

Cybo läuft als **vollständig eigenständige Chrome-Extension** – es sind **kein Node.js, kein Server und keine Datenbank** mehr nötig.

---

## 📋 Voraussetzungen

- Chrome oder Edge Browser
- Zugriff auf dieses Repository (bzw. den `extension/` Ordner)

Optional (für KI-Funktionen):
- Eigener **OpenAI API Key**

---

## 🚀 Schritt-für-Schritt Installation

### 1. Extension Icons erstellen

Die Extension benötigt drei Icons im Ordner `extension/icons/`:
- `icon16.png`  (16×16 px)
- `icon48.png`  (48×48 px)
- `icon128.png` (128×128 px)

**Schnellste Methode:**
- Nimm drei beliebige PNG-Bilder in den passenden Größen
- Benenne sie in `icon16.png`, `icon48.png`, `icon128.png` um
- Lege sie in `extension/icons/` ab

**Schönere Methode:**
- Nutze `https://favicon.io/favicon-generator/`
- Erstelle ein Icon mit 🛡️ oder „C“
- Exportiere die PNGs in mehreren Größen und kopiere sie in `extension/icons/`

---

### 2. Browser Extension installieren

#### Chrome:
1. Öffne `chrome://extensions/`
2. Aktiviere oben rechts **„Entwicklermodus“**
3. Klicke **„Entpackte Erweiterung laden“**
4. Wähle den Ordner `extension/` aus diesem Projekt
5. Die Extension **„Cybo Security Companion“** sollte erscheinen 🎉

#### Edge:
1. Öffne `edge://extensions/`
2. Aktiviere **„Entwicklermodus“**
3. Klicke **„Entpackt laden“**
4. Wähle den Ordner `extension/`
5. Fertig 🎉

---

### 3. Cybo verwenden

1. Besuche eine Website (z. B. `https://github.com`)
2. Klicke auf das **Cybo-Icon** in der Toolbar
3. Im **Popup** siehst du:
   - Cookies
   - Tracker
   - Third-Parties
   - Requests
   - Geblockte Ads
4. Klicke im Popup auf **„Dashboard öffnen“**, um das große Live-Dashboard (`dashboard.html`) zu starten  
   Alternativ kannst du den Shortcut aus `manifest.json` nutzen (standardmäßig `Strg+Umschalt+D` bzw. `Cmd+Umschalt+D`).

---

## 📊 Was die Extension überwacht

### ✅ Automatisch erkannt:
- **🍪 Cookies** – gesetzte Cookies inkl. Basis-Infos (Domain, Secure, HttpOnly, SameSite)
- **📊 Tracker** – bekannte Tracking-Domains mit Kategorien (Analytics, Advertising, Social, Fingerprinting, Cryptomining, …)
- **🌐 Third-Party-Verbindungen** – externe Hosts, mit denen die Seite kommuniziert
- **📡 Network Requests** – HTTP/HTTPS-Requests (Typ, Domain)
- **🔒 HTTPS-Status & Auto-HTTPS** – Erkennung von HTTP/HTTPS, automatisches Upgrade, wo möglich

### ⚠️ Permission-/Privacy-Tracking:
- **📍 Geolocation**, **🎥 Kamera/Mikrofon**, **🔔 Notifications** (über Permissions / Events)
- Entfernen gängiger Tracking-Parameter (`utm_*`, `fbclid`, `gclid`, …)
- Anpassen/Entfernen von `Referer`-/`ETag`-Headern je nach Privacy-Modus

---

## 🎯 Verwendung im Detail

### Live-Dashboard (`dashboard.html`)
- Wird über das Popup oder den Shortcut geöffnet
- Zeigt:
  - aktuelle Website-URL und Titel
  - Security-Score
  - Tracker nach Kategorie
  - Cookies, Third-Parties, Requests
  - Ad-Blocker-Status und Statistiken
  - Privacy-Status (Normal/Balanced/Stealth)

### Extension Popup (`popup.html`)
- Kompakte Übersicht zur aktuellen Seite:
  - Cookies
  - Tracker
  - Third-Parties
  - Requests
  - Ads geblockt
- Button **„Dashboard öffnen“**

---

## 🔧 Troubleshooting

### Extension erscheint nicht in Chrome?
- Entwicklermodus aktiviert?
- Wurde der **Ordner `extension/`** gewählt (nicht das Projekt-Root)?
- Sind die Icons in `extension/icons/` vorhanden?

### Dashboard zeigt keine Daten?
- Prüfe, ob du eine „echte“ Website geöffnet hast (keine `chrome://`-, `about:`- oder `localhost`-Seite)
- Warte ein paar Sekunden und aktualisiere das Dashboard-Fenster
- Schau in die Devtools (F12) des Dashboards und des Background-Scripts:
  - `chrome://extensions/` → „Details“ → „Hintergrundseite prüfen“

### Ads/Tracker werden nicht (oder zu aggressiv) geblockt?
- Öffne `settings.html` über das Dashboard (Toolbar → Einstellungen)
  - Prüfe, ob der **Ad-Blocker aktiviert** ist
  - Prüfe, ob die Domain evtl. auf der **Whitelist** steht
- Nach Änderungen Website neu laden

---

## 🎨 Extension anpassen

### Tracker-/Ad-Erkennung erweitern
- `extension/background.js`:
  - `TRACKER_DOMAINS` / `TRACKER_CATEGORIES`
  - `AD_DOMAINS`, `isAd`, `getAdType`
- `extension/tracker-database.js`:
  - erweiterte Tracker-Liste

### UI anpassen
- Popup: `extension/popup.html`, `popup.js`
- Dashboard: `extension/dashboard.html`, `dashboard.css`, `dashboard.js`, `dashboard-features.js`
- Passwort-Check: `extension/password-check.html`, `password-check.js`
- Einstellungen: `extension/settings.html`, `settings.js`

Nach jeder Änderung:
1. `chrome://extensions/` öffnen
2. Bei Cybo auf **„Neu laden“ (🔄)** klicken

---

## 🚀 Produktiv nutzen

Für den privaten Gebrauch reicht der **Entwicklermodus** vollkommen aus:
- Extension bleibt zwischen Browser-Neustarts erhalten
- Wird automatisch beim Chrome-Start geladen

Für eine Veröffentlichung im Chrome Web Store müsstest du:
- Ein Entwicklerkonto bei Google anlegen
- Die Extension nach den Store-Richtlinien paketieren und einreichen  
(das ist aktuell **nicht** Teil dieser Doku und für lokale Nutzung nicht nötig).

---

## 🆘 Hilfe gebraucht?

Wenn etwas nicht funktioniert:
1. Prüfe **Browser-Console** (F12) im Dashboard
2. Prüfe **Background-Logs** (`chrome://extensions/` → „Details“ → „Hintergrundseite“)
3. Stelle sicher, dass du eine „normale“ Website geöffnet hast (kein interner Chrome-Tab)
4. Extension einmal **neu laden** und Seite neu öffnen

**Viel Erfolg & sicheres Surfen! 🛡️**

