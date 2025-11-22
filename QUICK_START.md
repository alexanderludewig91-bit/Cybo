# 🚀 Cybo – Quick Start (Standalone Extension)

So hast du Cybo in **unter 2 Minuten** als reine Chrome-Extension am Start – ganz ohne Server, Datenbank oder Node.js.

## 1️⃣ Projekt holen

```bash
git clone <dein-repo-url>
cd cybo
```

## 2️⃣ Icons vorbereiten (1 Min)

- Lege im Ordner `extension/icons/` drei Dateien an:
  - `icon16.png`
  - `icon48.png`
  - `icon128.png`
- Für einen schnellen Start kannst du einfach drei beliebige PNGs in der passenden Größe verwenden und entsprechend benennen.  
  Details: siehe `extension/icons/README.md`.

## 3️⃣ Extension installieren (1 Min)

1. Öffne Chrome (oder Edge)
2. Gehe zu `chrome://extensions/`
3. Aktiviere oben rechts **„Entwicklermodus“**
4. Klicke **„Entpackte Erweiterung laden“**
5. Wähle den Ordner `extension/`
6. ✅ Fertig – die Extension „Cybo Security Companion“ sollte jetzt sichtbar sein

## 4️⃣ Cybo nutzen

- Besuche eine Website (z. B. `https://github.com`)
- Klicke auf das **Cybo-Icon** in der Toolbar, um das **Popup** mit den wichtigsten Kennzahlen zu sehen
- Öffne das **Dashboard**:
  - Im Popup auf **„Dashboard öffnen“** klicken  
  - oder den Tastatur-Shortcut nutzen (standardmäßig `Strg+Umschalt+D` / `Cmd+Umschalt+D`)

Du solltest jetzt sehen:
- Anzahl der Cookies
- Erkannte Tracker (inkl. Kategorien)
- Third-Party-Domains
- Network-Requests
- Geblockte Werbung & Security-Einschätzung

---

## 🔥 Pro-Tipps

- Im Dashboard kannst du:
  - den **Ad-Blocker** ein-/ausschalten
  - den **Privacy-Modus** wählen (Normal / Balanced / Stealth)
  - den **Passwort-Check** und die **Einstellungen** öffnen
- Nach Änderungen am Code im Ordner `extension/`:
  - `chrome://extensions/` öffnen
  - bei Cybo auf **„Neu laden“ (🔄)** klicken

---

**Mehr Details & Troubleshooting:** → siehe `EXTENSION_SETUP.md` und `STANDALONE_SETUP.md`.

