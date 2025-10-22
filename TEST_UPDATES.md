# 🧪 Test-Anleitung: Live-Updates testen

## Das Problem war:
Dashboard hat sich nicht automatisch aktualisiert beim Website-Wechsel.

## Die Lösung:
- **useRef + useCallback Pattern** für WebSocket-Handler
- **key-Props** für erzwungenes Re-Rendering
- **Besseres Logging** zum Debuggen
- **Visuelle Indikatoren** für Updates

## So testest du die Fixes:

### 1. Extension neu laden
```
chrome://extensions/ → 🔄 klicken bei Cybo
```

### 2. Server neu starten
```bash
# Terminal: Strg+C zum Stoppen
npm run dev:all
```

### 3. Test-Szenario:

**Schritt 1:** Öffne Chrome Dev Tools (F12) im Dashboard-Fenster
- Gehe zur Console
- Du solltest Logs sehen wie:
  - `🔌 Erstelle WebSocket-Verbindung...`
  - `✅ Verbunden mit WebSocket`

**Schritt 2:** Besuche eine Website
- Öffne neuen Tab
- Gehe zu `github.com`
- Warte 2 Sekunden

**Schritt 3:** Prüfe Console
- Console sollte zeigen:
  - `📨 Daten empfangen: {...}`
  - `✅ Aktualisiere Dashboard mit: https://github.com`
  - `🤖 Starte KI-Analyse für: https://github.com`

**Schritt 4:** Prüfe Dashboard
- Dashboard sollte **SOFORT** GitHub-Daten zeigen
- "Live" Badge sollte blinken
- "Zuletzt: [Zeit]" sollte aktualisieren

**Schritt 5:** Wechsle Website
- Gehe zu `amazon.de` (im selben Tab oder neuem)
- Dashboard sollte **AUTOMATISCH** aktualisieren!
- Keine manuelle Aktion nötig!

**Schritt 6:** Schneller Wechsel-Test
- Öffne mehrere Tabs nacheinander:
  1. `reddit.com`
  2. `stackoverflow.com`
  3. `youtube.com`
- Dashboard sollte jedes Mal aktualisieren!

## Was du sehen solltest:

### ✅ Erfolgreich:
- Dashboard zeigt neue Website **sofort** (< 1 Sekunde)
- URL ändert sich automatisch
- Security-Score aktualisiert sich
- Tracker/Cookies/Third-Parties aktualisieren
- KI-Analyse startet automatisch
- "Live" Badge blinkt grün
- Console zeigt Logs

### ❌ Nicht erfolgreich (wenn immer noch nicht):
- Console zeigt keine `📨 Daten empfangen` Logs
  → WebSocket-Problem, Server neu starten
  
- Console zeigt `🚫 Localhost ignoriert`
  → Gut! Das bedeutet es funktioniert
  
- Dashboard zeigt alte Daten
  → Extension neu laden + Server neu starten

## Debug-Tipps:

### Console-Logs prüfen:

**Dashboard Console (F12 im Dashboard-Fenster):**
```
🔌 Erstelle WebSocket-Verbindung...
✅ Verbunden mit WebSocket
📨 Daten empfangen: {type: "WEBSITE_DATA", ...}
✅ Aktualisiere Dashboard mit: https://example.com
🤖 Starte KI-Analyse für: https://example.com
✅ KI-Analyse abgeschlossen
```

**Extension Background Console:**
```
chrome://extensions/ → Cybo → "Details" → "Hintergrundseite"

🌐 Neue Website: https://example.com
📨 Nachricht an App gesendet
```

### Häufige Probleme:

**Problem:** Keine Logs im Dashboard
- **Lösung:** F12 drücken, zur Console-Tab wechseln

**Problem:** `WebSocket connection failed`
- **Lösung:** `npm run ws` läuft? Port 3001 frei?

**Problem:** Dashboard zeigt nur localhost
- **Lösung:** Extension neu laden, sollte jetzt ignoriert werden

**Problem:** Updates kommen verzögert
- **Lösung:** Normal! KI-Analyse dauert 1-2 Sek.

## Erwartete Performance:

- **Website-Wechsel → Dashboard-Update:** < 500ms
- **Tracker-Erkennung:** Sofort
- **KI-Analyse:** 1-3 Sekunden
- **Cookie-Count:** Sofort
- **Security-Score:** Sofort

## Visuelles Feedback:

Wenn alles funktioniert, siehst du:
1. **"Live" Badge** - blinkt grün (oben rechts)
2. **"Zuletzt: [Zeit]"** - aktualisiert bei jedem Wechsel
3. **Website-URL** - ändert sich sofort
4. **Zahlen** - aktualisieren in Echtzeit
5. **KI-Box** - zeigt "Analysiere..." dann Ergebnis

---

**Bei Problemen:** Schau in die Console-Logs!

