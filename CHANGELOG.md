# Cybo - Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

## [1.3.0] - 2025-10-22

### 🚀 Major Features - Polish & Power

#### 1. Third-Party-Cookie-Blocker 🍪
- ✅ **Intelligentes Cookie-Blocking:** Nur Third-Party-Cookies werden blockiert
- ✅ **First-Party erlaubt:** Login und Website-Funktionen bleiben intakt
- ✅ **Cross-Site-Tracking verhindert:** Websites können dich nicht über mehrere Domains tracken
- ✅ **Balanced & Stealth:** Automatisch in beiden Modi aktiviert
- ✅ **Custom-Mode:** Individuell konfigurierbar
- ✅ **Neues Feature im Dashboard:** Als 19. Feature mit Accordion-Erklärung

**Technisch:**
- Content Script: `cookie-blocker.js`
- Läuft in `MAIN` world für direkten Cookie-Zugriff
- Domain-basierte Third-Party-Erkennung

#### 2. Known-Tracker-Database 📊
- ✅ **100+ bekannte Tracker-Domains** kategorisiert
- ✅ **5 Kategorien:**
  - 📈 Analytics (Google Analytics, Hotjar, Mixpanel, etc.)
  - 📢 Advertising (DoubleClick, Criteo, Outbrain, etc.)
  - 👥 Social Media (Facebook Pixel, Twitter, LinkedIn, etc.)
  - 🔍 Fingerprinting (FingerprintJS, etc.)
  - ⛏️ Cryptomining (Coinhive, etc.)
- ✅ **Live-Statistik im Dashboard:** Neues Chart mit Kategorien
- ✅ **Automatische Kategorisierung:** Jeder Tracker wird seiner Kategorie zugeordnet

**Features:**
- Datei: `tracker-database.js`
- Integration in `background.js`
- Dashboard zeigt Tracker nach Kategorie
- Visuelle Highlights bei hohen Zahlen

#### 3. Password-Leak-Check (haveibeenpwned) 🔐
- ✅ **haveibeenpwned-Integration:** Prüfe gegen 600+ Millionen kompromittierte Passwörter
- ✅ **k-Anonymity:** Sicher - nur 5 Zeichen des Hash werden gesendet
- ✅ **Live-Check:** Automatisch beim Tippen
- ✅ **Kritische Warnungen:** Rotes Badge "⚠️ KOMPROMITTIERT" bei Breach
- ✅ **Anzahl der Leaks:** Zeigt wie oft das Passwort gefunden wurde
- ✅ **Score-Anpassung:** -40 Punkte bei kompromittierten Passwörtern

**Beispiel:**
```
password123 → ⚠️ KOMPROMITTIERT
             → In 47.123 Datenlecks gefunden!

X9$mK#pL2qR! → ✓ Nicht in Datenlecks gefunden
              → Ausgezeichnetes Passwort!
```

#### 4. Browser-Benachrichtigungen 🔔
- ✅ **Smart-Notifications:** Warnung bei hoher Tracker/Ad-Aktivität
- ✅ **Cooldown-System:** Max 1 Benachrichtigung pro 10 Sekunden
- ✅ **Threshold:**
  - >10 Tracker → "Hohe Tracker-Aktivität!"
  - >20 Ads → "Viele Werbung blockiert!"
- ✅ **Toggle in Settings:** Ein/Aus-Schalter

#### 5. Auto-HTTPS Upgrade 🔒
- ✅ **Automatisches Upgrade:** HTTP → HTTPS
- ✅ **Smart-Retry:** Max 2 Versuche, dann Fallback zu HTTP
- ✅ **Localhost-Ausnahme:** Lokale Entwicklung nicht beeinträchtigt
- ✅ **Private-Network-Ausnahme:** 192.168.x.x und 10.x.x.x ausgenommen
- ✅ **Toggle in Settings:** Ein/Aus-Schalter
- ✅ **Aktiv in allen Modi:** Normal, Balanced, Stealth

**Schutz vor:**
- Man-in-the-Middle-Attacks
- Unverschlüsselter Datenübertragung
- Downgrade-Attacks

#### 6. Tracker-Statistik-Dashboard 📊
- ✅ **Visuelles Chart:** 6 Kategorien mit Icons
- ✅ **Live-Counts:** Zeigt Anzahl pro Kategorie
- ✅ **Farbige Highlights:** Orange Border bei aktiven Trackern
- ✅ **Responsive:** 3-Spalten (Desktop), 2-Spalten (Mobile)

#### 7. Custom-Mode System 🎨
- ✅ **4. Modus:** Normal, Balanced, Stealth, **Custom**
- ✅ **19 individuell konfigurierbare Features**
- ✅ **2-3 Stufen pro Feature:**
  - 2 Stufen: Aus/Ein (z.B. Clipboard, Cookies)
  - 3 Stufen: Aus/Medium/Hoch (z.B. Canvas, WebGL, Referer)
- ✅ **Auto-Wechsel:** Änderung eines Features → automatisch Custom
- ✅ **Persistente Speicherung:** Custom-Settings bleiben erhalten
- ✅ **Accordion-UI:** Jedes Feature ausklappbar mit Erklärung

