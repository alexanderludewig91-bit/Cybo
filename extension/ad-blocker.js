// Cybo Ad-Blocker - Bekannte Werbe-Domains und -Muster
// Liste basiert auf gängigen Ad-Networks und Tracking-Diensten

export const AD_DOMAINS = [
  // Google Ads
  'googlesyndication.com',
  'googleadservices.com',
  'doubleclick.net',
  'google-analytics.com',
  'googletagmanager.com',
  'googletagservices.com',
  'adservice.google.com',
  
  // Facebook Ads
  'facebook.com/tr',
  'connect.facebook.net',
  'facebook.net',
  
  // Amazon Ads
  'amazon-adsystem.com',
  'amazonaax.com',
  
  // Microsoft/Bing Ads
  'ads.microsoft.com',
  'bat.bing.com',
  
  // Twitter/X Ads
  'ads-twitter.com',
  'static.ads-twitter.com',
  
  // Taboola / Outbrain (Content Ads)
  'taboola.com',
  'trc.taboola.com',
  'outbrain.com',
  'widgets.outbrain.com',
  
  // PopAds / PopUnder Networks
  'popads.net',
  'popcash.net',
  'propellerads.com',
  'adsterra.com',
  
  // Video Ads
  'imasdk.googleapis.com',
  'pubads.g.doubleclick.net',
  
  // Analytics & Tracking (die auch Werbung zeigen)
  'hotjar.com',
  'mixpanel.com',
  'segment.com',
  'segment.io',
  'amplitude.com',
  'chartbeat.com',
  'quantserve.com',
  'scorecardresearch.com',
  
  // Ad Exchanges
  'adnxs.com', // AppNexus
  'advertising.com',
  'criteo.com',
  'openx.net',
  'pubmatic.com',
  'rubiconproject.com',
  'indexww.com',
  
  // Weitere bekannte Ad-Networks
  'adform.net',
  'adsafeprotected.com',
  'adsrvr.org',
  'adtech.de',
  'advertising.com',
  'lijit.com',
  'bidswitch.net',
  'casalemedia.com',
  'media.net',
  'mediavine.com',
  'revcontent.com',
  'richaudience.com',
  'sovrn.com',
  'spotxchange.com',
  'tremorhub.com',
  'yieldmo.com',
];

// URL-Muster die auf Werbung hindeuten
export const AD_PATTERNS = [
  /\/ads?\//i,
  /\/advert/i,
  /\/banner/i,
  /\/popup/i,
  /\/tracking/i,
  /\/impression/i,
  /\/click/i,
  /\/pixel/i,
  /\.ad\./i,
  /ads\./i,
  /adserver/i,
  /advertisement/i,
  /sponsor/i,
];

// Prüfe ob eine URL Werbung ist
export function isAd(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    const fullUrl = url.toLowerCase();
    
    // Prüfe gegen bekannte Domains
    for (const adDomain of AD_DOMAINS) {
      if (hostname.includes(adDomain)) {
        return true;
      }
    }
    
    // Prüfe gegen Muster
    for (const pattern of AD_PATTERNS) {
      if (pattern.test(pathname) || pattern.test(fullUrl)) {
        return true;
      }
    }
    
    return false;
  } catch {
    return false;
  }
}

// Kategorisiere den Ad-Typ
export function getAdType(url) {
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
  if (urlLower.includes('video') || urlLower.includes('ima')) {
    return 'Video Ads';
  }
  if (urlLower.includes('analytics') || urlLower.includes('tracking')) {
    return 'Tracking';
  }
  
  return 'Display Ads';
}

