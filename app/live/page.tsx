"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SecurityScore } from "@/components/SecurityScore";
import {
  Activity,
  Globe,
  Shield,
  Cookie,
  Radio,
  AlertTriangle,
  Lock,
  Eye,
  Wifi,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

interface WebsiteData {
  url: string;
  title: string;
  cookies: any[];
  trackers: any[];
  thirdParties: string[];
  requests: any[];
  permissions: any[];
  adsBlocked: any[];
  summary: {
    totalCookies: number;
    totalTrackers: number;
    totalThirdParties: number;
    totalRequests: number;
    totalAdsBlocked: number;
    totalAdsBlockedSession: number;
  };
  adBlocker: {
    enabled: boolean;
    adsBlocked: any[];
    totalBlockedSession: number;
  };
}

export default function LiveDashboardPage() {
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [cachedAnalysis, setCachedAnalysis] = useState<any | null>(null);
  const [showAnalysisButton, setShowAnalysisButton] = useState(true);
  const [adBlockerEnabled, setAdBlockerEnabled] = useState(true);
  const [isTogglingAdBlocker, setIsTogglingAdBlocker] = useState(false);

  // Callback-Ref für WebSocket-Handler
  const handleWebsiteDataRef = useRef<(data: any) => void>();
  // WebSocket als Ref für Zugriff in Callbacks (zusätzlich zu State)
  const wsRef = useRef<WebSocket | null>(null);
  
  // Update die Callback-Referenz bei jedem Render
  useEffect(() => {
    handleWebsiteDataRef.current = (data: any) => {
      console.log('📨 Daten empfangen:', data);

        if (data.type === 'WEBSITE_DATA') {
          // Ignoriere localhost-URLs (das Dashboard selbst!)
          if (data.payload.url && 
              (data.payload.url.includes('localhost') || 
               data.payload.url.includes('127.0.0.1'))) {
            console.log('🚫 Localhost ignoriert - zeige weiter letzte Website');
            return; // Nicht aktualisieren!
          }
          
          console.log('✅ Aktualisiere Dashboard mit:', data.payload.url);
          setWebsiteData(data.payload);
          setLastUpdate(Date.now()); // Trigger für visuelle Updates
          
          // Update Ad-Blocker Status
          if (data.payload.adBlocker) {
            setAdBlockerEnabled(data.payload.adBlocker.enabled);
          }
          
          // Activity Log aktualisieren
          if (data.payload.trackers?.length > 0) {
            const newActivity = {
              id: Date.now(),
              type: 'tracker',
              message: `${data.payload.trackers.length} Tracker blockiert`,
              timestamp: new Date().toISOString(),
              icon: '🚫',
            };
            setActivityLog(prev => [newActivity, ...prev].slice(0, 10));
          }
          
          // NICHT mehr automatisch analysieren - nur auf Knopfdruck!
          // analyzeWebsite(data.payload);
          
          // Prüfe ob es bereits eine gecachte Analyse gibt
          checkCachedAnalysis(data.payload.url);
        }
    };
  });

  useEffect(() => {
    // Verhindere doppelte Verbindungen (React Strict Mode)
    if (wsRef.current) {
      console.log('⚠️ WebSocket bereits vorhanden, überspringe Neuverbindung');
      return;
    }

    // WebSocket-Verbindung
    console.log('🔌 Erstelle WebSocket-Verbindung...');
    const websocket = new WebSocket('ws://localhost:3001');
    
    // Sofort in Ref speichern (vor onopen!)
    wsRef.current = websocket;

    websocket.onopen = () => {
      console.log('✅ Verbunden mit WebSocket');
      setIsConnected(true);
      setWs(websocket);
      console.log('✅ WebSocket bereit - readyState:', websocket.readyState);
    };

    websocket.onmessage = async (event) => {
      try {
        let messageData = event.data;
        
        // Wenn es ein Blob ist, erst in Text konvertieren
        if (messageData instanceof Blob) {
          messageData = await messageData.text();
        }
        
        // Jetzt als JSON parsen
        const data = JSON.parse(messageData);
        
        // Nutze die aktuelle Callback-Referenz
        if (handleWebsiteDataRef.current) {
          handleWebsiteDataRef.current(data);
        }
      } catch (error) {
        console.error('Fehler beim Parsen der WebSocket-Nachricht:', error);
      }
    };

    websocket.onclose = () => {
      console.log('❌ WebSocket getrennt');
      setIsConnected(false);
      setWs(null);
      wsRef.current = null;
    };

    websocket.onerror = (error) => {
      console.error('WebSocket Verbindungsfehler - Server läuft auf Port 3001?');
      setIsConnected(false);
    };

    // Cleanup nur wenn Component wirklich unmounted
    return () => {
      // Nur schließen wenn es UNSERE Verbindung ist
      if (wsRef.current === websocket) {
        console.log('🔌 Component unmount - schließe WebSocket');
        websocket.close();
        wsRef.current = null;
        setWs(null);
      }
    };
  }, []);

  const calculateSecurityScore = () => {
    if (!websiteData) return 50;
    
    let score = 100;
    
    // Abzüge für Tracker
    score -= Math.min(websiteData.summary.totalTrackers * 5, 30);
    
    // Abzüge für Cookies
    score -= Math.min(websiteData.summary.totalCookies * 2, 20);
    
    // Abzüge für Third-Parties
    score -= Math.min(websiteData.summary.totalThirdParties * 3, 25);
    
    // HTTPS Check
    if (websiteData.url && !websiteData.url.startsWith('https://')) {
      score -= 25;
    }
    
    return Math.max(0, Math.min(100, score));
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE');
  };

  const formatTimeSince = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
  };

  const hasHttps = websiteData?.url?.startsWith('https://') ?? false;

  // Prüfe ob es bereits eine gecachte Analyse gibt
  const checkCachedAnalysis = useCallback(async (url: string) => {
    try {
      const domain = new URL(url).hostname;
      const response = await fetch(`/api/get-cached-analysis?domain=${encodeURIComponent(domain)}`);
      
      if (response.ok) {
        const cached = await response.json();
        if (cached.analysis) {
          console.log('✅ Gecachte Analyse gefunden für:', domain);
          setCachedAnalysis(cached);
          setAiAnalysis(cached.analysis);
          setShowAnalysisButton(false); // Button verstecken, da gecacht
        } else {
          // Keine gecachte Analyse
          setCachedAnalysis(null);
          setAiAnalysis(null);
          setShowAnalysisButton(true); // Button anzeigen
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden gecachter Analyse:', error);
      setCachedAnalysis(null);
      setShowAnalysisButton(true);
    }
  }, []);

  // Manuelle Website-Analyse mit KI (nur auf Knopfdruck!)
  const analyzeWebsite = useCallback(async () => {
    if (!websiteData) return;
    
    console.log('🤖 Starte KI-Analyse für:', websiteData.url);
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setCachedAnalysis(null);
    
    try {
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: websiteData.url,
          data: {
            cookiesCount: websiteData.summary.totalCookies,
            trackersCount: websiteData.summary.totalTrackers,
            thirdPartiesCount: websiteData.summary.totalThirdParties,
            requestsCount: websiteData.summary.totalRequests,
            trackers: websiteData.trackers,
            cookies: websiteData.cookies,
            permissions: websiteData.permissions,
            title: websiteData.title,
          },
        }),
      });
      
      const result = await response.json();
      console.log('✅ KI-Analyse abgeschlossen');
      setAiAnalysis(result.analysis);
      setShowAnalysisButton(false);
      
      // Lade gecachte Daten neu (um Zeitstempel zu zeigen)
      checkCachedAnalysis(websiteData.url);
    } catch (error) {
      console.error('Analyse-Fehler:', error);
      setAiAnalysis('Analyse nicht verfügbar');
    } finally {
      setIsAnalyzing(false);
    }
  }, [websiteData, checkCachedAnalysis]);

  // Toggle Ad-Blocker (über WebSocket statt direkt)
  const toggleAdBlocker = async () => {
    console.log('🎯 Toggle Ad-Blocker aufgerufen');
    
    setIsTogglingAdBlocker(true);
    try {
      // Sende Message über WebSocket an Extension (nutze Ref!)
      const currentWs = wsRef.current;
      
      // readyState: 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED
      if (currentWs && currentWs.readyState === 1) {
        const message = { 
          type: 'DASHBOARD_COMMAND',
          command: 'TOGGLE_ADBLOCKER'
        };
        console.log('📤 Sende Toggle-Command:', message);
        currentWs.send(JSON.stringify(message));
        console.log('✅ Ad-Blocker Toggle gesendet via WebSocket');
        
        // Toggle lokal (wird durch WebSocket-Update bestätigt)
        setAdBlockerEnabled(!adBlockerEnabled);
      } else {
        console.error('❌ WebSocket nicht bereit!');
        console.error('   - WebSocket existiert?', currentWs !== null);
        console.error('   - readyState:', currentWs?.readyState, '(1=OPEN erwartet)');
        
        alert('WebSocket nicht verbunden. Bitte Dashboard neu laden (F5).');
      }
    } catch (error) {
      console.error('Fehler beim Toggle Ad-Blocker:', error);
    } finally {
      setIsTogglingAdBlocker(false);
    }
  };

  // Toggle Whitelist für aktuelle Domain (über WebSocket)
  const toggleWhitelist = async () => {
    if (!websiteData) return;
    
    const currentWs = wsRef.current;
    if (!currentWs || currentWs.readyState !== 1) return; // 1 = OPEN
    
    try {
      const domain = new URL(websiteData.url).hostname;
      currentWs.send(JSON.stringify({ 
        type: 'DASHBOARD_COMMAND',
        command: 'TOGGLE_WHITELIST',
        domain: domain
      }));
      console.log('🔄 Whitelist Toggle gesendet für:', domain);
    } catch (error) {
      console.error('Fehler beim Toggle Whitelist:', error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Radio className="h-6 w-6 text-primary animate-pulse" />
              Live Security Monitor
            </h1>
            <p className="text-sm text-muted-foreground">
              Echtzeit-Überwachung deiner Browser-Aktivitäten
            </p>
          </div>
          <div className="flex items-center gap-4">
            {websiteData && (
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3" />
                Zuletzt: {formatTime(websiteData.timestamp || new Date().toISOString())}
              </Badge>
            )}
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Verbunden' : 'Getrennt'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {!isConnected && (
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-500">
                  <AlertTriangle className="h-5 w-5" />
                  Extension nicht verbunden
                </CardTitle>
                <CardDescription>
                  Stelle sicher, dass die Cybo Browser Extension installiert und aktiviert ist.
                  Der WebSocket-Server muss auf Port 3001 laufen (npm run ws).
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {isConnected && !websiteData && (
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-500">
                  <Globe className="h-5 w-5" />
                  Bereit zum Monitoren
                </CardTitle>
                <CardDescription>
                  Besuche eine Website in einem anderen Tab, um Live-Daten zu sehen.
                  Das Dashboard bleibt im Hintergrund und zeigt die zuletzt besuchte Website.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {websiteData ? (
            <>
              {/* Current Website Card */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent animate-slide-in">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Aktuell besucht</CardTitle>
                        <Badge variant="outline" className="ml-auto">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1" />
                          Live
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold" key={lastUpdate}>
                          {formatUrl(websiteData.url)}
                        </p>
                        {websiteData.title && (
                          <p className="text-sm text-muted-foreground">{websiteData.title}</p>
                        )}
                      </div>
                    </div>
                    <SecurityScore score={calculateSecurityScore()} size="lg" key={lastUpdate} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {hasHttps ? (
                        <Lock className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {hasHttps ? 'HTTPS gesichert' : 'Nicht verschlüsselt'}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {websiteData.summary.totalRequests} Requests
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Ad-Blocker Stats Card */}
              {websiteData.adBlocker && (
                <Card className={`border-2 ${websiteData.adBlocker.enabled ? 'border-green-500/30 bg-green-500/5' : 'border-gray-500/30'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className={`h-5 w-5 ${websiteData.adBlocker.enabled ? 'text-green-500' : 'text-gray-500'}`} />
                        <CardTitle className="text-lg">Ad-Blocker</CardTitle>
                      </div>
                      <Button
                        variant={websiteData.adBlocker.enabled ? "default" : "outline"}
                        size="sm"
                        onClick={toggleAdBlocker}
                        disabled={isTogglingAdBlocker || !isConnected}
                        className="gap-2"
                        title={!isConnected ? 'WebSocket nicht verbunden - Dashboard neu laden' : ''}
                      >
                        {websiteData.adBlocker.enabled ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Aktiviert
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            Deaktiviert
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Diese Seite:</span>
                        <span className="text-2xl font-bold text-green-500">
                          {websiteData.summary.totalAdsBlocked || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-2">
                        <span className="text-sm text-muted-foreground">Diese Session:</span>
                        <span className="text-lg font-semibold">
                          {websiteData.summary.totalAdsBlockedSession || 0}
                        </span>
                      </div>
                      {websiteData.adBlocker.enabled && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            ⚡ Schnellere Ladezeiten & weniger Datenverbrauch
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metrics Grid */}
              <div className="grid gap-6 md:grid-cols-4">
                {/* Cookies */}
                <Card className={websiteData.summary.totalCookies > 10 ? "border-yellow-500/20" : ""}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cookies</CardTitle>
                    <Cookie className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{websiteData.summary.totalCookies}</div>
                    <p className="text-xs text-muted-foreground">
                      {websiteData.summary.totalCookies > 10 ? 'Viele Cookies' : 'Akzeptabel'}
                    </p>
                  </CardContent>
                </Card>

                {/* Trackers */}
                <Card className={websiteData.summary.totalTrackers > 0 ? "border-red-500/20" : "border-green-500/20"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tracker</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${websiteData.summary.totalTrackers > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {websiteData.summary.totalTrackers}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {websiteData.summary.totalTrackers > 0 ? 'Tracking aktiv' : 'Keine Tracker'}
                    </p>
                  </CardContent>
                </Card>

                {/* Third Parties */}
                <Card className={websiteData.summary.totalThirdParties > 5 ? "border-orange-500/20" : ""}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Third-Parties</CardTitle>
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{websiteData.summary.totalThirdParties}</div>
                    <p className="text-xs text-muted-foreground">
                      Externe Verbindungen
                    </p>
                  </CardContent>
                </Card>

                {/* Permissions */}
                <Card className={websiteData.permissions?.length > 0 ? "border-yellow-500/20" : ""}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Berechtigungen</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{websiteData.permissions?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Angefordert
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* KI-Analyse - Nur auf Knopfdruck oder wenn gecacht */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        KI-Sicherheitsbewertung
                      </CardTitle>
                      <CardDescription>
                        {cachedAnalysis 
                          ? `Analysiert ${formatTimeSince(cachedAnalysis.analyzedAt)}`
                          : 'Lasse die Website von KI bewerten'
                        }
                      </CardDescription>
                    </div>
                    {(showAnalysisButton || cachedAnalysis) && !isAnalyzing && (
                      <Button 
                        onClick={analyzeWebsite}
                        size="sm"
                        className="gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        {cachedAnalysis ? 'Neu analysieren' : 'Mit KI analysieren'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Analysiere Website mit KI...</span>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed">{aiAnalysis}</p>
                      {cachedAnalysis && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Aus Cache - spart API-Kosten
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Klicke auf "Mit KI analysieren" um eine detaillierte Sicherheitsbewertung zu erhalten.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Geblockte Ads Details */}
              {websiteData.adBlocker && websiteData.adBlocker.adsBlocked.length > 0 && (
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-500">
                      <Shield className="h-5 w-5" />
                      Geblockte Werbung
                    </CardTitle>
                    <CardDescription>
                      Diese Ads wurden auf dieser Seite blockiert
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-auto">
                      {websiteData.adBlocker.adsBlocked.slice(0, 10).map((ad, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm p-2 rounded bg-background/50">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-xs truncate block">
                              {ad.domain || new URL(ad.url).hostname}
                            </span>
                            <Badge variant="outline" className="text-xs mt-1">
                              {ad.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {websiteData.adBlocker.adsBlocked.length > 10 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{websiteData.adBlocker.adsBlocked.length - 10} weitere...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Details Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Tracker Details */}
                {websiteData.summary.totalTrackers > 0 && (
                  <Card className="border-red-500/20 bg-red-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-500">
                        <Eye className="h-5 w-5" />
                        Erkannte Tracker
                      </CardTitle>
                      <CardDescription>Diese Domains tracken deine Aktivitäten</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-64 overflow-auto">
                        {websiteData.trackers.slice(0, 10).map((tracker, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm p-2 rounded bg-background/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            <span className="truncate font-mono text-xs">
                              {new URL(tracker.url).hostname}
                            </span>
                          </div>
                        ))}
                        {websiteData.trackers.length > 10 && (
                          <p className="text-xs text-muted-foreground text-center">
                            +{websiteData.trackers.length - 10} weitere...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Third-Party Connections */}
                {websiteData.summary.totalThirdParties > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wifi className="h-5 w-5" />
                        Externe Verbindungen
                      </CardTitle>
                      <CardDescription>Diese Domains werden kontaktiert</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-64 overflow-auto">
                        {websiteData.thirdParties.slice(0, 10).map((party, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            <span className="truncate font-mono text-xs">{party}</span>
                          </div>
                        ))}
                        {websiteData.thirdParties.length > 10 && (
                          <p className="text-xs text-muted-foreground text-center">
                            +{websiteData.thirdParties.length - 10} weitere...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Activity Log */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Live-Aktivitätsprotokoll
                    </CardTitle>
                    <CardDescription>Aktuelle Sicherheitsereignisse</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activityLog.length > 0 ? (
                      <div className="space-y-2">
                        {activityLog.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50"
                          >
                            <span className="text-xl">{activity.icon}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatTime(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Keine Aktivitäten aufgezeichnet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="text-center space-y-4">
                  <Globe className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Warten auf Daten...</h3>
                    <p className="text-sm text-muted-foreground">
                      Besuche eine Website mit installierter Extension,<br />
                      um Live-Daten zu sehen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

