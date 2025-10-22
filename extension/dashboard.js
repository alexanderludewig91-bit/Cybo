// Cybo Dashboard Script
console.log('🛡️ Cybo Dashboard geladen');

let currentWebsiteData = null;
let adBlockerEnabled = true;


// Update Dashboard mit Website-Daten
function updateDashboard(data) {
  console.log('🔄 updateDashboard aufgerufen');
  console.log('   URL:', data?.url);
  console.log('   Trackers:', data?.trackers?.length);
  console.log('   trackersByCategory:', data?.trackersByCategory);
  console.log('   Kategorien-Keys:', Object.keys(data?.trackersByCategory || {}));
  
  if (!data || !data.url) {
    showEmptyState();
    return;
  }

  hideEmptyState();
  currentWebsiteData = data;

  // Website Info
  const urlObj = new URL(data.url);
  document.getElementById('website-url').textContent = urlObj.hostname;
  document.getElementById('website-title').textContent = data.title || '';
  
  // Show Quick-Action Buttons
  document.getElementById('add-to-whitelist-btn').style.display = 'block';
  document.getElementById('delete-cookies-btn').style.display = 'block';
  
  // Security Score
  const score = calculateSecurityScore(data);
  updateSecurityScore(score);
  
  // HTTPS Status (kompakt)
  const hasHttps = data.url.startsWith('https://');
  const httpsStatus = document.getElementById('https-status');
  if (httpsStatus) {
    httpsStatus.textContent = hasHttps ? '🔒 HTTPS' : '⚠️ HTTP';
  }
  
  // Request Count
  const requestCount = document.getElementById('request-count');
  if (requestCount) {
    requestCount.textContent = `📡 ${data.requests?.length || 0} Requests`;
  }
  
  // Metrics
  document.getElementById('cookies-count').textContent = data.cookies?.length || 0;
  document.getElementById('trackers-count').textContent = data.trackers?.length || 0;
  document.getElementById('third-parties-count').textContent = data.thirdParties?.size || Array.from(data.thirdParties || []).length;
  document.getElementById('requests-count').textContent = data.requests?.length || 0;
  
  // Cookies Status
  const cookiesCount = data.cookies?.length || 0;
  document.getElementById('cookies-status').textContent = cookiesCount > 10 ? 'Viele Cookies' : 'Akzeptabel';
  
  // Trackers Status
  const trackersCount = data.trackers?.length || 0;
  document.getElementById('trackers-status').textContent = trackersCount > 0 ? 'Tracking aktiv' : 'Keine Tracker';
  
  // Ad-Blocker
  if (data.adBlocker) {
    adBlockerEnabled = data.adBlocker.enabled;
    updateAdBlockerUI(data.adBlocker);
  }
  
  // Details anzeigen wenn Daten vorhanden
  updateDetails(data);
  
  // Update Tracker Statistics Chart
  updateTrackerStats(data);
  
  // Timestamp
  document.getElementById('last-update').textContent = `Zuletzt: ${new Date().toLocaleTimeString('de-DE')}`;
  
  // KI-Analysis Card anzeigen
  document.getElementById('ai-analysis-card').style.display = 'block';
  
  // Prüfe gecachte Analyse
  checkCachedAnalysis(urlObj.hostname);
}

// Security Score berechnen
function calculateSecurityScore(data) {
  let score = 100;
  
  // HTTPS
  if (!data.url.startsWith('https://')) {
    score -= 25;
  }
  
  // Tracker
  score -= Math.min((data.trackers?.length || 0) * 5, 30);
  
  // Cookies
  score -= Math.min((data.cookies?.length || 0) * 2, 20);
  
  // Third-Parties
  const thirdParties = data.thirdParties?.size || Array.from(data.thirdParties || []).length;
  score -= Math.min(thirdParties * 3, 25);
  
  return Math.max(0, Math.min(100, score));
}

