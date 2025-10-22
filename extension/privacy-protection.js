// Cybo Privacy Protection - Anti-Fingerprinting
// Muss VOR allen anderen Scripts laufen!
console.log('🥷 Cybo Privacy Protection aktiviert');

// Lade Settings
let privacyMode = 'balanced'; // 'normal', 'balanced', 'stealth'
let privacySettings = {
  webrtc: true,
  canvas: true,
  webgl: true,
  geolocation: true,
  timezone: true,
  userAgent: false,
  hardware: true,
  fonts: true,
};

// Lade Settings aus Storage
chrome.storage.local.get(['privacyMode', 'privacySettings'], (result) => {
  if (result.privacyMode) {
    privacyMode = result.privacyMode;
  }
  if (result.privacySettings) {
    privacySettings = { ...privacySettings, ...result.privacySettings };
  }
  console.log('🥷 Privacy-Modus:', privacyMode);
});

// ====================
// 1. WebRTC IP-Leak Schutz
// ====================
if (privacySettings.webrtc) {
  // Überschreibe RTCPeerConnection
  const OriginalRTCPeerConnection = window.RTCPeerConnection || 
                                    window.webkitRTCPeerConnection || 
                                    window.mozRTCPeerConnection;
  
  if (OriginalRTCPeerConnection) {
    const FakeRTCPeerConnection = function(config, constraints) {
      // Entferne/Ändere ICE-Server um IP-Leak zu verhindern
      if (config && config.iceServers) {
        // Blockiere STUN-Server (die enthüllen deine IP)
        config.iceServers = config.iceServers.filter(server => {
          const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
          return !urls.some(url => url && url.includes('stun'));
        });
        
        console.log('🛡️ WebRTC: STUN-Server gefiltert (IP-Leak-Schutz)');
      }
      
      return new OriginalRTCPeerConnection(config, constraints);
    };
    
    FakeRTCPeerConnection.prototype = OriginalRTCPeerConnection.prototype;
    
    window.RTCPeerConnection = FakeRTCPeerConnection;
    window.webkitRTCPeerConnection = FakeRTCPeerConnection;
    window.mozRTCPeerConnection = FakeRTCPeerConnection;
    
    console.log('✅ WebRTC IP-Leak Protection aktiv');
  }
}

// ====================
// 2. Canvas Fingerprinting Schutz
// ====================
if (privacySettings.canvas) {
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  const originalToBlob = HTMLCanvasElement.prototype.toBlob;
  const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
  
  // Noise-Generator
  function addCanvasNoise(imageData) {
    if (privacyMode === 'normal') return imageData;
    
    const noiseLevel = privacyMode === 'stealth' ? 0.1 : 0.05; // Balanced = 0.05
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      // Zufälliges Noise zu RGB-Werten
      const noise = Math.random() < noiseLevel ? Math.floor(Math.random() * 10) - 5 : 0;
      imageData.data[i] += noise;     // R
      imageData.data[i + 1] += noise; // G
      imageData.data[i + 2] += noise; // B
      // Alpha bleibt unverändert
    }
    
    return imageData;
  }
  
  // Überschreibe toDataURL
  HTMLCanvasElement.prototype.toDataURL = function(...args) {
    console.log('🎨 Canvas Fingerprinting erkannt - Noise injiziert');
    return originalToDataURL.apply(this, args);
  };
  
  // Überschreibe getImageData
  CanvasRenderingContext2D.prototype.getImageData = function(...args) {
    const imageData = originalGetImageData.apply(this, args);
    return addCanvasNoise(imageData);
  };
  
  console.log('✅ Canvas Fingerprinting Protection aktiv');
}

// ====================
// 3. WebGL Fingerprinting Schutz
// ====================
if (privacySettings.webgl) {
  const getParameter = WebGLRenderingContext.prototype.getParameter;
  
  WebGLRenderingContext.prototype.getParameter = function(parameter) {
    // Fake GPU-Info
    if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
      console.log('🎮 WebGL Vendor abgefragt - gefälscht');
      return privacyMode === 'stealth' ? 'Generic' : 'Intel Inc.';
    }
    
    if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
      console.log('🎮 WebGL Renderer abgefragt - gefälscht');
      const fakeGPUs = [
        'Intel Iris OpenGL Engine',
        'Intel HD Graphics 630',
        'Mesa DRI Intel(R) HD Graphics',
      ];
      return privacyMode === 'stealth' 
        ? 'Generic Renderer' 
        : fakeGPUs[Math.floor(Math.random() * fakeGPUs.length)];
    }
    
    return getParameter.apply(this, arguments);
  };
  
  console.log('✅ WebGL Fingerprinting Protection aktiv');
}

