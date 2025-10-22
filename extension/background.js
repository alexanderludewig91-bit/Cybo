// Cybo Security Companion - Background Service Worker
console.log('🛡️ Cybo Security Companion aktiviert');

// Global Keyboard Shortcuts
chrome.commands.onCommand.addListener((command) => {
  console.log('⌨️ Command empfangen:', command);
  
  if (command === 'open-dashboard') {
    chrome.windows.create({
      url: chrome.runtime.getURL('dashboard.html'),
      type: 'popup',
      width: 1200,
      height: 800
    });
  }
});

// Notification Button Clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  console.log('🔔 Notification Button geklickt:', notificationId, buttonIndex);
  
  if (buttonIndex === 0) {
    console.log('✅ User bestätigt: Notification sichtbar!');
  } else if (buttonIndex === 1) {
    console.log('❌ User bestätigt: Notification NICHT sichtbar!');
    // Zeige alternative Lösung
    chrome.tabs.create({
      url: 'chrome://settings/content/notifications'
    });
  }
  
  // Notification schließen
  chrome.notifications.clear(notificationId);
});

// Auto-HTTPS Settings
let httpsUpgradeEnabled = true;
let upgradeAttempts = new Map();

// Import Tracker-Database (inline wegen Service Worker Limitierungen)
// Tracker-Kategorien
const TRACKER_CATEGORIES = {
  ANALYTICS: 'analytics',
  ADVERTISING: 'advertising',
  SOCIAL: 'social',
  FINGERPRINTING: 'fingerprinting',
  CRYPTOMINING: 'cryptomining'
};

// Tracker-Domains (Top 100 - weitere im tracker-database.js)
const TRACKER_DOMAINS = {
  // Analytics
  'google-analytics.com': 'analytics',
  'googletagmanager.com': 'analytics',
  'googletagservices.com': 'analytics',
  'hotjar.com': 'analytics',
  'mixpanel.com': 'analytics',
  'segment.com': 'analytics',
  'segment.io': 'analytics',
  'analytics.google.com': 'analytics',
  'scorecardresearch.com': 'analytics',
  'chartbeat.com': 'analytics',
  'quantserve.com': 'analytics',
  
  // Advertising
  'doubleclick.net': 'advertising',
  'googlesyndication.com': 'advertising',
  'googleadservices.com': 'advertising',
  'securepubads.g.doubleclick.net': 'advertising',
  'pagead2.googlesyndication.com': 'advertising',
  'criteo.com': 'advertising',
  'criteo.net': 'advertising',
  'outbrain.com': 'advertising',
  'outbrain.org': 'advertising',
  'taboola.com': 'advertising',
  'amazon-adsystem.com': 'advertising',
  'adnxs.com': 'advertising',
  'adsrvr.org': 'advertising',
  'rubiconproject.com': 'advertising',
  'pubmatic.com': 'advertising',
  
  // Social
  'facebook.com/tr': 'social',
  'connect.facebook.net': 'social',
  'facebook.net': 'social',
  'twitter.com/i/': 'social',
  'platform.twitter.com': 'social',
  'linkedin.com/px': 'social',
  'snap.licdn.com': 'social',
  'pinterest.com/ct': 'social',
  
  // Fingerprinting
  'fingerprintjs.com': 'fingerprinting',
  'clientjs.org': 'fingerprinting',
  'bluecava.com': 'fingerprinting',
  
  // Cryptomining
  'coinhive.com': 'cryptomining',
  'coin-hive.com': 'cryptomining',
  'jsecoin.com': 'cryptomining'
};

// Ad-Blocker Funktionen (direkt hier, kein Import)
const AD_DOMAINS = [
  'googlesyndication.com',
  'googleadservices.com',
  'doubleclick.net',
  'google-analytics.com',
  'googletagmanager.com',
  'googletagservices.com',
  'facebook.com/tr',
  'connect.facebook.net',
  'amazon-adsystem.com',
  'taboola.com',
  'outbrain.com',
  'popads.net',
  'adnxs.com',
  'criteo.com',
  'advertising.com',
  'scorecardresearch.com',
];

