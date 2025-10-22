// Settings Page Logic
console.log('⚙️ Settings geladen');

// Keyboard Shortcut - ESC to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.close();
  }
});

// Toggle Helper
function setupToggle(toggleId, storageKey, defaultValue = true) {
  const toggle = document.getElementById(toggleId);
  
  // Lade Status
  chrome.storage.local.get([storageKey], (result) => {
    const isActive = result[storageKey] !== undefined ? result[storageKey] : defaultValue;
    toggle.classList.toggle('active', isActive);
  });
  
  // Click Handler
  toggle.addEventListener('click', () => {
    const isActive = toggle.classList.toggle('active');
    chrome.storage.local.set({ [storageKey]: isActive });
    console.log(`${storageKey} geändert:`, isActive);
  });
}

// Setup Toggles
setupToggle('notifications-toggle', 'notificationsEnabled', true);
setupToggle('https-toggle', 'httpsUpgradeEnabled', true);

// Close Button
document.getElementById('close-btn').addEventListener('click', () => {
  window.close();
});

// Test Notification Button
document.getElementById('test-notification').addEventListener('click', async () => {
  const btn = document.getElementById('test-notification');
  const originalText = btn.innerHTML;
  
  try {
    console.log('🔔 Sende Test-Notification...');
    btn.innerHTML = '⏳ Teste...';
    btn.disabled = true;
    
    const response = await chrome.runtime.sendMessage({ type: 'TEST_NOTIFICATION' });
    console.log('🔔 Response:', response);
    
    if (response && response.success) {
      btn.innerHTML = '✓ Gesendet';
      btn.style.background = '#10b981';
      console.log('✅ Notification erfolgreich gesendet');
    } else {
      btn.innerHTML = '❌ Fehler';
      btn.style.background = '#ef4444';
      console.error('❌ Notification-Fehler:', response?.error || 'Unbekannter Fehler');
      
      // Zeige detaillierte Fehlermeldung
      if (response?.error === 'Notifications nicht erlaubt') {
        alert('🔔 Benachrichtigungen sind nicht erlaubt!\n\nBitte:\n1. Chrome-Einstellungen öffnen\n2. Erweiterungen → Cybo\n3. "Benachrichtigungen" aktivieren');
      }
    }
  } catch (error) {
    console.error('❌ Notification-Fehler:', error);
    btn.innerHTML = '❌ Fehler';
    btn.style.background = '#ef4444';
  }
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);
});

// Lade Settings beim Start
loadSettings();

async function loadSettings() {
  const result = await chrome.storage.local.get([
    'adBlockerEnabled',
    'adBlockerWhitelist',
    'adsBlockedTotal',
    'openaiApiKey'
  ]);
  
  // Ad-Blocker Toggle
  const toggle = document.getElementById('adblocker-toggle');
  if (result.adBlockerEnabled !== false) {
    toggle.classList.add('active');
  } else {
    toggle.classList.remove('active');
  }
  
  // Total Blocked
  document.getElementById('total-blocked').textContent = result.adsBlockedTotal || 0;
  
  // API Key (nur anzeigen ob gesetzt)
  if (result.openaiApiKey) {
    document.getElementById('api-key-input').value = '••••••••••••••••';
    document.getElementById('api-key-status').textContent = '✓ API Key gespeichert';
    document.getElementById('api-key-status').style.color = '#10b981';
  }
  
  // Whitelist
  const whitelist = result.adBlockerWhitelist || [];
  displayWhitelist(whitelist);
}

// Ad-Blocker Toggle
document.getElementById('adblocker-toggle').addEventListener('click', async function() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'TOGGLE_ADBLOCKER' });
    
    if (response.enabled) {
      this.classList.add('active');
    } else {
      this.classList.remove('active');
    }
    
    console.log('Ad-Blocker:', response.enabled ? 'AN' : 'AUS');
  } catch (error) {
    console.error('Fehler:', error);
  }
});

// API Key speichern
document.getElementById('save-api-key').addEventListener('click', async () => {
  const apiKey = document.getElementById('api-key-input').value.trim();
  const status = document.getElementById('api-key-status');
  
  if (!apiKey || apiKey === '••••••••••••••••') {
    status.textContent = '⚠️ Bitte gültigen API Key eingeben';
    status.style.color = '#f59e0b';
    return;
  }
  
  // Validiere Format (sollte mit sk- beginnen)
  if (!apiKey.startsWith('sk-')) {
    status.textContent = '⚠️ Ungültiger API Key (sollte mit sk- beginnen)';
    status.style.color = '#ef4444';
    return;
  }
  
  // Speichern
  await chrome.storage.local.set({ openaiApiKey: apiKey });
  
  status.textContent = '✓ API Key gespeichert!';
  status.style.color = '#10b981';
  
  // Maskiere Input
  document.getElementById('api-key-input').value = '••••••••••••••••';
});

// Whitelist hinzufügen
document.getElementById('add-whitelist').addEventListener('click', async () => {
  const input = document.getElementById('whitelist-input');
  let domain = input.value.trim();
  
  if (!domain) return;
  
  // Entferne http(s):// falls vorhanden
  domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  // Hole aktuelle Whitelist
  const { adBlockerWhitelist } = await chrome.storage.local.get(['adBlockerWhitelist']);
  const whitelist = adBlockerWhitelist || [];
  
  if (!whitelist.includes(domain)) {
    whitelist.push(domain);
    await chrome.storage.local.set({ adBlockerWhitelist: whitelist });
    
    // Update Background Script
    await chrome.runtime.sendMessage({ 
      type: 'TOGGLE_WHITELIST',
      domain: domain
    });
    
    displayWhitelist(whitelist);
  }
  
  input.value = '';
});

// Whitelist anzeigen
function displayWhitelist(whitelist) {
  const list = document.getElementById('whitelist-list');
  const empty = document.getElementById('whitelist-empty');
  
  if (!whitelist || whitelist.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  
  empty.style.display = 'none';
  list.innerHTML = whitelist.map(domain => `
    <div class="whitelist-item">
      <span>${domain}</span>
      <button class="remove-btn" data-domain="${domain}">Entfernen</button>
    </div>
  `).join('');
  
  // Event Listeners für Remove-Buttons
  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const domain = e.target.dataset.domain;
      await removeDomain(domain);
    });
  });
}

// Domain von Whitelist entfernen
async function removeDomain(domain) {
  const { adBlockerWhitelist } = await chrome.storage.local.get(['adBlockerWhitelist']);
  const whitelist = (adBlockerWhitelist || []).filter(d => d !== domain);
  
  await chrome.storage.local.set({ adBlockerWhitelist: whitelist });
  
  // Update Background Script
  await chrome.runtime.sendMessage({ 
    type: 'TOGGLE_WHITELIST',
    domain: domain
  });
  
  displayWhitelist(whitelist);
}

// Statistiken zurücksetzen
document.getElementById('reset-stats').addEventListener('click', async () => {
  if (confirm('Möchtest du wirklich alle Statistiken zurücksetzen?')) {
    await chrome.storage.local.set({ adsBlockedTotal: 0 });
    document.getElementById('total-blocked').textContent = '0';
    
    // Info
    alert('Statistiken wurden zurückgesetzt!');
  }
});

// Enter-Taste für Whitelist-Input
document.getElementById('whitelist-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('add-whitelist').click();
  }
});

// Enter-Taste für API Key
document.getElementById('api-key-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('save-api-key').click();
  }
});

