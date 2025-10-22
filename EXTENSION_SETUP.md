# 🛡️ Cybo Browser Extension - Installation & Setup

## 📋 Voraussetzungen

- Chrome oder Edge Browser
- Node.js installiert
- Cybo Next.js App läuft

## 🚀 Schritt-für-Schritt Installation

### 1. Extension Icons erstellen

Die Extension benötigt Icons in den Größen 16x16, 48x48 und 128x128 Pixel.

**Schnellste Methode:**
```bash
# Im extension/icons/ Ordner
# Erstelle 3 PNG-Dateien: icon16.png, icon48.png, icon128.png
# Du kannst temporär beliebige PNG-Bilder verwenden
```

**Professionelle Methode:**
- Nutze https://favicon.io/favicon-generator/
- Generiere Icons mit dem 🛡️ Symbol oder "C" für Cybo
- Lade herunter und benenne um

### 2. Abhängigkeiten installieren

```bash
# Im Hauptverzeichnis (Cybo/)
npm install
```

### 3. WebSocket-Server starten

Der WebSocket-Server ermöglicht die Kommunikation zwischen Extension und App.

```bash
# Terminal 1: Next.js Dev Server + WebSocket Server zusammen
npm run dev:all

# Oder separat:
# Terminal 1: Next.js
npm run dev

# Terminal 2: WebSocket Server
npm run ws
```

Du solltest sehen:
```
✓ Ready on http://localhost:3000
🚀 WebSocket Server läuft auf Port 3001
```

### 4. Browser Extension installieren

#### Chrome:
1. Öffne Chrome
2. Gehe zu `chrome://extensions/`
3. Aktiviere **"Entwicklermodus"** (oben rechts)
4. Klicke auf **"Entpackte Erweiterung laden"**
5. Wähle den `extension/` Ordner aus deinem Cybo-Projekt
6. Die Extension sollte jetzt erscheinen! 🎉

#### Edge:
1. Öffne Edge
2. Gehe zu `edge://extensions/`
3. Aktiviere **"Entwicklermodus"** (links unten)
4. Klicke auf **"Entpackt laden"**
5. Wähle den `extension/` Ordner aus
6. Fertig! 🎉

### 5. Extension testen

1. Klicke auf das Cybo Extension-Icon in deiner Browser-Toolbar
2. Du solltest ein Popup sehen mit aktuellen Stats
3. Öffne die Cybo App: http://localhost:3000/live
4. Besuche eine beliebige Website (z.B. github.com)
5. 🎊 **Das Live-Dashboard sollte jetzt Daten anzeigen!**

## 📊 Was die Extension überwacht

### ✅ Automatisch erkannt:
- **🍪 Cookies** - Alle gesetzten Cookies
- **📊 Tracker** - Bekannte Tracking-Domains (Google Analytics, Facebook, etc.)
- **🌐 Third-Party Connections** - Externe Domains, die kontaktiert werden
- **📡 Network Requests** - Alle HTTP/HTTPS-Requests
- **🔒 HTTPS-Status** - Verschlüsselung der Verbindung

### ⚠️ Permission-Tracking:
- **📍 Geolocation** - Standort-Abfragen
- **🎥 Camera/Microphone** - Medien-Zugriff
- **🔔 Notifications** - Benachrichtigungs-Anfragen
- **📦 LocalStorage** - Datenspeicherung (optional)

## 🎯 Verwendung

### Live-Dashboard
- Öffne http://localhost:3000/live
- Extension muss installiert sein
- Besuche beliebige Websites
- Sieh in Echtzeit, was passiert!

### Extension Popup
- Klicke auf Extension-Icon
- Sieh schnelle Stats der aktuellen Website
- Klicke "Dashboard öffnen" für Details

## 🔧 Troubleshooting

### Extension verbindet nicht?
```bash
# Prüfe ob WebSocket-Server läuft:
npm run ws

# Sollte zeigen:
# 🚀 WebSocket Server läuft auf Port 3001
```

### Keine Daten im Dashboard?
1. Extension installiert? (chrome://extensions/)
2. WebSocket-Server läuft? (Port 3001)
3. Firewall blockiert Port 3001?
4. Browser-Console öffnen (F12) → Fehler prüfen

### Extension lädt nicht?
1. Icons vorhanden? (extension/icons/)
2. Entwicklermodus aktiviert?
3. Richtigen Ordner gewählt? (extension/)

## 🎨 Extension anpassen

### Tracker-Liste erweitern
Bearbeite `extension/background.js`:
```javascript
const KNOWN_TRACKERS = [
  'google-analytics.com',
  'deine-tracker-domain.com', // Füge hier hinzu
  // ...
];
```

### Popup-Design ändern
Bearbeite `extension/popup.html` und `popup.js`

## 📝 Development-Tipps

### Extension neu laden nach Änderungen:
1. Gehe zu `chrome://extensions/`
2. Klicke auf 🔄 bei deiner Extension
3. Oder: Extension entfernen → neu laden

### Debugging:
- **Background Script:** chrome://extensions/ → "Details" → "Hintergrundseite"
- **Content Script:** F12 in Website → Console
- **Popup:** Rechtsklick auf Extension-Icon → "Popup prüfen"

### Logs anzeigen:
```javascript
// In Browser-Console (F12):
// Background-Script-Logs sehen
// Content-Script-Logs sehen

// In Extension Background:
console.log('🛡️ Cybo...')
```

## 🚀 Produktiv nutzen

Wenn du die Extension dauerhaft nutzen willst:

### Option 1: Im Entwicklermodus behalten
- Extension bleibt geladen
- Bei jedem Chrome-Start aktiv
- Warnung "Deaktivieren Sie Erweiterungen im Entwicklermodus"

### Option 2: Als .crx packen (Chrome Web Store)
- Für private Nutzung nicht nötig
- Für öffentliche Veröffentlichung: Chrome Web Store Developer Account nötig

## 💡 Nächste Schritte

- ✅ Extension läuft
- ✅ Live-Dashboard zeigt Daten
- 🔜 Erkunde verschiedene Websites
- 🔜 Sieh welche Tracker blockiert werden
- 🔜 Lerne über deine digitale Privatsphäre!

---

## 🆘 Hilfe gebraucht?

Wenn etwas nicht funktioniert:
1. Prüfe die Browser-Console (F12)
2. Prüfe die Extension-Background-Logs
3. Prüfe ob WebSocket-Server läuft
4. Stelle sicher, dass Next.js auf Port 3000 läuft

**Viel Erfolg! 🛡️**

