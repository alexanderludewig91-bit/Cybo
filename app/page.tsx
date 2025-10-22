"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityScore } from "@/components/SecurityScore";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Activity, TrendingUp, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface SecurityMetrics {
  overallScore: number;
  threatsBlocked: number;
  scansPerformed: number;
  alertsActive: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    overallScore: 85,
    threatsBlocked: 24,
    scansPerformed: 142,
    alertsActive: 2,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "success", message: "URL-Scan erfolgreich", time: "Vor 2 Min." },
    { id: 2, type: "warning", message: "Schwaches Passwort erkannt", time: "Vor 15 Min." },
    { id: 3, type: "success", message: "System-Check abgeschlossen", time: "Vor 1 Std." },
    { id: 4, type: "info", message: "Neue Security-Empfehlung", time: "Vor 2 Std." },
  ]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Willkommen zurück! Hier ist deine Sicherheitsübersicht.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Alle Systeme aktiv
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Security Score Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Gesamtsicherheitsscore
              </CardTitle>
              <CardDescription>
                Deine aktuelle Sicherheitsbewertung basierend auf allen Faktoren
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <SecurityScore score={metrics.overallScore} size="lg" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{metrics.threatsBlocked}</p>
                      <p className="text-sm text-muted-foreground">Bedrohungen blockiert</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                      <Activity className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{metrics.scansPerformed}</p>
                      <p className="text-sm text-muted-foreground">Scans durchgeführt</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                      <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{metrics.alertsActive}</p>
                      <p className="text-sm text-muted-foreground">Aktive Warnungen</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                      <Lock className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Sichere Passwörter</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Letzte Aktivitäten
                </CardTitle>
                <CardDescription>Deine letzten Sicherheitsaktionen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                    >
                      <div
                        className={`mt-0.5 h-2 w-2 rounded-full ${
                          activity.type === "success"
                            ? "bg-green-500"
                            : activity.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Schnellaktionen</CardTitle>
                <CardDescription>Häufig verwendete Sicherheitstools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <a
                    href="/live"
                    className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-primary hover:bg-accent"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Live Monitor öffnen</p>
                      <p className="text-xs text-muted-foreground">
                        Echtzeit-Überwachung beim Surfen
                      </p>
                    </div>
                  </a>
                  <a
                    href="/password-check"
                    className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-primary hover:bg-accent"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Passwort prüfen</p>
                      <p className="text-xs text-muted-foreground">
                        Analysiere Passwortstärke
                      </p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Tips */}
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Tipp des Tages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                <strong>2-Faktor-Authentifizierung:</strong> Aktiviere 2FA für all deine wichtigen
                Accounts. Dies erhöht deine Sicherheit um bis zu 99.9%!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