// Security Score visuell updaten (kompakte Version)
function updateSecurityScore(score) {
  const ring = document.getElementById('score-ring');
  const number = document.getElementById('score-number');
  
  if (!ring || !number) return;
  
  number.textContent = score;
  
  // Farbe basierend auf Score
  let color;
  if (score >= 80) color = '#10b981'; // Grün
  else if (score >= 60) color = '#f59e0b'; // Orange
  else if (score >= 40) color = '#fb923c'; // Orange
  else color = '#ef4444'; // Rot
  
  // Update Ring-Farbe
  ring.style.borderColor = color;
  number.style.color = color;
}

// Ad-Blocker UI updaten (kompakt)
function updateAdBlockerUI(adBlocker) {
  const card = document.getElementById('adblocker-card');
  const btn = document.getElementById('adblocker-toggle');
  const icon = document.getElementById('adblocker-icon');
  
  if (!card || !btn || !icon) return;
  
  if (adBlocker.enabled) {
    card.classList.add('enabled');
    card.classList.remove('disabled');
    icon.textContent = '✓';
    btn.style.background = '#10b981';
  } else {
    card.classList.add('disabled');
    card.classList.remove('enabled');
    icon.textContent = '✗';
    btn.style.background = '#64748b';
  }
  
  // Stats
  const pageStat = document.getElementById('ads-blocked-page');
  const sessionStat = document.getElementById('ads-blocked-session');
  
  if (pageStat) pageStat.textContent = adBlocker.adsBlocked?.length || 0;
  if (sessionStat) sessionStat.textContent = adBlocker.totalBlockedSession || 0;
}

// Details Section updaten
function updateDetails(data) {
  const section = document.getElementById('details-section');
  
  // Blocked Ads
  if (data.adBlocker && data.adBlocker.adsBlocked && data.adBlocker.adsBlocked.length > 0) {
    const list = document.getElementById('blocked-ads-list');
    list.innerHTML = data.adBlocker.adsBlocked.slice(0, 10).map(ad => `
      <div class="list-item">
        <span class="list-dot success"></span>
        <span class="list-text">${ad.domain || new URL(ad.url).hostname}</span>
        <span class="list-badge">${ad.type}</span>
      </div>
    `).join('');
    
    if (data.adBlocker.adsBlocked.length > 10) {
      list.innerHTML += `<div class="text-muted" style="text-align: center; padding: 8px;">+${data.adBlocker.adsBlocked.length - 10} weitere...</div>`;
    }
    
    document.getElementById('blocked-ads-card').style.display = 'block';
    section.style.display = 'grid';
  } else {
    document.getElementById('blocked-ads-card').style.display = 'none';
  }
  
  // Trackers
  if (data.trackers && data.trackers.length > 0) {
    const list = document.getElementById('trackers-list');
    list.innerHTML = data.trackers.slice(0, 10).map(tracker => `
      <div class="list-item">
        <span class="list-dot danger"></span>
        <span class="list-text">${new URL(tracker.url).hostname}</span>
      </div>
    `).join('');
    
    if (data.trackers.length > 10) {
      list.innerHTML += `<div class="text-muted" style="text-align: center; padding: 8px;">+${data.trackers.length - 10} weitere...</div>`;
    }
    
    document.getElementById('trackers-card').style.display = 'block';
    section.style.display = 'grid';
  } else {
    document.getElementById('trackers-card').style.display = 'none';
  }
  
  // Third-Parties
  const thirdParties = Array.from(data.thirdParties || []);
  if (thirdParties.length > 0) {
    const list = document.getElementById('third-parties-list');
    list.innerHTML = thirdParties.slice(0, 10).map(party => `
      <div class="list-item">
        <span class="list-dot info"></span>
        <span class="list-text">${party}</span>
      </div>
    `).join('');
    
    if (thirdParties.length > 10) {
      list.innerHTML += `<div class="text-muted" style="text-align: center; padding: 8px;">+${thirdParties.length - 10} weitere...</div>`;
    }
    
    document.getElementById('third-parties-card').style.display = 'block';
    section.style.display = 'grid';
  } else {
    document.getElementById('third-parties-card').style.display = 'none';
  }
}