function isAd(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const urlLower = url.toLowerCase();
    
    // Prüfe gegen bekannte Domains
    for (const adDomain of AD_DOMAINS) {
      if (hostname.includes(adDomain)) {
        return true;
      }
    }
    
    // Prüfe gegen Muster
    if (urlLower.includes('/ads/') || 
        urlLower.includes('/advert') || 
        urlLower.includes('/banner') ||
        urlLower.includes('adserver')) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

function getAdType(url) {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('google') || urlLower.includes('doubleclick')) {
    return 'Google Ads';
  }
  if (urlLower.includes('facebook')) {
    return 'Facebook Ads';
  }
  if (urlLower.includes('amazon')) {
    return 'Amazon Ads';
  }
  if (urlLower.includes('taboola') || urlLower.includes('outbrain')) {
    return 'Content Ads';
  }
  if (urlLower.includes('popup') || urlLower.includes('popads')) {
    return 'Popup Ads';
  }
  
  return 'Display Ads';
}

// Ad-Blocker Settings
let adBlockerEnabled = true;
let adBlockerWhitelist = new Set();
let adsBlockedCount = 0;
let adsBlockedThisSession = [];

// Dashboard Tabs (für Updates)
let dashboardTabs = new Set();

// Aktuelle Tab-Daten
let currentTabData = {
  tabId: null,
  url: null,
  requests: [],
  cookies: [],
  thirdParties: new Set(),
  permissions: [],
  trackers: [],
  adsBlocked: [],
  adsBlockedCount: 0,
  trackersBlocked: [],
  trackersBlockedCount: 0,
  trackersByCategory: {}
};

// Speichere die letzte "echte" Website (nicht localhost)
let lastRealWebsiteData = null;

// Privacy Settings
let privacyMode = 'balanced'; // normal, balanced, stealth

// Notification Settings
let notificationsEnabled = true;
let lastNotificationTime = 0;
const NOTIFICATION_COOLDOWN = 10000; // 10 Sekunden zwischen Notifications

// Lade Ad-Blocker & Privacy Settings aus Storage
chrome.storage.local.get(['adBlockerEnabled', 'adBlockerWhitelist', 'adsBlockedTotal', 'privacyMode', 'notificationsEnabled', 'httpsUpgradeEnabled'], (result) => {
  if (result.adBlockerEnabled !== undefined) {
    adBlockerEnabled = result.adBlockerEnabled;
  }
  if (result.adBlockerWhitelist) {
    adBlockerWhitelist = new Set(result.adBlockerWhitelist);
  }
  if (result.adsBlockedTotal) {
    adsBlockedCount = result.adsBlockedTotal;
  }
  if (result.privacyMode) {
    privacyMode = result.privacyMode;
  }
  if (result.notificationsEnabled !== undefined) {
    notificationsEnabled = result.notificationsEnabled;
  }
  if (result.httpsUpgradeEnabled !== undefined) {
    httpsUpgradeEnabled = result.httpsUpgradeEnabled;
  }
  console.log('🛡️ Ad-Blocker Status:', adBlockerEnabled ? 'Aktiviert' : 'Deaktiviert');
  console.log('📊 Gesamt geblockt:', adsBlockedCount);
  console.log('🥷 Privacy Mode:', privacyMode);
  console.log('🔔 Benachrichtigungen:', notificationsEnabled ? 'Aktiviert' : 'Deaktiviert');
  console.log('🔒 Auto-HTTPS:', httpsUpgradeEnabled ? 'Aktiviert' : 'Deaktiviert');
  
  // Aktiviere/Deaktiviere declarativeNetRequest rules
  updateAdBlockerRules();
  updatePrivacyRules();
});

// Privacy-Mode Listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.privacyMode) {
    privacyMode = changes.privacyMode.newValue;
    console.log('🔄 Privacy Mode geändert:', privacyMode);
    updatePrivacyRules();
  }
});

// ========== PRIVACY PROTECTION ==========

// Tracking-Parameter die entfernt werden sollen
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'msclkid', 'mc_eid',
  'ref', 'referrer', '_hsenc', '_hsmi',
  'mkt_tok', 'campaign_id', 'ad_id',
  'igshid', 'ncid', 'sr_share'
];