**UI-Features:**
- Interaktive Buttons (Aus/Medium/Hoch)
- Farbcodierung (Grau/Orange/Grün)
- Detaillierte Beschreibungen für jedes Feature
- Smooth Animations

### 🔧 Technische Änderungen
- ✅ Neue Permission: `notifications`
- ✅ Neue Dateien:
  - `cookie-blocker.js` (Third-Party-Cookie-Blocker)
  - `tracker-database.js` (Tracker-Datenbank)
  - `https-upgrade.js` (Auto-HTTPS-Logik)
  - `dashboard-features.js` (Feature-Definitionen)
- ✅ Settings-Page erweitert:
  - Notifications-Toggle
  - Auto-HTTPS-Toggle
  - Verbesserte Whitelist-UI
- ✅ Dashboard erweitert:
  - Tracker-Statistik-Chart
  - Custom-Mode-Support
  - 19 Features statt 18

### 📊 Feature-Count
**Insgesamt:**
- 🛡️ **19 Privacy-Features** (individuell konfigurierbar)
- 🚫 **Ad-Blocker** (60+ Werbenetzwerke)
- 📊 **Tracker-Database** (100+ bekannte Tracker)
- 🔐 **Password-Leak-Check** (600M+ kompromittierte Passwörter)
- 🔔 **Smart-Notifications**
- 🔒 **Auto-HTTPS**
- 🎨 **Custom-Mode**

---

## [1.2.0] - 2025-10-21

### ✨ Neue Privacy-Features - Phase 1: HTTP-Header & Tracking-Protection

#### HTTP-Header-Manipulation (Balanced & Stealth)
- ✅ **Accept-Language Header:** Automatisch auf `en-US` gesetzt (verhindert Sprach-Fingerprinting)
- ✅ **Referer-Schutz:**
  - **Balanced:** Minimiert für Scripts/XHR (schützt vor Tracking)
  - **Stealth:** KOMPLETT entfernt (maximale Privatsphäre)
- ✅ **DoNotTrack + Sec-GPC:** Beide Header gesetzt (Signal an Websites)
- ✅ **ETag-Blocking (Stealth):** Verhindert Cache-basiertes Tracking

#### URL-Säuberung (Balanced & Stealth)
- ✅ **Tracking-Parameter automatisch entfernt:**
  - UTM-Parameter (utm_source, utm_medium, utm_campaign, etc.)
  - Social-Media-Tracker (fbclid, gclid, msclkid)
  - Referrer-IDs (ref, referrer, _hsenc, etc.)
- ✅ URLs werden automatisch gereinigt beim Laden
- ✅ Verhindert Cross-Site-Tracking über URL-Parameter

#### JavaScript-API-Schutz (Balanced & Stealth)
- ✅ **Media-Devices-Fingerprinting blockiert:** `enumerateDevices()` gibt leere Liste zurück
- ✅ **Clipboard-Zugriff blockiert:** Websites können Clipboard nicht mehr lesen
- ✅ **Performance-API gefiltert (Stealth):** Cross-Origin-Timing-Daten verborgen
- ✅ **Keyboard/Mouse-Timing-Noise (Stealth):** Verhindert Behavioral Fingerprinting

#### Dashboard-Updates
- ✅ **18 Features** statt 12 im Privacy-Dashboard
- ✅ Neue Features angezeigt:
  - URL-Tracking-Schutz 🧹
  - HTTP-Referer-Manipulation 🔗
  - Sprache (HTTP-Header) 🌍
  - Media-Devices-Schutz 🎤
  - Clipboard-Schutz 📋
  - Performance-API-Filterung ⏱️
  - ETag-Blocking 📦
- ✅ Detaillierte Unterschiede zwischen Balanced und Stealth sichtbar

### 🔧 Technische Änderungen
- ✅ Neue Permission: `declarativeNetRequestWithHostAccess` für Header-Manipulation
- ✅ Neue Datei: `privacy-rules.json` für statische Privacy-Rules
- ✅ Dynamic Rules für modusspezifische Header-Manipulation
- ✅ Background.js erweitert mit `updatePrivacyRules()` und `cleanTrackingUrl()`
- ✅ injected.js erweitert mit zusätzlichen API-Protections

### 📊 Feature-Verteilung
**Normal (0 Features aktiv):**
- Keine Protections

**Balanced (10 Features aktiv):**
- WebGL, Canvas, Geolocation, WebRTC, Hardware-Info
- URL-Tracking, HTTP-Referer (minimiert), HTTP-Sprache
- Media-Devices, Clipboard

**Stealth (18 Features aktiv):**
- Alle von Balanced +
- Cookies blockiert, Storage blockiert
- Audio-Fingerprinting blockiert
- DoNotTrack erzwungen (HTTP + JS)
- Sprache (JS) erzwungen auf en-US
- Plugins versteckt
- HTTP-Referer KOMPLETT entfernt
- Performance-API gefiltert
- ETag-Tracking blockiert
- Keyboard/Mouse-Timing-Noise

---

## [1.1.0] - 2025-10-18

### 🎉 Neue Features