// Empty State
function showEmptyState() {
  const emptyState = document.getElementById('empty-state');
  const overviewGrid = document.querySelector('.overview-grid');
  const metricsCompact = document.querySelector('.metrics-compact');
  const detailsSection = document.getElementById('details-section');
  const aiCard = document.getElementById('ai-analysis-card');
  
  if (emptyState) emptyState.style.display = 'block';
  if (overviewGrid) overviewGrid.style.display = 'none';
  if (metricsCompact) metricsCompact.style.display = 'none';
  if (detailsSection) detailsSection.style.display = 'none';
  if (aiCard) aiCard.style.display = 'none';
}

function hideEmptyState() {
  const emptyState = document.getElementById('empty-state');
  const overviewGrid = document.querySelector('.overview-grid');
  const metricsCompact = document.querySelector('.metrics-compact');
  
  if (emptyState) emptyState.style.display = 'none';
  if (overviewGrid) overviewGrid.style.display = 'grid';
  if (metricsCompact) metricsCompact.style.display = 'grid';
}

// Gecachte KI-Analyse prüfen
async function checkCachedAnalysis(domain) {
  try {
    const result = await chrome.storage.local.get([`ai_analysis_${domain}`]);
    const cached = result[`ai_analysis_${domain}`];
    
    if (cached && cached.analysis) {
      showAiAnalysis(cached.analysis, true, cached.timestamp);
    } else {
      showAiAnalysisButton();
    }
  } catch (error) {
    console.error('Fehler beim Laden gecachter Analyse:', error);
    showAiAnalysisButton();
  }
}

// KI-Analyse anzeigen
function showAiAnalysis(analysis, fromCache, timestamp) {
  const content = document.getElementById('ai-content');
  const subtitle = document.getElementById('ai-subtitle');
  const btn = document.getElementById('analyze-btn');
  
  content.innerHTML = `<p>${analysis}</p>`;
  
  if (fromCache) {
    const time = formatTimeSince(timestamp);
    subtitle.textContent = `Analysiert ${time}`;
    content.innerHTML += `<p class="text-muted" style="margin-top: 8px; font-size: 12px;">✓ Aus Cache - spart API-Kosten</p>`;
    btn.innerHTML = '<span class="btn-icon">🔄</span>Neu analysieren';
  } else {
    subtitle.textContent = 'Gerade analysiert';
    btn.innerHTML = '<span class="btn-icon">🔄</span>Neu analysieren';
  }
  
  document.getElementById('ai-loading').style.display = 'none';
}

// KI-Analyse Button anzeigen
function showAiAnalysisButton() {
  const content = document.getElementById('ai-content');
  const subtitle = document.getElementById('ai-subtitle');
  const btn = document.getElementById('analyze-btn');
  
  content.innerHTML = '<p class="text-muted">Klicke auf "Mit KI analysieren" um eine detaillierte Bewertung zu erhalten.</p>';
  subtitle.textContent = 'Lasse die Website von KI bewerten';
  btn.innerHTML = '<span class="btn-icon">🛡️</span>Mit KI analysieren';
  
  document.getElementById('ai-loading').style.display = 'none';
}

// Zeit-Formatierung
function formatTimeSince(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'gerade eben';
  if (minutes < 60) return `vor ${minutes} Min.`;
  if (hours < 24) return `vor ${hours} Std.`;
  return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
}

// Kommunikation mit Background Script
async function getCurrentData() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_CURRENT_DATA' });
    if (response) {
      updateDashboard(response);
    }
  } catch (error) {
    console.error('Fehler beim Laden:', error);
  }
}

// Event Listeners
document.getElementById('adblocker-toggle').addEventListener('click', async () => {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'TOGGLE_ADBLOCKER' });
    adBlockerEnabled = response.enabled;
    
    // Lade Daten neu um UI zu aktualisieren
    getCurrentData();
  } catch (error) {
    console.error('Fehler beim Toggle:', error);
  }
});