// Säubere URL von Tracking-Parametern
function cleanTrackingUrl(url) {
  try {
    const urlObj = new URL(url);
    let cleaned = false;
    
    TRACKING_PARAMS.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.delete(param);
        cleaned = true;
      }
    });
    
    if (cleaned) {
      console.log('🧹 URL gesäubert:', url, '→', urlObj.toString());
      return urlObj.toString();
    }
  } catch (e) {
    // Ungültige URL, ignoriere
  }
  return url;
}

// Update Privacy-Protection Rules basierend auf Modus
async function updatePrivacyRules() {
  const dynamicRules = [];
  let ruleId = 2000; // Start ID für dynamische Rules
  
  if (privacyMode === 'balanced' || privacyMode === 'stealth') {
    // Regel 1: Accept-Language auf en-US setzen
    dynamicRules.push({
      id: ruleId++,
      priority: 2,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          {
            header: "Accept-Language",
            operation: "set",
            value: "en-US,en;q=0.9"
          }
        ]
      },
      condition: {
        resourceTypes: ["main_frame", "sub_frame"]
      }
    });
    
    // Regel 2: Referer minimieren (nur Origin)
    if (privacyMode === 'balanced') {
      dynamicRules.push({
        id: ruleId++,
        priority: 2,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            {
              header: "Referer",
              operation: "set",
              value: ""
            }
          ]
        },
        condition: {
          resourceTypes: ["script", "xmlhttprequest", "image"],
          excludedInitiatorDomains: ["localhost"]
        }
      });
    }
  }
  
  if (privacyMode === 'stealth') {
    // Regel 3: Referer KOMPLETT entfernen
    dynamicRules.push({
      id: ruleId++,
      priority: 3,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          {
            header: "Referer",
            operation: "remove"
          }
        ]
      },
      condition: {
        resourceTypes: ["main_frame", "sub_frame", "script", "xmlhttprequest"],
        excludedInitiatorDomains: ["localhost"]
      }
    });
    
    // Regel 4: ETag blockieren (verhindert Cache-Tracking)
    dynamicRules.push({
      id: ruleId++,
      priority: 2,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          {
            header: "ETag",
            operation: "remove"
          }
        ]
      },
      condition: {
        resourceTypes: ["main_frame", "sub_frame", "script", "xmlhttprequest"]
      }
    });
  }
  
  // Entferne alte dynamische Rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = existingRules.map(rule => rule.id);
  
  // Setze neue Rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds,
    addRules: dynamicRules
  });
  
  console.log(`🔒 Privacy Rules aktualisiert (${privacyMode}):`, dynamicRules.length, 'Rules');
}

// Sende Update an alle Dashboard-Tabs
function notifyDashboards() {
  dashboardTabs.forEach(tabId => {
    chrome.tabs.sendMessage(tabId, {
      type: 'WEBSITE_DATA_UPDATE',
      data: currentTabData
    }).catch(() => {
      // Tab existiert nicht mehr
      dashboardTabs.delete(tabId);
    });
  });
}

// Laden der Tracker-Database (wird von tracker-database.js bereitgestellt)
// Die erweiterte Datenbank wird später geladen

// Prüfe ob Domain ein Tracker ist (erweiterte Version)
function isKnownTracker(url) {
  try {
    const urlLower = url.toLowerCase();
    const hostname = new URL(url).hostname.toLowerCase();
    
    // Prüfe gegen bekannte Domains
    for (const [domain, category] of Object.entries(TRACKER_DOMAINS)) {
      const domainLower = domain.toLowerCase();
      if (hostname.includes(domainLower) || urlLower.includes(domainLower)) {
        return { isTracker: true, category, domain };
      }
    }
    
    // Prüfe gegen Patterns (mit Kategorie-Zuweisung)
    const patternCategories = [
      { pattern: /google-analytics\.com/i, category: 'analytics' },
      { pattern: /googletagmanager\.com/i, category: 'analytics' },
      { pattern: /doubleclick\.net/i, category: 'advertising' },
      { pattern: /securepubads/i, category: 'advertising' },
      { pattern: /googlesyndication/i, category: 'advertising' },
      { pattern: /outbrain/i, category: 'advertising' },
      { pattern: /taboola/i, category: 'advertising' },
      { pattern: /facebook\.com\/tr/i, category: 'social' },
      { pattern: /connect\.facebook/i, category: 'social' },
      { pattern: /\/analytics\.js/i, category: 'analytics' },
      { pattern: /\/ga\.js/i, category: 'analytics' },
      { pattern: /\/gtm\.js/i, category: 'analytics' },
      { pattern: /\/pixel\?/i, category: 'advertising' },
      { pattern: /\/tracking\?/i, category: 'analytics' },
      { pattern: /\/beacon\./i, category: 'analytics' },
    ];
    
    for (const item of patternCategories) {
      if (item.pattern.test(url)) {
        return { isTracker: true, category: item.category, pattern: item.pattern.source };
      }
    }
    
    return { isTracker: false };
  } catch (e) {
    return { isTracker: false };
  }
}