// ====================
// 4. Geolocation Faker/Blocker
// ====================
if (privacySettings.geolocation) {
  const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
  const originalWatchPosition = navigator.geolocation.watchPosition;
  
  // Fake-Koordinaten (kann in Settings geändert werden)
  let fakeCoords = {
    latitude: 52.5200, // Berlin
    longitude: 13.4050,
    accuracy: 100,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  };
  
  // Lade gespeicherte Fake-Location
  chrome.storage.local.get(['fakeLocation'], (result) => {
    if (result.fakeLocation) {
      fakeCoords = result.fakeLocation;
    }
  });
  
  navigator.geolocation.getCurrentPosition = function(success, error, options) {
    console.log('📍 Geolocation abgefragt');
    
    if (privacyMode === 'normal') {
      // Normal mode - echte Location
      return originalGetCurrentPosition.apply(this, arguments);
    }
    
    // Balanced/Stealth - Fake Location
    console.log('📍 Fake-Location gesendet:', fakeCoords.latitude, fakeCoords.longitude);
    
    if (success) {
      success({
        coords: fakeCoords,
        timestamp: Date.now(),
      });
    }
  };
  
  navigator.geolocation.watchPosition = function(success, error, options) {
    console.log('📍 Geolocation Watch abgefragt - gefälscht');
    
    if (privacyMode === 'normal') {
      return originalWatchPosition.apply(this, arguments);
    }
    
    if (success) {
      success({
        coords: fakeCoords,
        timestamp: Date.now(),
      });
    }
    
    return 1; // Fake Watch-ID
  };
  
  console.log('✅ Geolocation Faker aktiv');
}

// ====================
// 5. Timezone Spoofing
// ====================
if (privacySettings.timezone) {
  // Überschreibe Date-Methoden
  const OriginalDate = Date;
  
  Date = function(...args) {
    const date = new OriginalDate(...args);
    
    // Fake timezone offset (UTC = 0)
    const originalGetTimezoneOffset = date.getTimezoneOffset;
    date.getTimezoneOffset = function() {
      if (privacyMode === 'stealth' || privacyMode === 'balanced') {
        return 0; // UTC
      }
      return originalGetTimezoneOffset.call(this);
    };
    
    return date;
  };
  
  Date.prototype = OriginalDate.prototype;
  Date.now = OriginalDate.now;
  Date.parse = OriginalDate.parse;
  Date.UTC = OriginalDate.UTC;
  
  // Intl.DateTimeFormat auch überschreiben
  const OriginalDateTimeFormat = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function(...args) {
    if (privacyMode === 'stealth' || privacyMode === 'balanced') {
      // Force UTC timezone
      if (args[1]) {
        args[1].timeZone = 'UTC';
      } else {
        args[1] = { timeZone: 'UTC' };
      }
    }
    return new OriginalDateTimeFormat(...args);
  };
  
  console.log('✅ Timezone Spoofing aktiv (UTC)');
}

// ====================
// 6. Hardware-Info Faker
// ====================
if (privacySettings.hardware) {
  // Fake Screen Resolution
  Object.defineProperty(window.screen, 'width', {
    get: () => {
      if (privacyMode === 'stealth') return 1920;
      if (privacyMode === 'balanced') return 1920;
      return window.screen.width;
    }
  });
  
  Object.defineProperty(window.screen, 'height', {
    get: () => {
      if (privacyMode === 'stealth') return 1080;
      if (privacyMode === 'balanced') return 1080;
      return window.screen.height;
    }
  });
  
  Object.defineProperty(window.screen, 'availWidth', {
    get: () => {
      if (privacyMode === 'stealth') return 1920;
      if (privacyMode === 'balanced') return 1920;
      return window.screen.availWidth;
    }
  });
  
  Object.defineProperty(window.screen, 'availHeight', {
    get: () => {
      if (privacyMode === 'stealth') return 1040;
      if (privacyMode === 'balanced') return 1040;
      return window.screen.availHeight;
    }
  });
  
  // Fake Hardware Concurrency (CPU Cores)
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    get: () => {
      if (privacyMode === 'stealth') return 4;
      if (privacyMode === 'balanced') return 8;
      return navigator.hardwareConcurrency;
    }
  });
  
  // Fake Device Memory
  Object.defineProperty(navigator, 'deviceMemory', {
    get: () => {
      if (privacyMode === 'stealth') return 8;
      if (privacyMode === 'balanced') return 8;
      return navigator.deviceMemory;
    }
  });
  
  console.log('✅ Hardware Info Faker aktiv');
}