document.getElementById('analyze-btn').addEventListener('click', async () => {
  if (!currentWebsiteData) return;
  
  const btn = document.getElementById('analyze-btn');
  const loading = document.getElementById('ai-loading');
  const content = document.getElementById('ai-content');
  
  // Zeige Loading
  loading.style.display = 'flex';
  content.style.display = 'none';
  btn.disabled = true;
  
  try {
    // Hole API Key aus Storage
    const { openaiApiKey } = await chrome.storage.local.get(['openaiApiKey']);
    
    if (!openaiApiKey) {
      // Fallback-Analyse ohne KI
      const analysis = generateFallbackAnalysis(currentWebsiteData);
      content.style.display = 'block';
      loading.style.display = 'none';
      content.innerHTML = `<p>${analysis}</p><p class="text-muted" style="margin-top: 8px; font-size: 12px;">ℹ️ Kein OpenAI API Key - Basis-Analyse</p>`;
      btn.disabled = false;
      
      // Speichere in Cache
      const domain = new URL(currentWebsiteData.url).hostname;
      await chrome.storage.local.set({
        [`ai_analysis_${domain}`]: {
          analysis: analysis,
          timestamp: Date.now()
        }
      });
      
      return;
    }
    
    // KI-Analyse mit OpenAI
    const analysis = await analyzeWithAI(currentWebsiteData, openaiApiKey);
    
    // Zeige Ergebnis
    content.style.display = 'block';
    loading.style.display = 'none';
    showAiAnalysis(analysis, false);
    
    // Speichere in Cache
    const domain = new URL(currentWebsiteData.url).hostname;
    await chrome.storage.local.set({
      [`ai_analysis_${domain}`]: {
        analysis: analysis,
        timestamp: Date.now()
      }
    });
    
  } catch (error) {
    console.error('Analyse-Fehler:', error);
    content.style.display = 'block';
    loading.style.display = 'none';
    content.innerHTML = '<p class="text-muted">Fehler bei der Analyse. Bitte versuche es später erneut.</p>';
  } finally {
    btn.disabled = false;
  }
});

// Fallback-Analyse ohne KI
function generateFallbackAnalysis(data) {
  const hasHttps = data.url.startsWith('https://');
  const trackersCount = data.trackers?.length || 0;
  const cookiesCount = data.cookies?.length || 0;

  let analysis = '';

  if (!hasHttps) {
    analysis = '⚠️ Diese Website nutzt keine HTTPS-Verschlüsselung. Deine Daten könnten mitgelesen werden. ';
  } else {
    analysis = '✅ Die Website ist HTTPS-verschlüsselt. ';
  }

  if (trackersCount > 5) {
    analysis += `⚠️ Es wurden ${trackersCount} Tracker erkannt, die dein Verhalten verfolgen. `;
  } else if (trackersCount > 0) {
    analysis += `${trackersCount} Tracker aktiv. `;
  } else {
    analysis += '✅ Keine Tracker erkannt. ';
  }

  if (cookiesCount > 20) {
    analysis += `Diese Seite setzt sehr viele Cookies (${cookiesCount}). `;
  }

  if (!hasHttps || trackersCount > 5) {
    analysis += 'Empfehlung: Vorsicht bei der Eingabe persönlicher Daten.';
  } else {
    analysis += 'Die Website erscheint grundsätzlich sicher.';
  }

  return analysis;
}