// Legacy function für Kompatibilität
function isTracker(url) {
  return isKnownTracker(url).isTracker;
}

// Prüfe ob URL ignoriert werden soll
function shouldIgnoreUrl(url) {
  if (!url) return true;
  
  // Ignoriere Chrome/Browser-interne Seiten
  if (url.startsWith('chrome://')) return true;
  if (url.startsWith('edge://')) return true;
  if (url.startsWith('about:')) return true;
  
  // Ignoriere localhost (das Cybo-Dashboard selbst!)
  if (url.includes('localhost')) return true;
  if (url.includes('127.0.0.1')) return true;
  
  // Ignoriere Cybo Extension-Seiten
  if (url.startsWith('chrome-extension://')) return true;
  
  return false;
}

// Tab-Wechsel überwachen
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (!shouldIgnoreUrl(tab.url)) {
    await handleTabChange(tab);
  }
});

// Tab-Update überwachen
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Auto-HTTPS Upgrade
  if (changeInfo.url && httpsUpgradeEnabled) {
    try {
      const urlObj = new URL(changeInfo.url);
      
      if (urlObj.protocol === 'http:' && 
          urlObj.hostname !== 'localhost' && 
          !urlObj.hostname.startsWith('127.') &&
          !urlObj.hostname.startsWith('192.168.')) {
        
        const attempts = upgradeAttempts.get(changeInfo.url) || 0;
        if (attempts < 2) {
          upgradeAttempts.set(changeInfo.url, attempts + 1);
          
          urlObj.protocol = 'https:';
          const httpsUrl = urlObj.toString();
          
          console.log('🔒 Auto-HTTPS Upgrade:', changeInfo.url, '→', httpsUrl);
          chrome.tabs.update(tabId, { url: httpsUrl });
          return;
        }
      }
    } catch (e) {
      // Ignore
    }
  }
  
  // URL-Säuberung bei Balanced/Stealth
  if (changeInfo.url && (privacyMode === 'balanced' || privacyMode === 'stealth')) {
    const cleanedUrl = cleanTrackingUrl(changeInfo.url);
    if (cleanedUrl !== changeInfo.url) {
      // URL hat Tracking-Parameter, leite um
      console.log('🧹 Leite zu gesäuberter URL um');
      chrome.tabs.update(tabId, { url: cleanedUrl });
      return; // Verhindere weitere Verarbeitung der alten URL
    }
  }
  
  if (changeInfo.status === 'loading' && !shouldIgnoreUrl(tab.url)) {
    await handleTabChange(tab);
  }
});

// Tab-Wechsel verarbeiten
async function handleTabChange(tab) {
  console.log('🌐 Neue Website:', tab.url);
  
  // Reset current data
  currentTabData = {
    tabId: tab.id,
    url: tab.url,
    title: tab.title,
    requests: [],
    cookies: [],
    thirdParties: new Set(),
    permissions: [],
    trackers: [],
    adsBlocked: [],
    adsBlockedCount: 0,
    trackersBlocked: [],
    trackersBlockedCount: 0,
    trackersByCategory: {},
    timestamp: new Date().toISOString(),
  };
  
  // Cookies für diese Domain abrufen
  try {
    const url = new URL(tab.url);
    const cookies = await chrome.cookies.getAll({ domain: url.hostname });
    currentTabData.cookies = cookies.map(c => ({
      name: c.name,
      domain: c.domain,
      secure: c.secure,
      httpOnly: c.httpOnly,
      sameSite: c.sameSite,
    }));
  } catch (error) {
    console.error('Cookie-Fehler:', error);
  }
  
  // Speichere als letzte "echte" Website (wichtig fürs Dashboard!)
  lastRealWebsiteData = { ...currentTabData };
  
  // An App senden
  sendWebsiteData();
}

