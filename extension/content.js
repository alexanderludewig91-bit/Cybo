// Cybo Security Companion - Content Script
console.log('🛡️ Cybo Content Script geladen für:', window.location.href);

// Überwache Geolocation-Anfragen
const originalGeolocation = navigator.geolocation.getCurrentPosition;
navigator.geolocation.getCurrentPosition = function(...args) {
  console.log('📍 Geolocation angefordert');
  chrome.runtime.sendMessage({
    type: 'PERMISSION_REQUEST',
    permission: 'geolocation',
    granted: true,
  }).catch(() => {}); // Fehler ignorieren falls Background-Script nicht antwortet
  return originalGeolocation.apply(this, args);
};

// Überwache Kamera/Mikrofon-Anfragen
const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
navigator.mediaDevices.getUserMedia = async function(constraints) {
  console.log('🎥 Media-Zugriff angefordert:', constraints);
  
  if (constraints.video) {
    chrome.runtime.sendMessage({
      type: 'PERMISSION_REQUEST',
      permission: 'camera',
      granted: true,
    }).catch(() => {}); // Fehler ignorieren
  }
  
  if (constraints.audio) {
    chrome.runtime.sendMessage({
      type: 'PERMISSION_REQUEST',
      permission: 'microphone',
      granted: true,
    }).catch(() => {}); // Fehler ignorieren
  }
  
  return originalGetUserMedia.apply(this, arguments);
};

// Überwache Notification-Anfragen
const originalRequestPermission = Notification.requestPermission;
Notification.requestPermission = async function() {
  const result = await originalRequestPermission.apply(this, arguments);
  console.log('🔔 Notification-Berechtigung angefordert:', result);
  
  chrome.runtime.sendMessage({
    type: 'PERMISSION_REQUEST',
    permission: 'notifications',
    granted: result === 'granted',
  }).catch(() => {}); // Fehler ignorieren
  
  return result;
};

// Überwache localStorage-Zugriffe (optional - kann viel sein)
let localStorageAccess = 0;
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  localStorageAccess++;
  return originalSetItem.apply(this, arguments);
};

// Sende periodisch Storage-Info
setInterval(() => {
  if (localStorageAccess > 0) {
    console.log(`📦 LocalStorage: ${localStorageAccess} Zugriffe`);
  }
}, 5000);

// DISABLED - wird jetzt von privacy-injector.js gemacht
// Injiziere zusätzliches Script für tiefere Überwachung
// const scriptElem = document.createElement('script');
// scriptElem.src = chrome.runtime.getURL('injected.js');
// (document.head || document.documentElement).appendChild(scriptElem);

// Page-Analyse: Meta-Tags, Scripts, etc.
function analyzePage() {
  const analysis = {
    meta: {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      keywords: document.querySelector('meta[name="keywords"]')?.content || '',
    },
    scripts: Array.from(document.querySelectorAll('script[src]')).map(s => s.src),
    iframes: Array.from(document.querySelectorAll('iframe')).map(i => i.src),
    forms: document.querySelectorAll('form').length,
    inputs: {
      password: document.querySelectorAll('input[type="password"]').length,
      email: document.querySelectorAll('input[type="email"]').length,
      tel: document.querySelectorAll('input[type="tel"]').length,
    }
  };
  
  return analysis;
}

// Wenn Seite geladen ist, Analyse senden
window.addEventListener('load', () => {
  const pageAnalysis = analyzePage();
  console.log('📄 Seiten-Analyse:', pageAnalysis);
  
  // Hier könnten wir die Analyse an background.js senden
  chrome.runtime.sendMessage({
    type: 'PAGE_ANALYSIS',
    analysis: pageAnalysis,
  }).catch(() => {}); // Fehler ignorieren falls Background-Script nicht antwortet
});