// KI-Analyse mit OpenAI
async function analyzeWithAI(data, apiKey) {
  const prompt = `Analysiere diese Website auf Sicherheit und Datenschutz:

URL: ${data.url}
Cookies: ${data.cookies?.length || 0}
Tracker: ${data.trackers?.length || 0}
Third-Parties: ${data.thirdParties?.size || 0}
HTTPS: ${data.url.startsWith('https://') ? 'Ja' : 'Nein'}

Gib eine kurze, prägnante Bewertung in 2-3 Sätzen auf Deutsch.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Du bist ein Cybersecurity-Experte.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
  });

  const result = await response.json();
  return result.choices[0].message.content;
}

// Refresh Button
document.getElementById('refresh-btn').addEventListener('click', () => {
  getCurrentData();
});

// Password-Check Button - als Popup-Fenster
document.getElementById('password-check-btn').addEventListener('click', () => {
  chrome.windows.create({
    url: chrome.runtime.getURL('password-check.html'),
    type: 'popup',
    width: 900,
    height: 800,
    left: 200,
    top: 100,
  });
});

// Settings Button - als Popup-Fenster
document.getElementById('settings-btn').addEventListener('click', () => {
  chrome.windows.create({
    url: chrome.runtime.getURL('settings.html'),
    type: 'popup',
    width: 800,
    height: 700,
    left: 250,
    top: 150,
  });
});

// Listen auf Messages vom Background Script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'WEBSITE_DATA_UPDATE') {
    updateDashboard(message.data);
  }
  return true;
});

// Privacy Mode Selector
document.getElementById('privacy-mode-select').addEventListener('change', async (e) => {
  const mode = e.target.value;
  
  // Wenn von Custom zu Preset gewechselt wird, optionale Warnung
  const previousMode = e.target.getAttribute('data-previous-mode');
  if (previousMode === 'custom' && mode !== 'custom') {
    console.log('ℹ️ Hinweis: Custom-Settings bleiben gespeichert und werden wiederhergestellt wenn Sie zu Custom zurückkehren');
  }
  
  // Speichere previous mode
  e.target.setAttribute('data-previous-mode', mode);
  
  await chrome.storage.local.set({ privacyMode: mode });
  
  // Update Info-Text
  updatePrivacyModeInfo(mode);
  
  // Update Feature-Status
  updatePrivacyFeatureStatus(mode);
  
  console.log('🔄 Privacy-Modus geändert:', mode);
  console.log('⚠️ Seiten müssen neu geladen werden für volle Wirkung!');
});

// Custom Settings Storage
let customSettings = {};

// Lade Custom Settings beim Start
chrome.storage.local.get(['customPrivacySettings', 'privacyMode'], (result) => {
  if (result.customPrivacySettings) {
    customSettings = result.customPrivacySettings;
    console.log('📋 Custom Settings geladen:', customSettings);
  }
  
  // Wenn Modus Custom ist, zeige Custom-Settings
  if (result.privacyMode === 'custom') {
    updatePrivacyFeatureStatus('custom');
  }
});

// Update Privacy Mode Info-Text
function updatePrivacyModeInfo(mode) {
  const info = document.getElementById('privacy-mode-info');
  if (mode === 'normal') {
    info.textContent = '👤 Normal: Kein Fingerprint-Schutz, alle Features funktionieren perfekt';
  } else if (mode === 'balanced') {
    info.textContent = '⚖️ Balanced: Fingerprinting-Schutz, URL-Säuberung, HTTP-Header gefälscht, Cookies erlaubt - Empfohlen!';
  } else if (mode === 'stealth') {
    info.textContent = '🥷 Stealth: MAXIMALER Schutz - Cookies/Storage blockiert, alle Header manipuliert, Timing-Noise, ETags blockiert - Websites können brechen!';
  } else if (mode === 'custom') {
    info.textContent = '🎨 Custom: Ihre persönliche Konfiguration - nur die Features die Sie wählen';
  }
}

// Feature-Level-Definitionen
const FEATURE_LEVELS = {
  webgl: ['off', 'medium', 'high'], // off, Intel HD 630, Generic
  canvas: ['off', 'medium', 'high'], // 0%, 10%, 20%
  geolocation: ['off', 'on'], // off, Berlin
  webrtc: ['off', 'on'], // off, filtered
  hardware: ['off', 'medium', 'high'], // echte Werte, 1920x1080/8c, 1366x768/4c
  urlTracking: ['off', 'on'], // off, cleaned
  referer: ['off', 'medium', 'high'], // full, minimized, removed
  language: ['off', 'medium', 'high'], // de-DE, en-US (HTTP), en-US (HTTP+JS)
  mediaDevices: ['off', 'on'], // echte IDs, leer
  clipboard: ['off', 'on'], // allowed, blocked
  timezone: ['off', 'on'], // echte TZ, UTC (JS)
  cookies: ['off', 'on'], // allowed, blocked
  storage: ['off', 'on'], // allowed, blocked
  audio: ['off', 'on'], // allowed, blocked
  doNotTrack: ['off', 'on'], // not set, set
  plugins: ['off', 'on'], // visible, hidden
  performance: ['off', 'on'], // all visible, filtered
  etag: ['off', 'on'], // allowed, blocked
  thirdPartyCookies: ['off', 'on'] // all allowed, 3rd party blocked
};

// Get current feature level (from mode or custom)
function getFeatureLevel(featureId, mode) {
  if (mode === 'custom' && customSettings[featureId] !== undefined) {
    return customSettings[featureId];
  }
  
  // Preset levels for each mode
  const presets = {
    normal: 'off',
    balanced: {
      webgl: 'medium',
      canvas: 'medium',
      geolocation: 'on',
      webrtc: 'on',
      hardware: 'medium',
      urlTracking: 'on',
      referer: 'medium',
      language: 'medium',
      mediaDevices: 'on',
      clipboard: 'on',
      timezone: 'on',
      cookies: 'off',
      storage: 'off',
      audio: 'off',
      doNotTrack: 'off',
      plugins: 'off',
      performance: 'off',
      etag: 'off',
      thirdPartyCookies: 'on'
    },
    stealth: {
      webgl: 'high',
      canvas: 'high',
      geolocation: 'on',
      webrtc: 'on',
      hardware: 'high',
      urlTracking: 'on',
      referer: 'high',
      language: 'high',
      mediaDevices: 'on',
      clipboard: 'on',
      timezone: 'on',
      cookies: 'on',
      storage: 'on',
      audio: 'on',
      doNotTrack: 'on',
      plugins: 'on',
      performance: 'on',
      etag: 'on',
      thirdPartyCookies: 'on'
    }
  };
  
  if (mode === 'normal') return 'off';
  return presets[mode]?.[featureId] || 'off';
}

// Update Privacy Feature Status Anzeige
function updatePrivacyFeatureStatus(mode) {
  const summary = document.getElementById('protection-summary');
  if (!summary) return;
  
  // Use features from dashboard-features.js
  const features = ALL_FEATURES;
  
  // Baue HTML
  summary.innerHTML = features.map((feature, index) => {
    const currentLevel = getFeatureLevel(feature.id, mode);
    const modeData = feature.levels[currentLevel];
    const statusClass = `status-${modeData.status}`;
    const statusIcon = modeData.status === 'active' ? '✓' : 
                       modeData.status === 'partial' ? '~' : '✗';
    
    // Baue Level-Buttons
    const availableLevels = FEATURE_LEVELS[feature.id];
    const levelButtonsHtml = availableLevels.map(level => {
      const levelData = feature.levels[level];
      const isActive = currentLevel === level;
      const levelClass = level === 'off' ? 'level-off' : 
                         level === 'medium' ? 'level-medium' : 
                         'level-high';
      return `<button class="level-btn ${isActive ? 'active ' + levelClass : ''}" 
                      data-feature="${feature.id}" 
                      data-level="${level}">
                ${levelData.label}
              </button>`;
    }).join('');
    
    return `
      <div class="protection-item" data-index="${index}">
        <div class="protection-header" data-toggle-index="${index}">
          <div class="protection-left">
            <span class="protection-icon">${feature.icon}</span>
            <div class="protection-info">
              <span class="protection-name">
                ${feature.name}
                <span class="protection-expand-icon" id="expand-icon-${index}">▼</span>
              </span>
              <span class="protection-detail">${modeData.detail}</span>
            </div>
          </div>
          <div class="protection-status ${statusClass}">
            ${statusIcon}
          </div>
        </div>
        <div class="protection-details" id="details-${index}">
          <div class="protection-description">
            <strong>Was ist das?</strong>
            ${feature.description}
          </div>
          <div class="protection-controls">
            <span class="protection-controls-label">Einstellung:</span>
            <div class="protection-level-buttons">
              ${levelButtonsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Event-Listener für alle Headers hinzufügen
  document.querySelectorAll('.protection-header').forEach(header => {
    header.addEventListener('click', function() {
      const index = this.getAttribute('data-toggle-index');
      toggleProtectionDetails(index);
    });
  });
  
  // Event-Listener für Level-Buttons
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // Verhindere Toggle beim Button-Click
      const featureId = this.getAttribute('data-feature');
      const level = this.getAttribute('data-level');
      setFeatureLevel(featureId, level);
    });
  });
}

