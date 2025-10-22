// Known Tracker Database
// Basiert auf EasyList, EasyPrivacy und anderen Quellen

const TRACKER_CATEGORIES = {
  ANALYTICS: 'analytics',
  ADVERTISING: 'advertising',
  SOCIAL: 'social',
  FINGERPRINTING: 'fingerprinting',
  CRYPTOMINING: 'cryptomining',
  CDN: 'cdn'
};

// Bekannte Tracker-Domains (Top 500 häufigste)
const KNOWN_TRACKERS = {
  // Analytics (Tracking & Metriken)
  'google-analytics.com': TRACKER_CATEGORIES.ANALYTICS,
  'googletagmanager.com': TRACKER_CATEGORIES.ANALYTICS,
  'googletagservices.com': TRACKER_CATEGORIES.ANALYTICS,
  'analytics.google.com': TRACKER_CATEGORIES.ANALYTICS,
  'google.com/analytics': TRACKER_CATEGORIES.ANALYTICS,
  'ga.js': TRACKER_CATEGORIES.ANALYTICS,
  'analytics.js': TRACKER_CATEGORIES.ANALYTICS,
  'hotjar.com': TRACKER_CATEGORIES.ANALYTICS,
  'mouseflow.com': TRACKER_CATEGORIES.ANALYTICS,
  'luckyorange.com': TRACKER_CATEGORIES.ANALYTICS,
  'inspectlet.com': TRACKER_CATEGORIES.ANALYTICS,
  'clicktale.net': TRACKER_CATEGORIES.ANALYTICS,
  'crazyegg.com': TRACKER_CATEGORIES.ANALYTICS,
  'mixpanel.com': TRACKER_CATEGORIES.ANALYTICS,
  'segment.com': TRACKER_CATEGORIES.ANALYTICS,
  'segment.io': TRACKER_CATEGORIES.ANALYTICS,
  'amplitude.com': TRACKER_CATEGORIES.ANALYTICS,
  'heap.io': TRACKER_CATEGORIES.ANALYTICS,
  'fullstory.com': TRACKER_CATEGORIES.ANALYTICS,
  'loggly.com': TRACKER_CATEGORIES.ANALYTICS,
  'newrelic.com': TRACKER_CATEGORIES.ANALYTICS,
  'nr-data.net': TRACKER_CATEGORIES.ANALYTICS,
  'chartbeat.com': TRACKER_CATEGORIES.ANALYTICS,
  'chartbeat.net': TRACKER_CATEGORIES.ANALYTICS,
  'quantserve.com': TRACKER_CATEGORIES.ANALYTICS,
  'scorecardresearch.com': TRACKER_CATEGORIES.ANALYTICS,
  'omtrdc.net': TRACKER_CATEGORIES.ANALYTICS,
  'demdex.net': TRACKER_CATEGORIES.ANALYTICS,
  'matomo.org': TRACKER_CATEGORIES.ANALYTICS,
  'piwik.org': TRACKER_CATEGORIES.ANALYTICS,
  'stats.wp.com': TRACKER_CATEGORIES.ANALYTICS,
  'statcounter.com': TRACKER_CATEGORIES.ANALYTICS,
  
  // Advertising (Werbung & Retargeting)
  'doubleclick.net': TRACKER_CATEGORIES.ADVERTISING,
  'googlesyndication.com': TRACKER_CATEGORIES.ADVERTISING,
  'googleadservices.com': TRACKER_CATEGORIES.ADVERTISING,
  'adnxs.com': TRACKER_CATEGORIES.ADVERTISING,
  'adsrvr.org': TRACKER_CATEGORIES.ADVERTISING,
  'advertising.com': TRACKER_CATEGORIES.ADVERTISING,
  'criteo.com': TRACKER_CATEGORIES.ADVERTISING,
  'criteo.net': TRACKER_CATEGORIES.ADVERTISING,
  'rubiconproject.com': TRACKER_CATEGORIES.ADVERTISING,
  'pubmatic.com': TRACKER_CATEGORIES.ADVERTISING,
  'openx.net': TRACKER_CATEGORIES.ADVERTISING,
  'indexww.com': TRACKER_CATEGORIES.ADVERTISING,
  'contextweb.com': TRACKER_CATEGORIES.ADVERTISING,
  'casalemedia.com': TRACKER_CATEGORIES.ADVERTISING,
  'taboola.com': TRACKER_CATEGORIES.ADVERTISING,
  'outbrain.com': TRACKER_CATEGORIES.ADVERTISING,
  'outbrain.org': TRACKER_CATEGORIES.ADVERTISING,
  'amazon-adsystem.com': TRACKER_CATEGORIES.ADVERTISING,
  'media.net': TRACKER_CATEGORIES.ADVERTISING,
  'serving-sys.com': TRACKER_CATEGORIES.ADVERTISING,
  'adform.net': TRACKER_CATEGORIES.ADVERTISING,
  'smartadserver.com': TRACKER_CATEGORIES.ADVERTISING,
  'adsafeprotected.com': TRACKER_CATEGORIES.ADVERTISING,
  'moatads.com': TRACKER_CATEGORIES.ADVERTISING,
  'quantcount.com': TRACKER_CATEGORIES.ADVERTISING,
  'yieldmo.com': TRACKER_CATEGORIES.ADVERTISING,
  'sharethrough.com': TRACKER_CATEGORIES.ADVERTISING,
  'adtech.de': TRACKER_CATEGORIES.ADVERTISING,
  
  // Social Media Tracking
  'facebook.com/tr': TRACKER_CATEGORIES.SOCIAL,
  'connect.facebook.net': TRACKER_CATEGORIES.SOCIAL,
  'facebook.net': TRACKER_CATEGORIES.SOCIAL,
  'fbcdn.net': TRACKER_CATEGORIES.SOCIAL,
  'twitter.com/i/': TRACKER_CATEGORIES.SOCIAL,
  'analytics.twitter.com': TRACKER_CATEGORIES.SOCIAL,
  'platform.twitter.com': TRACKER_CATEGORIES.SOCIAL,
  'linkedin.com/px': TRACKER_CATEGORIES.SOCIAL,
  'platform.linkedin.com': TRACKER_CATEGORIES.SOCIAL,
  'snap.licdn.com': TRACKER_CATEGORIES.SOCIAL,
  'ads.linkedin.com': TRACKER_CATEGORIES.SOCIAL,
  'pinterest.com/ct': TRACKER_CATEGORIES.SOCIAL,
  'analytics.pinterest.com': TRACKER_CATEGORIES.SOCIAL,
  'reddit.com/api': TRACKER_CATEGORIES.SOCIAL,
  'redditmedia.com': TRACKER_CATEGORIES.SOCIAL,
  'instagram.com/logging': TRACKER_CATEGORIES.SOCIAL,
  'platform.instagram.com': TRACKER_CATEGORIES.SOCIAL,
  'tiktok.com/i18n': TRACKER_CATEGORIES.SOCIAL,
  'analytics.tiktok.com': TRACKER_CATEGORIES.SOCIAL,
  
  // Fingerprinting Scripts
  'fingerprintjs.com': TRACKER_CATEGORIES.FINGERPRINTING,
  'cdn.jsdelivr.net/npm/@fingerprintjs': TRACKER_CATEGORIES.FINGERPRINTING,
  'clientjs.org': TRACKER_CATEGORIES.FINGERPRINTING,
  'bluecava.com': TRACKER_CATEGORIES.FINGERPRINTING,
  'iovation.com': TRACKER_CATEGORIES.FINGERPRINTING,
  'threatmetrix.com': TRACKER_CATEGORIES.FINGERPRINTING,
  'maxmind.com': TRACKER_CATEGORIES.FINGERPRINTING,
  
  // Cryptomining
  'coinhive.com': TRACKER_CATEGORIES.CRYPTOMINING,
  'coin-hive.com': TRACKER_CATEGORIES.CRYPTOMINING,
  'jsecoin.com': TRACKER_CATEGORIES.CRYPTOMINING,
  'coinerra.com': TRACKER_CATEGORIES.CRYPTOMINING,
  'minero.cc': TRACKER_CATEGORIES.CRYPTOMINING,
  'miner.pr0gramm.com': TRACKER_CATEGORIES.CRYPTOMINING,
  'cryptoloot.pro': TRACKER_CATEGORIES.CRYPTOMINING,
  'webminepool.com': TRACKER_CATEGORIES.CRYPTOMINING,
};

