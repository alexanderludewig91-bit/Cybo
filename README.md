🛡️ **Cybo Security Companion – Chrome Browser Extension**

Cybo ist eine **reine Chrome-Extension (Manifest V3)**, die dich beim Surfen in Echtzeit schützt: Tracking erkennen, Werbung blockieren, Privacy verbessern und Passwörter prüfen – alles **lokal im Browser**, ohne separaten Server.

---

## 🌟 Features im Überblick

### 📡 Live Security Monitor (Dashboard)
Das `dashboard.html` zeigt dir für die aktuell besuchte Website:
- **🍪 Cookies**: Anzahl und Basis-Eigenschaften (Secure, HttpOnly, SameSite)
- **📊 Tracker-Erkennung**: Zuordnung zu Kategorien (Analytics, Advertising, Social, Fingerprinting, Cryptomining, …)
- **🌐 Third-Parties**: Externe Domains, mit denen die Seite spricht
- **📡 Network-Requests**: Übersicht der geladenen Ressourcen
- **🔒 HTTPS-Status & Auto-HTTPS**: Erkennung von HTTP/HTTPS, automatisches Upgrade auf HTTPS (falls möglich)
- **🚫 Ad-Blocker-Statistiken**: Geblockte Ads pro Seite und in der Session
- **🥷 Privacy-Modus**: Normal / Balanced / Stealth inkl. Header-Anpassungen und Tracking-Parameter-Cleanup

Das Dashboard liest seine Daten direkt aus `chrome.storage.local`, die vom `background.js` kontinuierlich aktualisiert werden – **kein externer Server, kein WebSocket**.

### 🚫 Intelligenter Ad-Blocker
Kombination aus **declarativeNetRequest-Regeln** (`rules.json`) und Logik in `background.js`:
- Blockiert Anfragen an bekannte Ad- und Tracking-Domains
- Erfasst zusätzlich Ads heuristisch (URL-Muster wie `/ads/`, `adserver`, Banner-Pfade)
- Zählt geblockte Ads pro Seite und global
- Zeigt Live-Zähler als **Badge** am Extension-Icon
- **Whitelist-Unterstützung** über das Settings-UI (Domains von Blocking ausnehmen)

### 🥷 Privacy Protection
Mehrstufiger Schutz direkt im Background-Service-Worker:
- Entfernt gängige **Tracking-Parameter** (z. B. `utm_*`, `fbclid`, `gclid`, …) aus URLs
- Setzt `Accept-Language`, `Referer` und andere Header je nach Modus restriktiver
- Entfernt bei Bedarf `ETag`-Header, um Cache-basiertes Tracking zu erschweren
- Ignoriert Browser-interne Seiten und `localhost`, damit Entwicklung nicht gestört wird

### 🔐 Passwort-Check
Die Seite `password-check.html` bietet:
- **Stärke-Score (0–100)** mit Visualisierung
- Einschätzung wie *„sehr schwach“*, *„mittel“*, *„sehr stark“* etc.
- Geschätzte **„Knackzeit“** basierend auf Länge und Zeichentypen
- Checkliste für:
  - Groß-/Kleinbuchstaben
  - Zahlen
  - Sonderzeichen
  - Mindestlänge
- **Generator für sichere Passwörter** und Kopierfunktion  
Alle Berechnungen laufen **lokal im Browser**, Passwörter werden **nicht gespeichert**.

### ⚙️ Einstellungen
`settings.html` bündelt alle wichtigen Schalter:
- **Benachrichtigungen** ein/aus (Warnung bei vielen Trackern/Ads)
- **Auto-HTTPS Upgrade** aktivieren/deaktivieren
- **Ad-Blocker global** aktivieren/deaktivieren
- **Whitelist-Verwaltung** (Domains hinzufügen/entfernen)
- Anzeige der **gesamt geblockten Ads**
- Eingabe eines **OpenAI API Keys** (für KI-Analysen, lokal im Storage abgelegt)

### 🔔 Benachrichtigungen
Über `chrome.notifications`:
- Hinweis bei **hoher Tracker-Aktivität** auf einer Seite
- Hinweis bei besonders vielen geblockten Ads
- Test-Notification aus den Einstellungen heraus (zum Überprüfen der Browser-Settings)

---

## 🚀 Installation (Chrome – Entwicklermodus)

### 1. Repository klonen / herunterladen
Du brauchst **kein Node.js und keinen Build-Step**, um die Extension zu benutzen.

```bash
git clone <dein-repo-url>
cd cybo
```

### 2. Icons bereitstellen
Im Ordner `extension/icons/` werden folgende Dateien erwartet:
- `icon16.png`  (16×16 px)
- `icon48.png`  (48×48 px)
- `icon128.png` (128×128 px)

Details siehe `extension/icons/README.md`. Für einen schnellen Start kannst du einfach drei beliebige PNGs in der passenden Größe verwenden und entsprechend benennen.

### 3. Extension in Chrome laden
1. Öffne `chrome://extensions/`
2. Aktiviere oben rechts **„Entwicklermodus“**
3. Klicke auf **„Entpackte Erweiterung laden“**
4. Wähle den Ordner `extension/` aus diesem Projekt
5. Die Extension **„Cybo Security Companion“** sollte nun erscheinen