// Toggle Protection Details (Accordion)
function toggleProtectionDetails(index) {
  const details = document.getElementById(`details-${index}`);
  const icon = document.getElementById(`expand-icon-${index}`);
  
  if (!details || !icon) return;
  
  const isExpanded = details.classList.contains('expanded');
  
  if (isExpanded) {
    details.classList.remove('expanded');
    icon.classList.remove('expanded');
  } else {
    details.classList.add('expanded');
    icon.classList.add('expanded');
  }
}

// Set Feature Level (Custom Mode)
function setFeatureLevel(featureId, level) {
  console.log(`🎨 Feature "${featureId}" auf "${level}" gesetzt`);
  
  // Speichere Custom-Setting
  customSettings[featureId] = level;
  
  // Speichere in Chrome Storage
  chrome.storage.local.set({ customPrivacySettings: customSettings }, () => {
    console.log('✅ Custom Settings gespeichert:', customSettings);
  });
  
  // Wechsle automatisch zu Custom-Modus
  const currentMode = document.getElementById('privacy-mode-select').value;
  if (currentMode !== 'custom') {
    console.log('🔄 Wechsle zu Custom-Modus...');
    document.getElementById('privacy-mode-select').value = 'custom';
    chrome.storage.local.set({ privacyMode: 'custom' });
  }
  
  // Update UI
  updatePrivacyModeInfo('custom');
  updatePrivacyFeatureStatus('custom');
  
  console.log('⚠️ Seite neu laden für volle Wirkung!');
}