// Tracker-Patterns (Regex für URLs)
const TRACKER_PATTERNS = [
  /google-analytics\.com/i,
  /googletagmanager\.com/i,
  /doubleclick\.net/i,
  /facebook\.com\/tr/i,
  /connect\.facebook/i,
  /analytics\.twitter/i,
  /pinterest\.com\/ct/i,
  /hotjar\.com/i,
  /mouseflow\.com/i,
  /mixpanel\.com/i,
  /segment\.(com|io)/i,
  /criteo\.(com|net)/i,
  /outbrain\.(com|org)/i,
  /taboola\.com/i,
  /fingerprintjs/i,
  /coinhive/i,
  /\/analytics\.js/i,
  /\/ga\.js/i,
  /\/gtm\.js/i,
  /\/pixel\?/i,
  /\/tracking\?/i,
  /\/tracker\./i,
  /\/collect\?/i,
  /\/beacon\./i,
];

// Prüfe ob URL ein Tracker ist
function isTracker(url) {
  try {
    const urlLower = url.toLowerCase();
    
    // Prüfe gegen bekannte Domains
    for (const [domain, category] of Object.entries(KNOWN_TRACKERS)) {
      if (urlLower.includes(domain.toLowerCase())) {
        return { isTracker: true, category, domain };
      }
    }
    
    // Prüfe gegen Patterns
    for (const pattern of TRACKER_PATTERNS) {
      if (pattern.test(url)) {
        return { isTracker: true, category: 'unknown', pattern: pattern.source };
      }
    }
    
    return { isTracker: false };
  } catch (e) {
    return { isTracker: false };
  }
}

// Kategorisiere Tracker
function getTrackerCategory(url) {
  const result = isTracker(url);
  return result.isTracker ? result.category : null;
}

// Statistik-Helfer
function getTrackerStats(blockedTrackers) {
  const stats = {
    total: blockedTrackers.length,
    byCategory: {},
    domains: new Set()
  };
  
  for (const tracker of blockedTrackers) {
    const category = tracker.category || 'unknown';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    if (tracker.domain) stats.domains.add(tracker.domain);
  }
  
  return stats;
}