// Website-Daten an Dashboards senden (nicht mehr WebSocket!)
function sendWebsiteData() {
  // Konvertiere Sets und Maps für Storage
  const dataToSend = {
    ...currentTabData,
    thirdParties: Array.from(currentTabData.thirdParties),
    trackersByCategory: currentTabData.trackersByCategory || {},
    adBlocker: {
      enabled: adBlockerEnabled,
      adsBlocked: currentTabData.adsBlocked,
      totalBlockedSession: adsBlockedCount,
    }
  };
  
  console.log('📤 Sende Website-Daten:');
  console.log('   Trackers gesamt:', dataToSend.trackers?.length || 0);
  console.log('   Kategorien:', Object.keys(dataToSend.trackersByCategory || {}).length);
  
  // Detail-Log
  if (dataToSend.trackersByCategory) {
    for (const [cat, items] of Object.entries(dataToSend.trackersByCategory)) {
      console.log(`   - ${cat}: ${items.length} Tracker`);
    }
  }
  
  // Speichere in Chrome Storage für Dashboard-Zugriff
  chrome.storage.local.set({ currentWebsiteData: dataToSend });
  
  // Notify offene Dashboard-Tabs
  notifyDashboards();
  
  // Benachrichtigung bei vielen Trackern
  checkAndNotify(currentTabData);
}

// Network Requests überwachen (nur Tracking, kein Blocking mehr)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Normale Request-Tracking
    if (details.tabId === currentTabData.tabId && details.type !== 'main_frame') {
      try {
        const requestUrl = new URL(details.url);
        const currentUrl = new URL(currentTabData.url);
        
        // Request speichern
        currentTabData.requests.push({
          url: details.url,
          type: details.type,
          method: details.method,
          timestamp: Date.now(),
        });
        
        // Third-Party erkennen
        if (requestUrl.hostname !== currentUrl.hostname) {
          currentTabData.thirdParties.add(requestUrl.hostname);
        }
        
        // Tracker erkennen (erweitert mit Kategorien)
        const trackerResult = isKnownTracker(details.url);
        if (trackerResult.isTracker) {
          const trackerInfo = {
            url: details.url,
            type: details.type,
            category: trackerResult.category,
            domain: trackerResult.domain || requestUrl.hostname,
            timestamp: Date.now(),
          };
          
          currentTabData.trackers.push(trackerInfo);
          
          // Kategorisiere
          const category = trackerResult.category || 'unknown';
          if (!currentTabData.trackersByCategory[category]) {
            currentTabData.trackersByCategory[category] = [];
          }
          currentTabData.trackersByCategory[category].push(trackerInfo);
          
          console.log(`🔍 Tracker erkannt: ${requestUrl.hostname} → ${category} (Total: ${currentTabData.trackers.length})`);
          
          // Update Dashboard nach jedem Tracker
          sendWebsiteData();
        }
        
        // Prüfe ob es ein Ad war (für Counter, wird von declarativeNetRequest geblockt)
        if (isAd(details.url)) {
          const adInfo = {
            url: details.url,
            type: getAdType(details.url),
            timestamp: Date.now(),
            domain: requestUrl.hostname,
          };
          
          currentTabData.adsBlocked.push(adInfo);
          currentTabData.adsBlockedCount++;
          adsBlockedCount++;
          adsBlockedThisSession.push(adInfo);
          
          updateBadge();
        }
        
        // Alle 500ms Update senden (Throttling)
        throttledUpdate();
      } catch (error) {
        // Ignore invalid URLs
      }
    }
  },
  { urls: ["<all_urls>"] }
);

// Ad-Blocker Rules updaten (declarativeNetRequest)
async function updateAdBlockerRules() {
  if (adBlockerEnabled) {
    // Aktiviere Ad-Blocking Rules
    try {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ["ads_ruleset"]
      });
      console.log('✅ Ad-Blocker Rules aktiviert');
    } catch (error) {
      console.error('Fehler beim Aktivieren der Rules:', error);
    }
  } else {
    // Deaktiviere Ad-Blocking Rules
    try {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ["ads_ruleset"]
      });
      console.log('❌ Ad-Blocker Rules deaktiviert');
    } catch (error) {
      console.error('Fehler beim Deaktivieren der Rules:', error);
    }
  }
}

