// Cybo Privacy Injector - Injiziert Privacy-Script in Page-Context
console.log('🥷 Privacy Injector lädt...');

// Lade Settings und injiziere dann
chrome.storage.local.get(['privacyMode', 'fakeLocation', 'customPrivacySettings'], (result) => {
  const mode = result.privacyMode || 'balanced';
  const fakeLocation = result.fakeLocation || {
    latitude: 52.5200,
    longitude: 13.4050,
    accuracy: 100
  };
  
  // Prüfe ob Third-Party-Cookie-Blocking aktiv ist
  const customSettings = result.customPrivacySettings || {};
  let thirdPartyBlocking = false;
  
  if (mode === 'custom') {
    thirdPartyBlocking = customSettings.thirdPartyCookies === 'on';
  } else if (mode === 'balanced' || mode === 'stealth') {
    thirdPartyBlocking = true;
  }
  
  console.log('🥷 Lade Privacy-Modus:', mode);
  console.log('🍪 Third-Party-Cookies:', thirdPartyBlocking ? 'Blockiert' : 'Erlaubt');
  
  // Injiziere externe Script-Datei (umgeht CSP!)
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  script.dataset.mode = mode; // Übergebe Mode
  script.dataset.fakeLocation = JSON.stringify(fakeLocation);
  script.dataset.thirdPartyCookies = thirdPartyBlocking;
  script.onload = function() {
    console.log('✅ Privacy Script geladen (Modus:', mode + ')');
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
});

// ALTE VERSION - funktioniert nicht wegen CSP:
/*
chrome.storage.local.get(['privacyMode', 'fakeLocation'], (result) => {
  const mode = result.privacyMode || 'balanced';
  const fakeLocation = result.fakeLocation || {
    latitude: 52.5200,
    longitude: 13.4050,
    accuracy: 100
  };
  
  const script = document.createElement('script');
  script.textContent = `
(function() {
  'use strict';
  console.log('🥷 Cybo Privacy Protection injiziert - Modus: ${mode}');
  
  const privacyMode = '${mode}';
  const fakeCoords = ${JSON.stringify(fakeLocation)};
  
  // ========== WebRTC IP-Leak Schutz ==========
  (function() {
    const OriginalRTC = window.RTCPeerConnection || window.webkitRTCPeerConnection;
    if (!OriginalRTC) return;
    
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
  })();
  
  // ========== Canvas Fingerprinting ==========
  (function() {
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    const toBlob = HTMLCanvasElement.prototype.toBlob;
    const getImageData = CanvasRenderingContext2D.prototype.getImageData;
    
    HTMLCanvasElement.prototype.toDataURL = function() {
      console.log('🎨 Canvas toDataURL - Noise injiziert');
      return toDataURL.apply(this, arguments);
    };
    
    CanvasRenderingContext2D.prototype.getImageData = function() {
      const imageData = getImageData.apply(this, arguments);
      const noise = privacyMode === 'stealth' ? 0.1 : 0.05;
      
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (Math.random() < noise) {
          const shift = Math.floor(Math.random() * 10) - 5;
          imageData.data[i] += shift;
          imageData.data[i+1] += shift;
          imageData.data[i+2] += shift;
        }
      }
      return imageData;
    };
    console.log('✅ Canvas Protection');
  })();
  
  // ========== WebGL Fingerprinting ==========
  (function() {
    const getParam = WebGLRenderingContext.prototype.getParameter;
    const getParam2 = WebGL2RenderingContext.prototype.getParameter;
    
    const fakeVendor = privacyMode === 'stealth' ? 'Generic' : 'Intel Inc.';
    const fakeRenderer = privacyMode === 'stealth' ? 'Generic Renderer' : 'Intel(R) HD Graphics 630';
    
    WebGLRenderingContext.prototype.getParameter = function(param) {
      if (param === 37445) { // VENDOR
        console.log('🎮 WebGL Vendor gefälscht');
        return fakeVendor;
      }
      if (param === 37446) { // RENDERER
        console.log('🎮 WebGL Renderer gefälscht');
        return fakeRenderer;
      }
      return getParam.apply(this, arguments);
    };
    
    WebGL2RenderingContext.prototype.getParameter = function(param) {
      if (param === 37445) return fakeVendor;
      if (param === 37446) return fakeRenderer;
      return getParam2.apply(this, arguments);
    };
    console.log('✅ WebGL Protection');
  })();
  
  // ========== Geolocation Faker ==========
  (function() {
    const origGetCurrent = navigator.geolocation.getCurrentPosition;
    const origWatch = navigator.geolocation.watchPosition;
    
    navigator.geolocation.getCurrentPosition = function(success, error) {
      console.log('📍 Geolocation - Fake-Location gesendet');
      if (success && privacyMode !== 'normal') {
        setTimeout(() => {
          success({
            coords: fakeCoords,
            timestamp: Date.now()
          });
        }, 100);
      } else {
        origGetCurrent.apply(this, arguments);
      }
    };
    
    navigator.geolocation.watchPosition = function(success, error) {
      if (success && privacyMode !== 'normal') {
        success({
          coords: fakeCoords,
          timestamp: Date.now()
        });
        return 1;
      }
      return origWatch.apply(this, arguments);
    };
    console.log('✅ Geolocation Protection');
  })();
  
  // ========== Timezone Spoofing ==========
  (function() {
    const OrigDate = Date;
    const handler = {
      construct(target, args) {
        const date = new target(...args);
        const origGetTZ = date.getTimezoneOffset;
        
        date.getTimezoneOffset = function() {
          if (privacyMode !== 'normal') {
            return 0; // UTC
          }
          return origGetTZ.call(this);
        };
        
        return date;
      }
    };
    
    window.Date = new Proxy(Date, handler);
    window.Date.prototype = OrigDate.prototype;
    window.Date.now = OrigDate.now;
    window.Date.parse = OrigDate.parse;
    window.Date.UTC = OrigDate.UTC;
    
    // Intl auch überschreiben
    const OrigDTF = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function(...args) {
      if (privacyMode !== 'normal') {
        if (!args[1]) args[1] = {};
        args[1].timeZone = 'UTC';
      }
      return new OrigDTF(...args);
    };
    
    // resolvedOptions auch überschreiben
    const origResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
    Intl.DateTimeFormat.prototype.resolvedOptions = function() {
      const options = origResolvedOptions.call(this);
      if (privacyMode !== 'normal') {
        options.timeZone = 'UTC';
      }
      return options;
    };
    
    console.log('✅ Timezone Protection (UTC)');
  })();
  
  // ========== Hardware Faker ==========
  (function() {
    // Screen
    Object.defineProperties(window.screen, {
      width: { get: () => 1920 },
      height: { get: () => 1080 },
      availWidth: { get: () => 1920 },
      availHeight: { get: () => 1040 },
      colorDepth: { get: () => 24 },
      pixelDepth: { get: () => 24 }
    });
    
    // Navigator
    Object.defineProperties(navigator, {
      hardwareConcurrency: { get: () => privacyMode === 'stealth' ? 4 : 8 },
      deviceMemory: { get: () => 8 },
      platform: { get: () => 'Win32' },
      language: { get: () => 'en-US' },
      languages: { get: () => ['en-US', 'en'] }
    });
    
    console.log('✅ Hardware Protection');
  })();
  
  // ========== Battery API blockieren ==========
  if (navigator.getBattery) {
    navigator.getBattery = () => Promise.reject('Not supported');
  }
  
  console.log('🥷 Privacy Protection komplett aktiv!');
})();
`;
  
  (document.head || document.documentElement).prepend(script);
  script.remove();
  
  console.log('✅ Privacy Script injiziert');
});
*/