// Update Tracker Statistics
function updateTrackerStats(data) {
  console.log('📊 updateTrackerStats aufgerufen:', {
    hasData: !!data,
    trackersByCategory: data?.trackersByCategory,
    trackersLength: data?.trackers?.length
  });
  
  const statsCard = document.getElementById('tracker-stats-card');
  
  // Zeige Chart immer (auch bei 0 Trackern)
  statsCard.style.display = 'block';
  
  // Reset counts
  document.getElementById('analytics-count').textContent = '0';
  document.getElementById('advertising-count').textContent = '0';
  document.getElementById('social-count').textContent = '0';
  document.getElementById('fingerprinting-count').textContent = '0';
  document.getElementById('cryptomining-count').textContent = '0';
  document.getElementById('unknown-count').textContent = '0';
  
  // Update counts mit Animation
  let totalTrackers = 0;
  
  if (data.trackersByCategory) {
    for (const [category, trackers] of Object.entries(data.trackersByCategory)) {
      const count = trackers.length;
      totalTrackers += count;
      const elementId = category + '-count';
      const element = document.getElementById(elementId);
      
      if (element) {
        // Animate count-up
        animateCounter(element, count);
        
        // Highlight if count > 0
        const statItem = element.closest('.stat-item');
        if (count > 0) {
          statItem.classList.add('has-trackers');
          
          // Add click handler und Details
          statItem.onclick = function() {
            toggleTrackerDetails(category, trackers, this);
          };
        } else {
          statItem.classList.remove('has-trackers');
          statItem.onclick = null;
        }
      }
    }
  }
  
  // Reset alle Items wenn keine Daten
  if (totalTrackers === 0) {
    document.querySelectorAll('.stat-item').forEach(item => {
      item.classList.remove('has-trackers');
      item.onclick = null;
    });
  }
  
  console.log('📊 Tracker-Stats aktualisiert - Total:', totalTrackers);
  console.log('   Kategorien:', data.trackersByCategory);
  console.log('   Alle Tracker:', data.trackers);
}

