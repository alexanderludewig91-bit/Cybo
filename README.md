# 🛡️ Cybo - Dein persönlicher Security Hub

Willkommen bei Cybo! Ein innovativer Cyber Security Hub mit **Live-Browser-Monitoring**, der dir in Echtzeit zeigt, was beim Surfen passiert. Volle Transparenz und Kontrolle über deine Online-Privatsphäre!

## 🌟 Hauptfeatures

### 📡 Live Security Monitor
**Passives Monitoring während du surfst!** Die Browser Extension überwacht alle Websites in Echtzeit und zeigt dir:
- 🍪 Welche Cookies gesetzt werden
- 📊 Welche Tracker aktiv sind (Google Analytics, Facebook, etc.)
- 🌐 Welche Third-Party-Domains kontaktiert werden
- 📍 Welche Berechtigungen angefordert werden (Geolocation, Kamera, etc.)
- 🔒 HTTPS-Status und Verschlüsselung
- 📡 Alle Network-Requests in Echtzeit

### 🚫 Intelligenter Ad-Blocker
**Blockiert Werbung & Tracker automatisch!**
- 🎯 **60+ bekannte Ad-Networks** (Google Ads, Facebook, Amazon, etc.)
- ⚡ **Schnellere Ladezeiten** - Ads laden gar nicht erst
- 📉 **Weniger Datenverbrauch** - Keine Ad-Downloads
- 📊 **Live-Statistiken** - Sieh was geblockt wurde
- 🎛️ **Ein/Aus-Toggle** - Volle Kontrolle
- 🔍 **Transparenz** - Kategorisierte Ad-Typen (Google Ads, Popup, Video, etc.)

**Kein manuelles Eintragen nötig** - die App begleitet dich automatisch!

## ✨ Weitere Features

### 🏠 Dashboard
- Übersichtliche Sicherheitsmetriken auf einen Blick
- Echtzeit-Security-Score
- Schnellzugriff auf alle Tools
- Aktivitätsübersicht
- **Ad-Blocker Statistiken** mit Ein/Aus-Schalter

### 🔐 Password-Analyzer
- Analysiert Passwortstärke in Echtzeit
- Generiert sichere Passwörter
- Zeigt geschätzte Knackzeit an
- Gibt konkrete Verbesserungsvorschläge
- Prüft auf häufige Muster

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18+ installiert
- Chrome oder Edge Browser
- (Optional) OpenAI API Key für KI-Features

### Setup in 3 Schritten

**1. Abhängigkeiten installieren:**
```bash
npm install
```

**2. Datenbank initialisieren:**
```bash
npx prisma generate
npx prisma db push
```

**3. App & WebSocket-Server starten:**
```bash
npm run dev:all
```

Das startet:
- ✅ Next.js auf http://localhost:3000
- ✅ WebSocket-Server auf Port 3001

**4. Browser Extension installieren:**

Siehe detaillierte Anleitung → [EXTENSION_SETUP.md](EXTENSION_SETUP.md)

**Kurz:**
- Öffne `chrome://extensions/` 
- Aktiviere "Entwicklermodus"
- Klicke "Entpackte Erweiterung laden"
- Wähle den `extension/` Ordner
- Fertig! 🎉

**5. Live-Monitor öffnen:**

Navigiere zu [http://localhost:3000/live](http://localhost:3000/live) und surfe los!

### Optional: OpenAI API Key

Für den KI-Assistenten (optional):

Erstelle eine `.env` Datei:
```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="dein-api-key"
```

> API Key unter https://platform.openai.com/api-keys erstellen

## 🎨 Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom Components mit Radix UI Patterns
- **Datenbank:** SQLite mit Prisma ORM
- **KI:** OpenAI GPT-4 (über Vercel AI SDK)
- **Animationen:** Framer Motion
- **Icons:** Lucide React

## 📁 Projektstruktur

```
cybo/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── chat/           # KI-Assistent Endpoint
│   │   ├── scan-url/       # URL-Scanner API
│   │   └── check-password/ # Password-Checker API
│   ├── chat/               # KI-Assistent Page
│   ├── url-scanner/        # URL-Scanner Page
│   ├── password-check/     # Password-Checker Page
│   ├── insights/           # Security Tips Page
│   ├── activity/           # Aktivitätslog Page
│   ├── layout.tsx          # Root Layout
│   ├── page.tsx            # Dashboard (Home)
│   └── globals.css         # Global Styles
├── components/              # React Components
│   ├── ui/                 # UI Basis-Komponenten
│   ├── Sidebar.tsx         # Navigation
│   └── SecurityScore.tsx   # Score-Widget
├── lib/                     # Utilities
│   ├── prisma.ts           # Prisma Client
│   └── utils.ts            # Helper Functions
├── prisma/                  # Datenbank
│   └── schema.prisma       # DB Schema
└── public/                  # Static Assets
```

## 🔒 Sicherheit & Datenschutz

- **Privacy First:** Alle Daten werden lokal in einer SQLite-Datenbank gespeichert
- **Keine Cloud:** Deine Daten verlassen deinen Rechner nicht (außer KI-Anfragen)
- **Passwörter:** Werden NIE gespeichert, nur die Analyse-Ergebnisse
- **Verschlüsselung:** Sensible Daten sollten verschlüsselt werden (Feature für v2)

## 🛠️ Development

```bash
# Next.js + WebSocket zusammen starten
npm run dev:all

# Oder separat:
npm run dev  # Next.js
npm run ws   # WebSocket-Server

# Production Build
npm run build
npm start

# Prisma Studio (DB GUI)
npx prisma studio

# Linting
npm run lint
```

## 🔌 Extension Development

```bash
# Extension neu laden nach Änderungen:
# chrome://extensions/ → 🔄 klicken

# Extension Debugging:
# Rechtsklick auf Extension-Icon → "Hintergrundseite prüfen"
```

## 📝 Geplante Features (Roadmap)

- [x] Browser Extension für Live-Scanning ✅
- [x] Netzwerk-Traffic-Monitoring ✅
- [x] Cookie & Tracker-Erkennung ✅
- [x] Permission-Monitoring ✅
- [x] **Ad-Blocker mit 60+ Filter-Regeln** ✅
- [x] **Live Ad-Blocking Statistiken** ✅
- [ ] KI-Website-Bewertung (on-demand mit Caching)
- [ ] Verschlüsselter Passwort-Vault
- [ ] Integration mit Have I Been Pwned API
- [x] Tracker-Blocking ✅ (via Ad-Blocker)
- [ ] Desktop-App mit Electron
- [ ] Dark/Light Mode Toggle
- [ ] Export von Reports (PDF)
- [ ] Multi-Language Support
- [ ] Push-Notifications bei Gefahren
- [ ] Historie aller besuchten Websites
- [ ] Datenschutz-Score pro Domain

## 🤝 Beitragen

Dies ist ein persönliches Projekt, aber Feedback und Vorschläge sind willkommen!

## 📄 Lizenz

Dieses Projekt ist für den persönlichen Gebrauch erstellt.

## 🙏 Credits

Entwickelt mit ❤️ für mehr Sicherheit im Netz.

---

**Hinweis:** Cybo ist ein Tool zur Unterstützung deiner Cybersicherheit. Es ersetzt nicht professionelle Sicherheitslösungen wie Antivirensoftware oder Firewalls, sondern ergänzt diese.