#### 🚫 Ad-Blocker (Major Feature!)
- **Automatisches Ad-Blocking** für 60+ bekannte Werbenetzwerke
- **Live-Statistiken** im Dashboard
  - Anzahl geblockter Ads pro Seite
  - Session-Gesamtstatistik
  - Detaillierte Liste mit Ad-Typ-Kategorisierung
- **Ein/Aus-Toggle** im Dashboard
- **Whitelist-Funktion** (Backend fertig, UI coming soon)
- **Extension Badge** zeigt geblockte Ads
- **Extension Popup** zeigt Ad-Block-Stats

##### Geblockte Werbenetzwerke:
- Google Ads (googlesyndication, doubleclick)
- Facebook Ads
- Amazon Ads
- Microsoft/Bing Ads
- Twitter/X Ads
- Taboola & Outbrain (Content Ads)
- PopAds & PopUnder Networks
- Video Ads (YouTube Pre-Roll, etc.)
- Tracking & Analytics (Google Analytics, Mixpanel, etc.)

#### 🧠 KI-Analyse Optimierung
- **On-Demand statt automatisch** - spart API-Kosten! 💰
- **Intelligentes Domain-Caching** - einmal analysiert = für immer gespeichert
- **Button "Mit KI analysieren"** - volle Kontrolle
- **"Neu analysieren"** Button für Updates
- **Zeitstempel** - "Analysiert vor X Min."
- **Cache-Hinweis** - "Aus Cache - spart API-Kosten"
- **~90% API-Call-Ersparnis** durch Caching

### 🔧 Verbesserungen

#### Performance
- **Schnellere Ladezeiten** durch Ad-Blocking
- **Weniger Datenverbrauch** (keine Ad-Downloads)
- **Optimierte WebSocket-Kommunikation**

#### UI/UX
- **Live-Badge** zeigt geblockte Ads (grün) oder Tracker (orange)
- **Ad-Blocker Card** im Dashboard mit Statistiken
- **Geblockte Ads Liste** mit Kategorisierung
- **Bessere Fehlerbehandlung** für WebSocket-Nachrichten
- **Visuelles Feedback** bei allen Aktionen

### 🐛 Bugfixes
- **WebSocket Blob-Parsing** - behebt "[object Blob] is not valid JSON" Fehler
- **Message-Listener** - behebt "asynchronous response" Fehler
- **Localhost-Filtering** - Dashboard wird nicht mehr getrackt
- **React State Updates** - Live-Dashboard aktualisiert jetzt korrekt
- **Extension-Reconnect** - robustere WebSocket-Verbindung

### 📝 Dokumentation
- **ADBLOCKER_INFO.md** - Vollständige Ad-Blocker Doku
- **TEST_UPDATES.md** - Test-Anleitung für Live-Updates
- **CHANGELOG.md** - Diese Datei!
- **README.md** - Aktualisiert mit Ad-Blocker Features

---

## [1.0.0] - 2025-10-18

### 🎉 Initiales Release

#### Core Features
- **Live Security Monitor** - Echtzeit-Überwachung beim Browsen
- **Browser Extension** (Chrome/Edge)
  - Background Worker mit WebSocket
  - Content Scripts für Permission-Monitoring
  - Popup mit Quick-Stats
- **Next.js Dashboard**
  - Live-Ansicht mit WebSocket
  - Security-Score Berechnung
  - Tracker-Erkennung
  - Cookie-Monitoring
  - Third-Party-Connections
  - Permission-Tracking

#### Tools
- **URL-Scanner** - Manuelle URL-Sicherheitsanalyse
- **Password-Checker** - Passwortstärke-Analyse + Generator
- **KI-Assistent** - Chat mit Security-Experten (OpenAI GPT-4)
- **Security Insights** - Best Practices & Tips
- **Aktivitätsprotokoll** - Historie (mit Mock-Daten)

#### Technischer Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite
- WebSocket-Server (Node.js)
- Chrome Extension Manifest V3
- OpenAI API Integration

#### Security & Privacy
- **Privacy First** - Alle Daten lokal gespeichert
- **Keine Cloud** - Daten bleiben auf deinem Rechner
- **Passwörter** - Werden NIE gespeichert
- **HTTPS-Prüfung** - SSL/TLS-Status-Anzeige

---

## Geplante Features (Roadmap)

### v1.2.0 (Nächstes Release)
- [ ] Whitelist-UI für Ad-Blocker
- [ ] Element-Hiding (verstecke Ad-Platzhalter)
- [ ] Dashboard mit echten Daten statt Mock
- [ ] Export/Import von Settings

### v1.3.0
- [ ] Custom Filter-Listen für Ad-Blocker
- [ ] Browser-Notifications bei Gefahren
- [ ] Dark/Light Mode Toggle
- [ ] Have I Been Pwned Integration

### v2.0.0 (Später)
- [ ] Firefox Support
- [ ] Electron Desktop-App
- [ ] Verschlüsselter Passwort-Vault
- [ ] Multi-Language Support
- [ ] PDF-Reports

---

**Hinweis:** Datum-Format: YYYY-MM-DD

