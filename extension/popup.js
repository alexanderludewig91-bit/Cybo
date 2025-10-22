// Popup Script
console.log('Cybo Popup geöffnet');

// Aktuelle Tab-Daten abrufen
async function loadCurrentData() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_CURRENT_DATA' });
    
    if (response && response.url) {
      document.getElementById('current-url').textContent = response.url;
      document.getElementById('cookies-count').textContent = response.cookies?.length || 0;
      document.getElementById('trackers-count').textContent = response.trackers?.length || 0;
      document.getElementById('third-parties-count').textContent = response.thirdParties?.size || 0;
      document.getElementById('requests-count').textContent = response.requests?.length || 0;
      document.getElementById('ads-blocked-count').textContent = response.adsBlockedCount || 0;
      
      // Highlight if Ads blocked
      const adsMetric = document.getElementById('ads-metric');
      if (response.adsBlockedCount > 0) {
        adsMetric.style.background = 'rgba(16, 185, 129, 0.2)';
      }
      
      // Status auf Connected setzen
      document.getElementById('status-dot').classList.remove('disconnected');
      document.getElementById('status-text').textContent = 'Aktiv überwacht';
    } else {
      document.getElementById('current-url').textContent = 'Keine Website aktiv';
    }
  } catch (error) {
    console.error('Fehler beim Laden:', error);
    document.getElementById('status-dot').classList.add('disconnected');
    document.getElementById('status-text').textContent = 'Nicht verbunden';
  }
}

// Dashboard öffnen - Extension-eigene Seite im Popup-Fenster!
document.getElementById('open-dashboard').addEventListener('click', async () => {
  // Öffne Extension-Dashboard in separatem Popup-Fenster
  chrome.windows.create({
    url: chrome.runtime.getURL('dashboard.html'),
    type: 'popup',
    width: 1400,
    height: 900,
    left: 100,
    top: 50,
  });
});

// Lade Daten beim Öffnen
loadCurrentData();

// Aktualisiere alle 2 Sekunden
setInterval(loadCurrentData, 2000);