// Throttled Update
let updateTimeout = null;
function throttledUpdate() {
  if (!updateTimeout) {
    updateTimeout = setTimeout(() => {
      sendWebsiteData();
      updateTimeout = null;
    }, 500);
  }
}

// Permission-Anfragen überwachen
chrome.permissions.onAdded.addListener((permissions) => {
  currentTabData.permissions.push({
    permissions: permissions.permissions,
    origins: permissions.origins,
    timestamp: Date.now(),
  });
  sendWebsiteData();
});

// Nachrichten von Content Script & Dashboard
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PERMISSION_REQUEST') {
    currentTabData.permissions.push({
      permission: message.permission,
      timestamp: Date.now(),
      granted: message.granted,
    });
    sendWebsiteData();
    sendResponse({ success: true });
    return true;
  }
  
  // Privacy Protection ist aktiv
  if (message.type === 'PRIVACY_PROTECTION_ACTIVE') {
    console.log('🥷 Privacy Protection aktiv:', message.mode, 'auf', message.url);
    sendResponse({ success: true });
    return true;
  }
  
  
  if (message.type === 'GET_CURRENT_DATA') {
    sendResponse({
      ...currentTabData,
      thirdParties: Array.from(currentTabData.thirdParties),
      adBlocker: {
        enabled: adBlockerEnabled,
        adsBlocked: currentTabData.adsBlocked,
        totalBlockedSession: adsBlockedCount,
      }
    });
    return true;
  }
  
  if (message.type === 'GET_LAST_REAL_WEBSITE') {
    sendResponse(lastRealWebsiteData || currentTabData);
    return true;
  }
  
  // Dashboard registriert sich
  if (message.type === 'DASHBOARD_READY') {
    if (message.tabId) {
      dashboardTabs.add(message.tabId);
      console.log('📊 Dashboard registriert, Tab:', message.tabId);
    }
    sendResponse({ success: true });
    return true;
  }
  
  // Ad-Blocker Toggle
  if (message.type === 'TOGGLE_ADBLOCKER') {
    adBlockerEnabled = !adBlockerEnabled;
    chrome.storage.local.set({ adBlockerEnabled });
    console.log('🛡️ Ad-Blocker:', adBlockerEnabled ? 'Aktiviert' : 'Deaktiviert');
    
    // Update declarativeNetRequest Rules
    updateAdBlockerRules();
    
    sendResponse({ enabled: adBlockerEnabled, totalBlocked: adsBlockedCount });
    
    // Update alle Dashboards
    notifyDashboards();
    return true;
  }
  
  // Ad-Blocker Status abfragen
  if (message.type === 'GET_ADBLOCKER_STATUS') {
    sendResponse({ 
      enabled: adBlockerEnabled, 
      totalBlocked: adsBlockedCount,
      whitelist: Array.from(adBlockerWhitelist)
    });
    return true;
  }
  
  // Whitelist Toggle
  if (message.type === 'TOGGLE_WHITELIST') {
    const domain = message.domain;
    if (adBlockerWhitelist.has(domain)) {
      adBlockerWhitelist.delete(domain);
    } else {
      adBlockerWhitelist.add(domain);
    }
    chrome.storage.local.set({ adBlockerWhitelist: Array.from(adBlockerWhitelist) });
    sendResponse({ whitelisted: adBlockerWhitelist.has(domain) });
    return true;
  }
  
  // Test Notification
  if (message.type === 'TEST_NOTIFICATION') {
    console.log('🔔 Test-Notification angefordert');
    
    try {
      // Prüfe ob Notifications erlaubt sind
      chrome.notifications.getPermissionLevel((level) => {
        console.log('🔔 Notification Permission Level:', level);
        
        if (level === 'granted') {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: '🛡️ CYBO TEST - SICHTBAR?',
            message: 'Falls du das siehst, funktionieren Benachrichtigungen! ✅',
            priority: 2,
            requireInteraction: true,  // Bleibt bis man draufklickt
            silent: false,             // Macht Sound
            buttons: [
              { title: '✅ Funktioniert!' },
              { title: '❌ Nicht sichtbar' }
            ]
          }, (notificationId) => {
            console.log('🔔 Notification erstellt:', notificationId);
            
            // Zusätzlich: Browser-Tab fokussieren falls möglich
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
              if (tabs[0]) {
                chrome.tabs.update(tabs[0].id, {highlighted: true});
              }
            });
            
            sendResponse({ success: true, notificationId });
          });
        } else {
          console.log('❌ Notifications nicht erlaubt:', level);
          sendResponse({ success: false, error: 'Notifications nicht erlaubt' });
        }
      });
    } catch (error) {
      console.error('❌ Notification-Fehler:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
  
  // Add to Whitelist
  if (message.type === 'ADD_TO_WHITELIST') {
    const domain = message.domain;
    adBlockerWhitelist.add(domain);
    chrome.storage.local.set({ 
      adBlockerWhitelist: Array.from(adBlockerWhitelist) 
    });
    console.log('➕ Whitelist aktualisiert:', domain);
    sendResponse({ success: true });
    return true;
  }
  
  // Delete Cookies
  if (message.type === 'DELETE_COOKIES') {
    const url = message.url;
    try {
      const urlObj = new URL(url);
      chrome.cookies.getAll({ domain: urlObj.hostname }, (cookies) => {
        let deleted = 0;
        cookies.forEach(cookie => {
          const protocol = url.startsWith('https') ? 'https:' : 'http:';
          chrome.cookies.remove({
            url: `${protocol}//${cookie.domain}${cookie.path}`,
            name: cookie.name
          });
          deleted++;
        });
        console.log('🗑️ Cookies gelöscht:', deleted);
        sendResponse({ success: true, deleted });
      });
      return true; // Async response
    } catch (e) {
      sendResponse({ success: false, error: e.message });
      return true;
    }
  }
  
  return false;
});

