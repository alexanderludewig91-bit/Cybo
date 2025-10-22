# 🛡️ Cybo Standalone Extension - Setup

## 🎉 Gute Neuigkeiten!

Cybo läuft jetzt **komplett standalone** als Browser Extension - **kein Server mehr nötig**!

## ✨ Was ist neu?

### ❌ NICHT mehr nötig:
- ~~npm run dev:all~~ - Kein Server!
- ~~Next.js App~~ - Nicht mehr verwendet
- ~~WebSocket-Server~~ - Nicht mehr nötig
- ~~Prisma/SQLite~~ - Ersetzt durch Chrome Storage

### ✅ Jetzt:
- **Nur Extension installieren** - Fertig!
- **Läuft automatisch** - Solange Chrome läuft
- **Keine Dependencies** - Alles in der Extension
- **Wie eine normale Extension** - z.B. uBlock Origin

---

## 🚀 Installation (Super einfach!)

### 1. Extension Icons erstellen

Erstelle 3 Icon-Dateien (siehe `extension/icons/README.md`):
- `icon16.png`
- `icon48.png`  
- `icon128.png`

**Schnellste Lösung:** Lade 3 beliebige PNG-Bilder herunter und benenne um.

### 2. Extension installieren

1. Öffne Chrome/Edge
2. Gehe zu `chrome://extensions/`
3. Aktiviere **"Entwicklermodus"**
4. Klicke **"Entpackte Erweiterung laden"**
5. Wähle den `extension/` Ordner
6. **Fertig!** 🎉

### 3. Cybo nutzen

**Dashboard öffnen:**
- Klicke auf Cybo Extension-Icon
- Klicke "Dashboard öffnen"
- **ODER:** Rechtsklick auf Icon → "Dashboard"

**Das war's!** Keine Server, keine Terminals, keine Befehle! ✅

---

## 📊 Features

### 🌐 Live Monitor
- Echtzeit-Überwachung aller Websites
- Security-Score Berechnung
- Tracker-Erkennung
- Cookie-Monitoring
- Third-Party-Verbindungen
- Ad-Blocking Statistiken

### 🚫 Ad-Blocker
- 60+ Werbenetzwerke
- Automatisches Blocking
- Ein/Aus-Schalter
- Whitelist-Funktion
- Live-Statistiken

### 🔐 Password-Check
- Passwortstärke-Analyse
- Sicherer Generator
- Echtzeit-Feedback
- Knackzeit-Schätzung

### 🤖 KI-Website-Bewertung
- On-Demand-Analyse
- Intelligentes Caching
- Optional (benötigt OpenAI API Key)
- Fallback-Analyse ohne KI

### ⚙️ Einstellungen
- Ad-Blocker An/Aus
- OpenAI API Key
- Whitelist-Verwaltung
- Statistiken zurücksetzen

---

## 🎯 Verwendung

### Dashboard öffnen:
- **Methode 1:** Extension-Icon klicken → "Dashboard öffnen"
- **Methode 2:** Rechtsklick auf Extension-Icon
- **Ergebnis:** Öffnet `chrome-extension://[id]/dashboard.html`

### Password-Check öffnen:
- Dashboard → Toolbar unten → "Password-Check"
- **ODER:** Popup → (wird noch hinzugefügt)

### Einstellungen öffnen:
- Dashboard → Toolbar unten → "Einstellungen"
- Hier kannst du:
  - Ad-Blocker ein/ausschalten
  - OpenAI API Key hinterlegen
  - Whitelist verwalten

---

## 💾 Datenspeicherung

**Chrome Storage API:**
- Alle Daten lokal im Browser
- Sync über Chrome-Account möglich
- Automatische Backups
- Kein Server = Maximum Privacy!

**Was wird gespeichert:**
- Ad-Blocker Settings (An/Aus, Whitelist)
- Geblockte Ads (Statistiken)
- KI-Analysen (Cache)
- OpenAI API Key (verschlüsselt)

---

## 🔧 Unterschied zu vorher

**Vorher (mit Server):**
```
1. Terminal öffnen
2. npm run dev:all starten
3. Warten bis Server läuft
4. Extension installieren
5. Dashboard auf localhost:3000 öffnen
6. Bei PC-Neustart: Alles wiederholen
```

**Jetzt (Standalone):**
```
1. Extension installieren
2. Fertig!
→ Läuft automatisch bei Chrome-Start
→ Dashboard immer verfügbar
→ Kein Server, keine Terminals
```

---

## 🎨 Vorteile

### ⚡ Performance
- **Schneller Start** - keine Server-Wartezeit
- **Weniger RAM** - kein Node.js-Server
- **Sofort bereit** - Extension ist immer aktiv

### 😊 Benutzerfreundlichkeit
- **Keine Kommandozeile** - alles per Klick
- **Immer verfügbar** - läuft automatisch
- **Wie eine normale Extension**

### 🔒 Privacy
- **Komplett lokal** - alles im Browser
- **Kein Server** - keine Netzwerk-Abhängigkeit
- **Maximale Kontrolle** - du hast alle Daten

---

## 🆘 Troubleshooting

**Extension lädt nicht?**
- Icons vorhanden? (extension/icons/)
- Entwicklermodus aktiviert?
- Richtigen Ordner gewählt?

**Dashboard zeigt keine Daten?**
- Besuche eine Website
- Warte 2-3 Sekunden
- Extension neu laden (🔄)

**Ad-Blocker funktioniert nicht?**
- Prüfe in Einstellungen ob aktiviert
- Reload die Website nach Aktivierung
- Prüfe Console auf Fehler (F12)

---

## 🎊 Das war's!

Cybo ist jetzt eine **echte Standalone-Extension**!

Einfach installieren, Icon klicken, Dashboard öffnen - und du bist geschützt! 🛡️

**Keine Server mehr, keine Terminals, keine Befehle!**

Genieße deinen neuen Security-Begleiter! 🚀

