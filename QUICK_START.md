# 🚀 Cybo - Quick Start Guide

So bringst du Cybo in **unter 5 Minuten** zum Laufen!

## 1️⃣ Installation (1 Min)

```bash
# Abhängigkeiten installieren
npm install

# Datenbank erstellen
npx prisma generate
npx prisma db push
```

## 2️⃣ Server starten (30 Sek)

```bash
# Startet Next.js + WebSocket Server zusammen
npm run dev:all
```

✅ Warte bis du siehst:
```
✓ Ready on http://localhost:3000
🚀 WebSocket Server läuft auf Port 3001
```

## 3️⃣ Extension Icons (1 Min)

**Schnelle Lösung:**
Lade 3 beliebige PNG-Bilder herunter und speichere sie als:
- `extension/icons/icon16.png`
- `extension/icons/icon48.png`
- `extension/icons/icon128.png`

**Oder:** Nutze https://favicon.io/favicon-generator/

## 4️⃣ Extension installieren (1 Min)

1. Öffne Chrome/Edge
2. Gehe zu `chrome://extensions/`
3. Aktiviere **"Entwicklermodus"** (Toggle oben rechts)
4. Klicke **"Entpackte Erweiterung laden"**
5. Wähle den `extension/` Ordner aus deinem Cybo-Projekt
6. ✅ Fertig!

## 5️⃣ Live-Monitor öffnen (30 Sek)

1. Öffne http://localhost:3000/live
2. Besuche eine Website (z.B. github.com)
3. 🎉 **Sieh Live-Daten im Dashboard!**

---

## 🎯 Das war's!

Du solltest jetzt sehen:
- Anzahl der Cookies
- Erkannte Tracker
- Third-Party-Verbindungen
- Network-Requests
- Security-Score

## 🔥 Pro-Tipp

Klicke auf das Extension-Icon in deiner Browser-Toolbar für Quick-Stats!

## ❓ Probleme?

**Extension verbindet nicht?**
- Prüfe: WebSocket-Server läuft? (`npm run ws`)
- Prüfe: Extension installiert? (`chrome://extensions/`)

**Keine Daten?**
- Besuche eine Website
- Warte 2-3 Sekunden
- Aktualisiere das Live-Dashboard (F5)

---

**Mehr Details?** → Siehe [EXTENSION_SETUP.md](EXTENSION_SETUP.md)

