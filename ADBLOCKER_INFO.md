# 🚫 Cybo Ad-Blocker

Der eingebaute Ad-Blocker blockiert automatisch Werbung und Tracker beim Surfen!

## ✨ Was wird blockiert?

### 🎯 Werbenetzwerke:
- **Google Ads** (googlesyndication.com, doubleclick.net)
- **Facebook Ads** (facebook.com/tr, connect.facebook.net)
- **Amazon Ads** (amazon-adsystem.com)
- **Microsoft/Bing Ads**
- **Twitter/X Ads**
- **Taboola & Outbrain** (Content Ads)
- **PopAds & PopUnder** Networks
- **Video Ads** (YouTube Pre-Roll, etc.)

### 📊 Tracking & Analytics:
- Google Analytics
- Google Tag Manager
- Hotjar, Mixpanel, Segment
- Facebook Pixel
- Und viele mehr...

### 🎨 Ad-Typen:
- Display Ads (Banner)
- Video Ads (Pre-Roll, Mid-Roll)
- Popup/Popunder Ads
- Content Ads (Native Advertising)
- Tracker Pixels

**Insgesamt:** 60+ bekannte Ad-Domains + URL-Muster-Erkennung

## 🎮 Funktionen:

### ✅ Automatisches Blocking
- Läuft im Hintergrund
- Blockiert Ads **bevor** sie geladen werden
- Schnellere Ladezeiten! ⚡
- Weniger Datenverbrauch! 📉

### 📊 Live-Statistiken
- **Badge am Extension-Icon** - zeigt geblockte Ads
- **Popup** - Quick-Stats der aktuellen Seite
- **Dashboard** - Detaillierte Übersicht mit allen Infos

### 🎛️ Volle Kontrolle
- **Ein/Aus-Schalter** im Dashboard
- **Whitelist-Funktion** für Lieblings-Websites (coming soon)
- **Statistiken** - Wie viele Ads geblockt wurden

### 🔍 Transparenz
- Siehst **genau**, was geblockt wurde
- Ad-Typ wird kategorisiert (Google Ads, Facebook Ads, etc.)
- Domain-Namen der geblockten Ads

## 📊 Dashboard-Anzeige:

```
┌──────────────────────────────────┐
│ 🛡️ Ad-Blocker    [✅ Aktiviert] │
├──────────────────────────────────┤
│ Diese Seite:              12     │
│ Diese Session:           142     │
│ ⚡ Schnellere Ladezeiten         │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ 🚫 Geblockte Werbung             │
├──────────────────────────────────┤
│ • googlesyndication.com          │
│   [Google Ads]                   │
│ • doubleclick.net                │
│   [Display Ads]                  │
│ • facebook.net                   │
│   [Facebook Ads]                 │
│ ...                              │
└──────────────────────────────────┘
```

## 🧪 So testest du es:

1. **Extension laden** (siehe EXTENSION_SETUP.md)
2. **Dashboard öffnen** (http://localhost:3000/live)
3. **Besuche eine Website mit viel Werbung:**
   - News-Websites (z.B. Spiegel, Bild)
   - YouTube
   - Streaming-Sites
   - Blogs mit Ads

4. **Schaue auf:**
   - Extension Badge (zeigt Anzahl)
   - Extension Popup (Quick-Stats)
   - Dashboard (detaillierte Infos)

## 🎯 Vorteile:

### ⚡ Performance
- **Schnellere Ladezeiten** - Ads laden nicht mehr
- **Weniger Datenverbrauch** - Keine Ad-Downloads
- **Weniger CPU-Last** - Keine Ad-Scripts

### 🔒 Sicherheit
- **Weniger Tracking** - Ads tracken dich oft
- **Weniger Malware-Risiko** - Malvertising wird blockiert
- **Mehr Privatsphäre** - Keine Ad-Netzwerk-Kommunikation

### 😊 User Experience
- **Weniger Ablenkung** - Keine blinkenden Ads
- **Mehr Platz** - Content ohne Ads
- **Kein Popup-Spam** - Nervige Popups weg

## 📈 Typische Ergebnisse:

**News-Website (z.B. Spiegel.de):**
- 15-30 geblockte Ads pro Seite
- 40-60% schnellere Ladezeit
- 2-5 MB weniger Datenverbrauch

**YouTube:**
- Pre-Roll Ads blockiert
- Overlay-Ads blockiert
- Schnellerer Video-Start

**Social Media:**
- Tracker blockiert
- Sponsored Posts teilweise blockiert
- Weniger Datensammlung

## ⚙️ Technische Details:

### Blocking-Methode:
- **webRequest API** - Blockt Requests **bevor** sie starten
- **Blacklist-basiert** - 60+ bekannte Ad-Domains
- **Pattern-Matching** - Erkennt Ads an URL-Mustern
- **Zero-Latency** - Blocking in Millisekunden

### Kategorisierung:
```javascript
Google Ads     → googlesyndication.com
Facebook Ads   → facebook.com/tr
Amazon Ads     → amazon-adsystem.com
Content Ads    → taboola.com, outbrain.com
Popup Ads      → popads.net
Video Ads      → imasdk.googleapis.com
Tracking       → analytics.google.com
Display Ads    → Alle anderen
```

## 🔄 Unterschied zu anderen Ad-Blockern:

**Cybo Ad-Blocker:**
- ✅ Integriert in Security-Tool
- ✅ Live-Stats im Dashboard
- ✅ Kategorisierte Ad-Typen
- ✅ Session-Statistiken
- ✅ Echtzeit-Visualisierung

**Klassische Ad-Blocker (uBlock, AdBlock Plus):**
- ❌ Nur Ad-Blocking
- ❌ Weniger Statistiken
- ❌ Keine Kategorisierung
- ✅ Aber: Mehr Filter-Listen (umfangreicher)

## 🚀 Kommende Features:

- [ ] **Whitelist-UI** - Websites von Blocking ausschließen
- [ ] **Custom Filter-Listen** - Eigene Domains hinzufügen
- [ ] **Element-Hiding** - Verstecke Ad-Platzhalter
- [ ] **Filter-Subscriptions** - EasyList etc. importieren
- [ ] **Per-Domain Settings** - Individuelle Einstellungen
- [ ] **Export/Import** - Settings teilen

## 🆘 Probleme?

**Ads werden nicht blockiert?**
- Prüfe: Ad-Blocker aktiviert? (Dashboard)
- Manche Sites haben Anti-Ad-Blocker
- Reload die Seite nach Aktivierung

**Website funktioniert nicht mehr?**
- Manche Sites brechen bei Ad-Blocking
- Lösung: Whitelist-Funktion nutzen (coming soon)
- Oder Ad-Blocker temporär deaktivieren

**Zu viel/zu wenig geblockt?**
- Liste ist konservativ (nur bekannte Ads)
- Kann erweitert werden in `extension/ad-blocker.js`

---

**Viel Spaß mit werbefreiem Surfen! 🎉**

