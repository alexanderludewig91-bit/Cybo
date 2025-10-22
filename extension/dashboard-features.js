// Feature-Definitionen für Custom-Mode
// Wird von dashboard.js eingebunden

const ALL_FEATURES = [
  {
    id: 'webgl',
    icon: '🎮',
    name: 'WebGL Fingerprint',
    description: 'WebGL ist eine 3D-Grafik-API die Websites nutzen können. Dabei wird Ihre echte Grafikkarte (z.B. "NVIDIA RTX 4070") sichtbar - eine einzigartige ID! Cybo fälscht diese Information zu einer sehr häufigen GPU, damit Sie in der Masse verschwinden.',
    levels: {
      off: { status: 'inactive', detail: 'Echte GPU sichtbar', label: 'Aus' },
      medium: { status: 'active', detail: 'Intel HD 630 (gefälscht)', label: 'Medium' },
      high: { status: 'active', detail: 'Generic Renderer (sehr generisch)', label: 'Hoch' }
    }
  },
  {
    id: 'geolocation',
    icon: '📍',
    name: 'Geolocation',
    description: 'Websites können Ihren GPS-Standort über die Browser-API abfragen. Cybo fälscht Ihre Position nach Berlin, sodass Websites denken Sie befinden sich dort - unabhängig von Ihrem echten Standort. (Hinweis: IP-basierte Geolocation erfordert zusätzlich einen VPN)',
    levels: {
      off: { status: 'inactive', detail: 'Echter Standort', label: 'Aus' },
      on: { status: 'active', detail: 'Berlin (gefälscht)', label: 'Ein' }
    }
  },
  {
    id: 'webrtc',
    icon: '🌐',
    name: 'WebRTC IP-Leak',
    description: 'WebRTC wird für Video-Calls genutzt, kann aber Ihre echte IP-Adresse verraten - selbst wenn Sie einen VPN nutzen! Cybo filtert STUN-Server-Verbindungen um dieses Leck zu stopfen.',
    levels: {
      off: { status: 'inactive', detail: 'Keine Filterung', label: 'Aus' },
      on: { status: 'active', detail: 'STUN-Server gefiltert', label: 'Ein' }
    }
  },
  {
    id: 'canvas',
    icon: '🎨',
    name: 'Canvas Fingerprint',
    description: 'Websites können unsichtbare Bilder im Browser rendern und messen wie Ihre Hardware das Bild darstellt - eine einzigartige "Unterschrift". Cybo injiziert zufälliges Rauschen (Noise) in diese Bilder, sodass Ihr Fingerprint jedes Mal anders aussieht.',
    levels: {
      off: { status: 'inactive', detail: 'Kein Schutz', label: 'Aus' },
      medium: { status: 'active', detail: '10% Noise injiziert', label: '10%' },
      high: { status: 'active', detail: '20% Noise injiziert', label: '20%' }
    }
  },
  {
    id: 'hardware',
    icon: '💻',
    name: 'Hardware-Info',
    description: 'Ihr Browser verrät Bildschirmauflösung, CPU-Kerne und Speicher. Diese Kombination kann Sie identifizieren. Cybo normalisiert diese Werte zu sehr häufigen Konfigurationen (Balanced: 1920x1080/8 Cores, Stealth: 1366x768/4 Cores - die häufigste Kombination weltweit).',
    levels: {
      off: { status: 'inactive', detail: 'Echte Werte', label: 'Aus' },
      medium: { status: 'active', detail: '1920x1080, 8 Cores', label: 'Medium' },
      high: { status: 'active', detail: '1366x768, 4 Cores', label: 'Hoch' }
    }
  },
  {
    id: 'urlTracking',
    icon: '🧹',
    name: 'URL-Tracking',
    description: 'Wenn Sie auf einen Link klicken, hängen Werbetreibende oft Tracking-Codes an (utm_source, fbclid, etc.). Diese verraten woher Sie kommen und können Sie über mehrere Websites verfolgen. Cybo entfernt diese Parameter automatisch aus URLs bevor die Seite lädt.',
    levels: {
      off: { status: 'inactive', detail: 'UTM/FBCLID nicht entfernt', label: 'Aus' },
      on: { status: 'active', detail: 'Tracking-Parameter entfernt', label: 'Ein' }
    }
  },
  {
    id: 'referer',
    icon: '🔗',
    name: 'HTTP Referer',
    description: 'Jedes Mal wenn Sie einen Link klicken, sendet Ihr Browser einen "Referer"-Header der verrät von welcher Seite Sie kommen. Das ermöglicht Cross-Site-Tracking. Balanced minimiert den Referer, Stealth entfernt ihn komplett.',
    levels: {
      off: { status: 'inactive', detail: 'Voller Referer gesendet', label: 'Aus' },
      medium: { status: 'active', detail: 'Minimiert (nur für Scripts)', label: 'Minimiert' },
      high: { status: 'active', detail: 'KOMPLETT entfernt', label: 'Entfernt' }
    }
  },
  {
    id: 'language',
    icon: '🌍',
    name: 'Sprache (HTTP)',
    description: 'Ihr Browser sendet Ihre bevorzugte Sprache (z.B. "de-DE") an Websites. Das verrät Ihre Region und ist Teil Ihres Fingerprints. Cybo setzt den HTTP-Header auf "en-US" um Sie generischer erscheinen zu lassen. Im Stealth-Modus wird auch die JavaScript-Sprache gefälscht.',
    levels: {
      off: { status: 'inactive', detail: 'Echte Sprache (de-DE)', label: 'Aus' },
      medium: { status: 'active', detail: 'en-US (HTTP-Header)', label: 'HTTP' },
      high: { status: 'active', detail: 'en-US (HTTP + JS)', label: 'HTTP + JS' }
    }
  },
  {
    id: 'mediaDevices',
    icon: '🎤',
    name: 'Media Devices',
    description: 'Websites können eine Liste Ihrer Kameras, Mikrofone und Lautsprecher abfragen - jedes Gerät hat eine einzigartige ID. Diese kann Sie über Websites hinweg tracken. Cybo gibt eine leere Liste zurück, sodass Websites keine Ihrer Geräte sehen.',
    levels: {
      off: { status: 'inactive', detail: 'Echte Device-IDs', label: 'Aus' },
      on: { status: 'active', detail: 'Keine Geräte gezeigt', label: 'Ein' }
    }
  },
  {
    id: 'clipboard',
    icon: '📋',
    name: 'Clipboard',
    description: 'Bösartige Websites können versuchen Ihre Zwischenablage auszulesen (z.B. Passwörter die Sie gerade kopiert haben). Cybo blockiert jeden Clipboard-Lesezugriff komplett.',
    levels: {
      off: { status: 'inactive', detail: 'Websites können lesen', label: 'Aus' },
      on: { status: 'active', detail: 'Zugriff BLOCKIERT', label: 'Ein' }
    }
  },
  {
    id: 'timezone',
    icon: '⏰',
    name: 'Timezone',
    description: 'Ihre Zeitzone verrät Ihre ungefähre geografische Lage. Cybo fälscht JavaScript-Zeitzone auf UTC. ACHTUNG: IP-basierte Timezone-Detection (über HTTP-Header) kann nicht gefälscht werden - dafür benötigen Sie einen VPN.',
    levels: {
      off: { status: 'inactive', detail: 'Echte Timezone', label: 'Aus' },
      on: { status: 'partial', detail: 'UTC (JS-seitig)', label: 'Ein' }
    }
  },
  {
    id: 'cookies',
    icon: '🍪',
    name: 'Cookies',
    description: 'Cookies werden oft für Tracking genutzt. Im Stealth-Modus blockiert Cybo ALLE Cookie-Zugriffe - Websites können weder Cookies lesen noch setzen. WARNUNG: Das bricht Logins und viele Website-Features!',
    levels: {
      off: { status: 'inactive', detail: 'Cookies erlaubt', label: 'Aus' },
      on: { status: 'active', detail: 'Cookies BLOCKIERT', label: 'Ein' }
    }
  },
  {
    id: 'storage',
    icon: '📦',
    name: 'Storage',
    description: 'LocalStorage und SessionStorage sind wie Cookies - können Daten dauerhaft speichern und Sie tracken. Im Stealth-Modus blockiert Cybo jeden Storage-Zugriff. WARNUNG: Viele moderne Webapps benötigen Storage!',
    levels: {
      off: { status: 'inactive', detail: 'LocalStorage erlaubt', label: 'Aus' },
      on: { status: 'active', detail: 'LocalStorage BLOCKIERT', label: 'Ein' }
    }
  },
  {
    id: 'audio',
    icon: '🔊',
    name: 'Audio Fingerprint',
    description: 'Websites können unhörbare Audio-Signale generieren und messen wie Ihre Hardware diese verarbeitet - ein weiterer Fingerprint. Cybo blockiert die AudioContext-API komplett im Stealth-Modus um dies zu verhindern.',
    levels: {
      off: { status: 'inactive', detail: 'Kein Schutz', label: 'Aus' },
      on: { status: 'active', detail: 'AudioContext BLOCKIERT', label: 'Ein' }
    }
  },
  {
    id: 'doNotTrack',
    icon: '🚫',
    name: 'DoNotTrack',
    description: 'DoNotTrack (DNT) ist ein Signal an Websites: "Bitte tracke mich nicht". Die meisten Websites ignorieren es, aber Cybo setzt es trotzdem - sowohl als HTTP-Header als auch in JavaScript. Zusätzlich wird der neue "Global Privacy Control" (GPC) Header gesetzt.',
    levels: {
      off: { status: 'inactive', detail: 'Nicht gesetzt', label: 'Aus' },
      on: { status: 'active', detail: 'Aktiv (HTTP + JS)', label: 'Ein' }
    }
  },
  {
    id: 'plugins',
    icon: '🔌',
    name: 'Plugins',
    description: 'Ihr Browser kann Plugins wie PDF-Viewer oder Flash anzeigen. Diese Liste ist Teil Ihres Fingerprints. Im Stealth-Modus versteckt Cybo alle Plugins, sodass Websites denken Sie haben keine installiert.',
    levels: {
      off: { status: 'inactive', detail: 'Plugins sichtbar', label: 'Aus' },
      on: { status: 'active', detail: 'Alle versteckt', label: 'Ein' }
    }
  },
  {
    id: 'performance',
    icon: '⏱️',
    name: 'Performance API',
    description: 'Die Performance-API zeigt Ladezeiten von Ressourcen - auch von anderen Websites. Das kann für Tracking missbraucht werden. Im Stealth-Modus filtert Cybo Cross-Origin-Performance-Daten.',
    levels: {
      off: { status: 'inactive', detail: 'Alle Daten sichtbar', label: 'Aus' },
      on: { status: 'active', detail: 'Cross-Origin gefiltert', label: 'Ein' }
    }
  },
  {
    id: 'etag',
    icon: '📦',
    name: 'ETag-Tracking',
    description: 'ETags sind HTTP-Header für Caching, können aber als "Super-Cookies" missbraucht werden um Sie zu tracken - selbst wenn Sie Cookies löschen! Cybo entfernt alle ETag-Header im Stealth-Modus.',
    levels: {
      off: { status: 'inactive', detail: 'ETags erlaubt', label: 'Aus' },
      on: { status: 'active', detail: 'ETags BLOCKIERT', label: 'Ein' }
    }
  },
  {
    id: 'thirdPartyCookies',
    icon: '🍪',
    name: 'Third-Party-Cookies',
    description: 'First-Party-Cookies (von der Website selbst) sind meist nötig für Login und Funktionen. Third-Party-Cookies (von anderen Domains) werden für Cross-Site-Tracking genutzt. Cybo blockiert gezielt nur Third-Party-Cookies, während First-Party-Cookies erlaubt bleiben - so funktionieren Websites weiterhin!',
    levels: {
      off: { status: 'inactive', detail: 'Alle Cookies erlaubt', label: 'Aus' },
      on: { status: 'active', detail: 'Third-Party blockiert', label: 'Ein' }
    }
  }
];

