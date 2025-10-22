// Cybo - Injected Script (läuft im Page-Context)
(function() {
  'use strict';
  
  console.log('🥷 Cybo Privacy Protection lädt...');
  
  // Lese Mode aus data-Attribut (wird von privacy-injector gesetzt)
  const scriptTag = document.currentScript;
  const privacyMode = scriptTag?.dataset?.mode || 'balanced';
  
  console.log('🥷 Privacy-Modus:', privacyMode);
  
  let fakeCoords = {
    latitude: 52.5200,
    longitude: 13.4050,
    accuracy: 100,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  };
  
  // Aktiviere Protection basierend auf Modus
  const isProtectionActive = (feature) => {
    if (privacyMode === 'normal') return false;
    if (privacyMode === 'stealth') return true;
    // Balanced: Die meisten Features
    if (privacyMode === 'balanced') {
      // Balanced aktiviert NICHT die aggressiven Features
      const balancedOnly = ['webrtc', 'canvas', 'webgl', 'geolocation', 'timezone', 'hardware'];
      return balancedOnly.includes(feature);
    }
    return true;
  };
  
  const isStealth = () => privacyMode === 'stealth';
  
  // ========== WebRTC IP-Leak Schutz ==========
  if (isProtectionActive('webrtc')) {
    const OriginalRTC = window.RTCPeerConnection || window.webkitRTCPeerConnection;
    if (OriginalRTC) {
    window.RTCPeerConnection = function(config, constraints) {
      if (config && config.iceServers) {
        config.iceServers = config.iceServers.filter(server => {
          const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
          return !urls.some(url => url && url.includes('stun'));
        });
        console.log('🛡️ WebRTC: STUN gefiltert');
      }
      return new OriginalRTC(config, constraints);
    };
      window.RTCPeerConnection.prototype = OriginalRTC.prototype;
      window.webkitRTCPeerConnection = window.RTCPeerConnection;
      console.log('✅ WebRTC Protection');
    }
  } else {
    console.log('⚪ WebRTC Protection deaktiviert (Normal-Modus)');
  }
  
  // ========== Canvas Fingerprinting ==========
  if (isProtectionActive('canvas')) {
    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    
    HTMLCanvasElement.prototype.toDataURL = function() {
      console.log('🎨 Canvas toDataURL abgefangen');
      return origToDataURL.apply(this, arguments);
    };
    
    CanvasRenderingContext2D.prototype.getImageData = function() {
      const imageData = origGetImageData.apply(this, arguments);
      const noise = privacyMode === 'stealth' ? 0.20 : 0.10;
      
      // Noise injizieren
      for (let i = 0; i < imageData.data.length; i += 4) {
        const shift = Math.floor(Math.random() * 20) - 10;
        imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + shift));
        imageData.data[i+1] = Math.min(255, Math.max(0, imageData.data[i+1] + shift));
        imageData.data[i+2] = Math.min(255, Math.max(0, imageData.data[i+2] + shift));
      }
      console.log('🎨 Canvas Noise injiziert');
      return imageData;
    };
    console.log('✅ Canvas Protection (Modus:', privacyMode + ')');
  } else {
    console.log('⚪ Canvas Protection deaktiviert');
  }
  
  // ========== WebGL Fingerprinting ==========
  if (isProtectionActive('webgl')) {
    const getParam = WebGLRenderingContext.prototype.getParameter;
    
    const fakeVendor = privacyMode === 'stealth' ? 'Generic Inc.' : 'Intel Inc.';
    const fakeRenderer = privacyMode === 'stealth' ? 'Generic Renderer' : 'Intel(R) HD Graphics 630';
    
    WebGLRenderingContext.prototype.getParameter = function(param) {
      if (param === 37445) {
        console.log('🎮 WebGL Vendor →', fakeVendor);
        return fakeVendor;
      }
      if (param === 37446) {
        console.log('🎮 WebGL Renderer →', fakeRenderer);
        return fakeRenderer;
      }
      return getParam.apply(this, arguments);
    };
    
    // Auch für WebGL2
    if (window.WebGL2RenderingContext) {
      const getParam2 = WebGL2RenderingContext.prototype.getParameter;
      WebGL2RenderingContext.prototype.getParameter = function(param) {
        if (param === 37445) return fakeVendor;
        if (param === 37446) return fakeRenderer;
        return getParam2.apply(this, arguments);
      };
    }
    console.log('✅ WebGL Protection:', fakeRenderer);
  } else {
    console.log('⚪ WebGL Protection deaktiviert');
  }
  
  // ========== Geolocation Faker ==========
  if (isProtectionActive('geolocation')) {
    const origGetPosition = navigator.geolocation.getCurrentPosition;
    const origWatchPosition = navigator.geolocation.watchPosition;
    
    navigator.geolocation.getCurrentPosition = function(success, error, options) {
      console.log('📍 Geolocation abgefragt → Berlin gesendet');
      if (success) {
        setTimeout(() => {
          success({
            coords: fakeCoords,
            timestamp: Date.now()
          });
        }, 100);
      }
    };
    
    navigator.geolocation.watchPosition = function(success, error, options) {
      console.log('📍 Geolocation Watch → Berlin');
      if (success) {
        success({
          coords: fakeCoords,
          timestamp: Date.now()
        });
      }
      return 1;
    };
    console.log('✅ Geolocation Protection (Berlin)');
  } else {
    console.log('⚪ Geolocation Protection deaktiviert');
  }
  
  // ========== Timezone Spoofing ==========
  if (isProtectionActive('timezone')) {
    const origGetTZOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = function() {
      console.log('⏰ getTimezoneOffset → 0 (UTC)');
      return 0;
    };
    
    // Intl.DateTimeFormat
    const OrigIntlDTF = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function(...args) {
      if (!args[1]) args[1] = {};
      args[1].timeZone = 'UTC';
      return new OrigIntlDTF(...args);
    };
    
    console.log('✅ Timezone Protection (UTC)');
  } else {
    console.log('⚪ Timezone Protection deaktiviert');
  }
  
  // ========== Hardware Faker ==========
  if (isProtectionActive('hardware')) {
    Object.defineProperties(window.screen, {
      width: { get: () => 1920, configurable: true },
      height: { get: () => 1080, configurable: true },
      availWidth: { get: () => 1920, configurable: true },
      availHeight: { get: () => 1040, configurable: true },
    });
    
    Object.defineProperties(navigator, {
      hardwareConcurrency: { get: () => privacyMode === 'stealth' ? 4 : 8, configurable: true },
      deviceMemory: { get: () => 8, configurable: true },
    });
    console.log('✅ Hardware Protection');
  } else {
    console.log('⚪ Hardware Protection deaktiviert');
  }
  
  // ========== Battery blockieren ==========
  if (navigator.getBattery) {
    navigator.getBattery = () => Promise.reject('Not supported');
  }
  
  // ========== STEALTH-EXCLUSIVE FEATURES ==========
  if (isStealth()) {
    console.log('🥷 STEALTH-MODUS - Aktiviere aggressive Features...');
    
    // 1. COOKIE-BLOCKING
    const origCookieGetter = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie').get;
    const origCookieSetter = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie').set;
    
    Object.defineProperty(document, 'cookie', {
      get: function() {
        console.log('🍪 Cookie-Zugriff BLOCKIERT (Stealth)');
        return ''; // Leerer String = keine Cookies
      },
      set: function(value) {
        console.log('🍪 Cookie-Schreibversuch BLOCKIERT:', value.substring(0, 30) + '...');
        // Tue nichts - Cookie wird nicht gesetzt!
      },
      configurable: true
    });
    console.log('✅ Cookie-Blocking aktiv');
    
    // 2. LocalStorage & SessionStorage blockieren
    const emptyStorage = {
      length: 0,
      getItem: () => null,
      setItem: (k, v) => { console.log('📦 Storage-Schreiben blockiert:', k); },
      removeItem: () => {},
      clear: () => {},
      key: () => null
    };
    
    Object.defineProperty(window, 'localStorage', {
      get: () => {
        console.log('📦 LocalStorage-Zugriff blockiert');
        return emptyStorage;
      }
    });
    
    Object.defineProperty(window, 'sessionStorage', {
      get: () => {
        console.log('📦 SessionStorage-Zugriff blockiert');
        return emptyStorage;
      }
    });
    console.log('✅ Storage-Blocking aktiv');
    
    // 3. DoNotTrack erzwingen
    Object.defineProperty(navigator, 'doNotTrack', {
      get: () => {
        console.log('🚫 DoNotTrack → 1 (aktiviert)');
        return '1';
      }
    });
    console.log('✅ DoNotTrack erzwungen');
    
    // 4. Plugins verstecken
    Object.defineProperty(navigator, 'plugins', {
      get: () => {
        console.log('🔌 Plugins-Liste → leer');
        return [];
      }
    });
    
    Object.defineProperty(navigator, 'mimeTypes', {
      get: () => {
        console.log('📄 MimeTypes-Liste → leer');
        return [];
      }
    });
    console.log('✅ Plugins versteckt');
    
    // 5. Screen auf häufigste Auflösung (1366x768)
    Object.defineProperties(window.screen, {
      width: { get: () => 1366, configurable: true },
      height: { get: () => 768, configurable: true },
      availWidth: { get: () => 1366, configurable: true },
      availHeight: { get: () => 728, configurable: true },
    });
    console.log('✅ Screen → 1366x768 (häufigste Auflösung)');
    
    // 6. Audio Context Fingerprinting blockieren
    if (window.AudioContext || window.webkitAudioContext) {
      const OrigAudioContext = window.AudioContext || window.webkitAudioContext;
      
      window.AudioContext = function() {
        console.log('🔊 AudioContext blockiert (Fingerprinting)');
        throw new Error('AudioContext not available');
      };
      window.webkitAudioContext = window.AudioContext;
      console.log('✅ Audio-Fingerprinting blockiert');
    }
    
    // 7. Fullscreen API blockieren (kann für Fingerprinting genutzt werden)
    document.requestFullscreen = () => {
      console.log('🖥️ Fullscreen blockiert');
      return Promise.reject('Not allowed');
    };
    document.exitFullscreen = () => Promise.resolve();
    console.log('✅ Fullscreen-API blockiert');
    
    // 8. Connection API faken
    if (navigator.connection) {
      Object.defineProperty(navigator, 'connection', {
        get: () => ({
          effectiveType: '4g',
          downlink: 10,
          rtt: 50,
          saveData: false
        })
      });
      console.log('✅ Connection-API gefälscht');
    }
    
    // 9. Sprache auf Englisch zwingen
    Object.defineProperty(navigator, 'language', {
      get: () => 'en-US',
      configurable: true
    });
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
      configurable: true
    });
    console.log('✅ Sprache → en-US (gezwungen)');
    
    console.log('🥷 STEALTH-MODUS KOMPLETT AKTIV - Maximal geschützt!');
  }
  
  // ========== BALANCED & STEALTH FEATURES ==========
  if (privacyMode === 'balanced' || privacyMode === 'stealth') {
    
    // Media Devices Fingerprinting blockieren
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      const origEnumerateDevices = navigator.mediaDevices.enumerateDevices;
      navigator.mediaDevices.enumerateDevices = async function() {
        console.log('🎤 Media Devices → leere Liste (Schutz)');
        // Gib nur generische Geräte zurück, keine echten IDs
        return [];
      };
      console.log('✅ Media-Devices-Fingerprinting blockiert');
    }
    
    // Clipboard-Zugriff blockieren
    if (navigator.clipboard) {
      const blockClipboard = () => {
        console.log('📋 Clipboard-Zugriff blockiert');
        return Promise.reject(new DOMException('Access denied', 'NotAllowedError'));
      };
      
      Object.defineProperty(navigator.clipboard, 'readText', {
        value: blockClipboard
      });
      Object.defineProperty(navigator.clipboard, 'read', {
        value: blockClipboard
      });
      console.log('✅ Clipboard-Zugriff blockiert');
    }
    
    // Keyboard/Mouse Timing Noise (verhindert Behavioral Fingerprinting)
    if (isStealth()) {
      const addTimingNoise = (originalFn) => {
        return function(...args) {
          // Füge 0-5ms zufällige Verzögerung hinzu
          const noise = Math.random() * 5;
          setTimeout(() => originalFn.apply(this, args), noise);
        };
      };
      
      // Wrappe Event-Listener mit Timing-Noise
      const origAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'keydown' || type === 'keyup' || type === 'mousemove' || type === 'click') {
          if (typeof listener === 'function') {
            listener = addTimingNoise(listener);
          }
        }
        return origAddEventListener.call(this, type, listener, options);
      };
      console.log('✅ Keyboard/Mouse-Timing-Noise aktiviert');
    }
    
    // Performance API teilweise blockieren (kann für Fingerprinting genutzt werden)
    if (isStealth() && window.performance) {
      const origGetEntries = performance.getEntries;
      performance.getEntries = function() {
        console.log('⏱️ Performance Entries → gefiltert');
        // Zeige nur eigene Domain, keine Cross-Origin-Daten
        const entries = origGetEntries.call(this);
        return entries.filter(entry => {
          try {
            const url = new URL(entry.name);
            return url.origin === window.location.origin;
          } catch {
            return true;
          }
        });
      };
      console.log('✅ Performance-API gefiltert');
    }
  }
  
  // ========== THIRD-PARTY COOKIE BLOCKER ==========
  const thirdPartyCookiesBlocked = scriptTag.dataset.thirdPartyCookies === 'true';
  
  if (thirdPartyCookiesBlocked) {
    console.log('🍪 Third-Party-Cookie-Blocker aktiviert');
    
    const currentDomain = window.location.hostname;
    const cookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    const originalCookieSetter = cookieDescriptor.set;
    
    // Prüfe ob Cookie third-party ist
    function isThirdPartyCookie(cookieString) {
      const parts = cookieString.split(';');
      let domain = null;
      
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.toLowerCase().startsWith('domain=')) {
          domain = trimmed.substring(7).trim();
          break;
        }
      }
      
      if (!domain) return false;
      if (domain.startsWith('.')) domain = domain.substring(1);
      
      if (currentDomain === domain) return false;
      if (currentDomain.endsWith('.' + domain)) return false;
      if (domain.endsWith('.' + currentDomain)) return false;
      
      return true;
    }
    
    // Überschreibe cookie setter
    Object.defineProperty(document, 'cookie', {
      get: cookieDescriptor.get,
      set: function(value) {
        if (isThirdPartyCookie(value)) {
          console.log('🚫 Third-Party-Cookie BLOCKIERT:', value.substring(0, 50) + '...');
          return;
        }
        originalCookieSetter.call(document, value);
      },
      configurable: true
    });
    
    console.log('✅ Third-Party-Cookie-Blocker aktiv für:', currentDomain);
  }
  
  console.log('🥷 Privacy Protection KOMPLETT AKTIV!');
})();