### 4. Erste Schritte
- Besuche eine beliebige Website (z. B. `https://github.com`)
- Klicke auf das **Cybo-Icon** in der Toolbar, um das **Popup** zu sehen
- Öffne das **Dashboard**:
  - entweder über den Button „Dashboard öffnen“ im Popup
  - oder per Shortcut (**Strg+Umschalt+D** / **Cmd+Umschalt+D**) – siehe `manifest.json`

---

## 🔍 Wichtige Dateien & Struktur (Extension-Teil)

```text
extension/
├── manifest.json           # Manifest V3 Konfiguration
├── background.js           # Service Worker: Tracking, Ads, Privacy, Badge, Storage
├── content.js              # Content Script: Kommunikation / Hooks auf Seitenebene
├── privacy-injector.js     # Zusätzliche Privacy-Logik im Kontext der Seite
├── injected.js             # Code, der direkt in Seiten injiziert werden kann
├── tracker-database.js     # Erweiterte Liste bekannter Tracker
├── rules.json              # declarativeNetRequest-Regeln für Ad-Blocking
├── privacy-rules.json      # Zusätzliche declarativeNetRequest-Regeln für Privacy
├── popup.html / popup.js   # Kompaktes Popup mit Kennzahlen zur aktuellen Seite
├── dashboard.html          # Vollbild-Dashboard („Live Security Monitor“)
├── dashboard.js            # Dashboard-Logik & Rendering
├── dashboard-features.js   # Hilfsfunktionen für das Dashboard
├── password-check.html/js  # Passwort-Analyse-UI und Logik
├── settings.html/js        # Einstellungen (Ad-Blocker, Whitelist, Notifications, API Key)
└── icons/                  # Icons für Extension & Notifications
```

> Hinweis: Im Repo existieren zusätzlich noch Ordner wie `app/`, `lib/`, `prisma/` usw.  
> Diese stammen von einer früheren Next.js-Variante und sind für die **aktuelle reine Extension-Version nicht mehr erforderlich**.

---

## 🔒 Datenschutz

- **Lokal zuerst**: Analyse-Daten (Tracker, Requests, Cookies, Einstellungen) werden über `chrome.storage.local` gespeichert
- **Keine eigene Server-Komponente**: Es gibt keinen zentralen Backend-Server von Cybo
- **Passwörter**:
  - werden nur im RAM verarbeitet
  - werden nicht persistiert
  - der Password-Check läuft vollständig lokal
- **OpenAI API Key** (optional):
  - wird im lokalen Browser-Storage abgelegt
  - wird nur genutzt, wenn du explizit KI-Funktionen aktivierst/aufrufst

Cybo ist ein **unterstützendes Tool** und ersetzt keine professionellen Sicherheitslösungen wie Antivirensoftware oder Firewalls.

---

## 🛠️ Entwicklung & Anpassung

Da die Extension ohne Build-Step läuft, kannst du direkt im `extension/`-Ordner arbeiten:

- **Ad-Blocking-Regeln anpassen**  
  - `rules.json` für declarativeNetRequest-Regeln
  - zusätzliche Heuristiken in `background.js` (`AD_DOMAINS`, `isAd`, `getAdType`)

- **Tracker-Erkennung erweitern**  
  - `TRACKER_DOMAINS` und Kategorien in `background.js`
  - erweiterte Datenbank in `tracker-database.js`

- **UI anpassen**  
  - `dashboard.html` / `dashboard.css` / `dashboard.js`
  - `popup.html` / `popup.js`
  - `password-check.html` / `password-check.js`
  - `settings.html` / `settings.js`

**Reload nach Änderungen:**  
- `chrome://extensions/` öffnen  
- Bei Cybo auf den **🔄-Button (Neu laden)** klicken  
- Optional Devtools für Background/Popup/Dashboard öffnen für Logs

---

## 📝 Roadmap (aktuelle Vision)

- [x] Manifest V3 Chrome-Extension
- [x] Live-Monitor mit Tracker-/Ad-/Cookie-Übersicht
- [x] declarativeNetRequest-basierter Ad-Blocker
- [x] Privacy-Header-Anpassungen & Tracking-Parameter-Entfernung
- [x] Passwort-Check mit Score, Knackzeit & Generator
- [x] Whitelist für Domains
- [x] Notifications bei hoher Tracker-/Ad-Aktivität
- [ ] Erweiterte KI-Website-Bewertung direkt aus dem Dashboard
- [ ] Erweiterte Report-Funktionen (Export/Sharing)
- [ ] Besseres Theming (Dark/Light, mehr Personalisierung)

---

## 🤝 Beitragen & Feedback

Das Projekt ist aktuell ein persönliches/lernorientiertes Projekt, aber:
- **Feedback, Bugreports und Ideen** sind jederzeit willkommen
- PRs sind möglich, sollten sich aber klar auf den Extension-Teil (`extension/`) beziehen

---

## 📄 Lizenz & Haftung

- Erstellung für **persönlichen und experimentellen Gebrauch**
- Keine Garantie auf Vollständigkeit oder Fehlerfreiheit
- Nutzung auf eigenes Risiko; prüfe rechtliche Vorgaben in deinem Land (insb. bzgl. Blocking/Tracking)

---

🙏 Entwickelt mit ❤️ für mehr Transparenz und Sicherheit beim Surfen.

**Hinweis:** Cybo ergänzt bestehende Sicherheitsmechanismen (Browser-Sandbox, Antivirensoftware, Firewalls) und soll diese **nicht** ersetzen.