// Speichere geblockte Ads regelmäßig
setInterval(() => {
  chrome.storage.local.set({ adsBlockedTotal: adsBlockedCount });
}, 5000);

// Badge mit Ads/Tracker-Anzahl aktualisieren
async function updateBadge() {
  if (currentTabData.tabId) {
    try {
      // Prüfe ob Tab noch existiert
      await chrome.tabs.get(currentTabData.tabId);
      
      // Zeige geblockte Ads, fallback auf Tracker
      const count = currentTabData.adsBlockedCount || currentTabData.trackers.length;
      const color = currentTabData.adsBlockedCount > 0 ? '#10b981' : '#f59e0b'; // Grün für Ads, Orange für Tracker
      
      chrome.action.setBadgeText({
        tabId: currentTabData.tabId,
        text: count > 0 ? count.toString() : ''
      });
      chrome.action.setBadgeBackgroundColor({
        tabId: currentTabData.tabId,
        color: color
      });
    } catch (error) {
      // Tab existiert nicht mehr - ignoriere den Fehler
      // (Tab wurde geschlossen)
    }
  }
}

// Prüfe und sende Benachrichtigung
function checkAndNotify(data) {
  if (!notificationsEnabled) return;
  
  const now = Date.now();
  if (now - lastNotificationTime < NOTIFICATION_COOLDOWN) return;
  
  const trackersCount = data.trackers?.length || 0;
  const adsCount = data.adsBlockedCount || 0;
  
  // Benachrichtigung bei vielen Trackern (>10)
  if (trackersCount > 10) {
    lastNotificationTime = now;
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: '🛡️ Cybo: Hohe Tracker-Aktivität!',
      message: `${trackersCount} Tracker auf dieser Seite erkannt. Cybo schützt dich!`,
      priority: 1
    });
  }
  
  // Benachrichtigung bei vielen Ads (>20)
  else if (adsCount > 20) {
    lastNotificationTime = now;
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: '🚫 Cybo: Viele Werbung blockiert!',
      message: `${adsCount} Werbeanzeigen auf dieser Seite blockiert.`,
      priority: 1
    });
  }
}

// Badge regelmäßig aktualisieren
setInterval(updateBadge, 1000);