// ====================
// 7. Font-Fingerprinting Schutz
// ====================
if (privacySettings.fonts) {
  // Überschreibe Font-Detection
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
  
  // Füge kleines Noise hinzu um Font-Detection zu erschweren
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    get: function() {
      const width = originalOffsetWidth.get.call(this);
      if (privacyMode === 'stealth' && Math.random() < 0.1) {
        return width + (Math.random() < 0.5 ? -1 : 1);
      }
      return width;
    }
  });
  
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    get: function() {
      const height = originalOffsetHeight.get.call(this);
      if (privacyMode === 'stealth' && Math.random() < 0.1) {
        return height + (Math.random() < 0.5 ? -1 : 1);
      }
      return height;
    }
  });
  
  console.log('✅ Font Fingerprinting Protection aktiv');
}

// ====================
// 8. Battery API blockieren
// ====================
if (navigator.getBattery) {
  navigator.getBattery = async function() {
    console.log('🔋 Battery API blockiert');
    throw new Error('Battery API nicht verfügbar');
  };
}

// ====================
// 9. Permissions API einschränken
// ====================
const originalQuery = navigator.permissions.query;
navigator.permissions.query = function(descriptor) {
  console.log('🔐 Permission Query:', descriptor.name);
  
  // Bei sensiblen Permissions immer "denied" zurückgeben
  if (privacyMode === 'stealth') {
    const sensitivePerms = ['geolocation', 'camera', 'microphone', 'notifications'];
    if (sensitivePerms.includes(descriptor.name)) {
      return Promise.resolve({ state: 'denied' });
    }
  }
  
  return originalQuery.apply(this, arguments);
};

// ====================
// 10. Navigator Properties faker
// ====================
if (privacyMode === 'stealth' || privacyMode === 'balanced') {
  // Fake Platform
  Object.defineProperty(navigator, 'platform', {
    get: () => {
      if (privacyMode === 'stealth') return 'Win32';
      return 'Win32'; // Balanced auch
    }
  });
  
  // Fake Language (generischer)
  Object.defineProperty(navigator, 'language', {
    get: () => {
      if (privacyMode === 'stealth') return 'en-US';
      return 'en-US'; // Balanced auch
    }
  });
  
  Object.defineProperty(navigator, 'languages', {
    get: () => {
      if (privacyMode === 'stealth') return ['en-US', 'en'];
      return ['en-US', 'en']; // Balanced auch
    }
  });
}

// ====================
// Benachrichtige Background Script
// ====================
chrome.runtime.sendMessage({
  type: 'PRIVACY_PROTECTION_ACTIVE',
  mode: privacyMode,
  url: window.location.href
}).catch(() => {});

// ====================
// Listen auf Settings-Updates
// ====================
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    if (changes.privacyMode) {
      console.log('🔄 Privacy-Modus geändert:', changes.privacyMode.newValue);
      // Seite neu laden für neue Settings
      if (confirm('Privacy-Modus wurde geändert. Seite neu laden?')) {
        window.location.reload();
      }
    }
  }
});

console.log('🥷 Privacy Protection vollständig geladen');
console.log('   Modus:', privacyMode);
console.log('   WebRTC:', privacySettings.webrtc ? 'AN' : 'AUS');
console.log('   Canvas:', privacySettings.canvas ? 'AN' : 'AUS');
console.log('   WebGL:', privacySettings.webgl ? 'AN' : 'AUS');
console.log('   Geolocation:', privacySettings.geolocation ? 'AN' : 'AUS');