// Animate Counter (smooth count-up)
function animateCounter(element, targetValue) {
  const currentValue = parseInt(element.textContent) || 0;
  
  if (currentValue === targetValue) return;
  
  const duration = 500; // 500ms
  const steps = 20;
  const increment = (targetValue - currentValue) / steps;
  let current = currentValue;
  let step = 0;
  
  const timer = setInterval(() => {
    step++;
    current += increment;
    
    if (step >= steps) {
      element.textContent = targetValue;
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, duration / steps);
}

// Toggle Tracker Details (Dropdown)
function toggleTrackerDetails(category, trackers, statItem) {
  // Prüfe ob bereits Details vorhanden
  let detailsDiv = statItem.querySelector('.stat-item-details');
  
  if (detailsDiv) {
    // Toggle
    detailsDiv.classList.toggle('expanded');
  } else {
    // Erstelle Details
    detailsDiv = document.createElement('div');
    detailsDiv.className = 'stat-item-details expanded';
    
    const listDiv = document.createElement('div');
    listDiv.className = 'stat-item-details-list';
    
    const categoryLabels = {
      'analytics': 'Analytics-Tracker',
      'advertising': 'Werbe-Tracker',
      'social': 'Social-Media-Tracker',
      'fingerprinting': 'Fingerprinting-Scripts',
      'cryptomining': 'Cryptomining-Scripts',
      'unknown': 'Unbekannte Tracker'
    };
    
    listDiv.innerHTML = `<strong>${categoryLabels[category] || category}:</strong><br>`;
    listDiv.innerHTML += trackers.slice(0, 10).map(t => {
      try {
        const hostname = new URL(t.url).hostname;
        return `<div>• ${hostname}</div>`;
      } catch {
        return '';
      }
    }).join('');
    
    if (trackers.length > 10) {
      listDiv.innerHTML += `<div style="margin-top: 8px; text-align: center; color: var(--text-muted);">+${trackers.length - 10} weitere...</div>`;
    }
    
    detailsDiv.appendChild(listDiv);
    statItem.appendChild(detailsDiv);
  }
}

// Add to Whitelist Button
document.getElementById('add-to-whitelist-btn').addEventListener('click', async () => {
  if (!currentWebsiteData) return;
  
  const urlObj = new URL(currentWebsiteData.url);
  const domain = urlObj.hostname;
  
  const response = await chrome.runtime.sendMessage({ 
    type: 'ADD_TO_WHITELIST', 
    domain 
  });
  
  if (response.success) {
    const btn = document.getElementById('add-to-whitelist-btn');
    btn.innerHTML = '✓ Zur Whitelist hinzugefügt';
    btn.style.background = '#10b981';
    
    setTimeout(() => {
      btn.innerHTML = '➕ Zur Whitelist';
      btn.style.background = '';
    }, 3000);
  }
});

// Delete Cookies Button
document.getElementById('delete-cookies-btn').addEventListener('click', async () => {
  if (!currentWebsiteData) return;
  
  const response = await chrome.runtime.sendMessage({ 
    type: 'DELETE_COOKIES', 
    url: currentWebsiteData.url 
  });
  
  if (response && response.success) {
    const btn = document.getElementById('delete-cookies-btn');
    btn.innerHTML = `✓ ${response.deleted || 0} Cookies gelöscht`;
    btn.style.background = '#10b981';
    
    setTimeout(() => {
      btn.innerHTML = '🗑️ Cookies löschen';
      btn.style.background = '';
      getCurrentData(); // Reload data
    }, 2000);
  }
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  // ESC - Close Dashboard
  if (e.key === 'Escape') {
    window.close();
  }
  
  // 1/2/3/4 - Privacy Mode Switch
  if (['1', '2', '3', '4'].includes(e.key) && !e.ctrlKey && !e.altKey) {
    const modes = ['normal', 'balanced', 'stealth', 'custom'];
    const mode = modes[parseInt(e.key) - 1];
    
    document.getElementById('privacy-mode-select').value = mode;
    chrome.storage.local.set({ privacyMode: mode });
    updatePrivacyModeInfo(mode);
    updatePrivacyFeatureStatus(mode);
    
    console.log(`⌨️ Hotkey: Privacy-Mode → ${mode}`);
  }
});

// Lade Privacy-Modus beim Start
chrome.storage.local.get(['privacyMode'], (result) => {
  const mode = result.privacyMode || 'balanced';
  document.getElementById('privacy-mode-select').value = mode;
  updatePrivacyModeInfo(mode);
  updatePrivacyFeatureStatus(mode);
});

// Initial laden
getCurrentData();

// Regelmäßig aktualisieren
setInterval(getCurrentData, 2000);

