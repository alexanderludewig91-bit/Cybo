"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SecurityScore } from "@/components/SecurityScore";
import {
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Copy,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface PasswordAnalysis {
  score: number;
  strength: string;
  feedback: string[];
  suggestions: string[];
  details: {
    length: number;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    hasCommonPatterns: boolean;
    estimatedCrackTime: string;
  };
}

export default function PasswordCheckPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!password) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing password:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePassword = () => {
    const length = 16;
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    let newPassword = '';
    const allChars = Object.values(charset).join('');

    // Mindestens ein Zeichen von jedem Typ
    newPassword += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
    newPassword += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));
    newPassword += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length));
    newPassword += charset.special.charAt(Math.floor(Math.random() * charset.special.length));

    // Rest auffüllen
    for (let i = newPassword.length; i < length; i++) {
      newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Mischen
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

    setPassword(newPassword);
    setAnalysis(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Sehr stark':
        return 'text-green-500 bg-green-500/10';
      case 'Stark':
        return 'text-blue-500 bg-blue-500/10';
      case 'Mittel':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'Schwach':
        return 'text-orange-500 bg-orange-500/10';
      default:
        return 'text-red-500 bg-red-500/10';
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Key className="h-6 w-6" />
              Password-Check
            </h1>
            <p className="text-sm text-muted-foreground">
              Analysiere die Sicherheit deiner Passwörter
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Password Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Passwort eingeben</CardTitle>
              <CardDescription>
                Dein Passwort wird nicht gespeichert und bleibt lokal auf deinem Gerät
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Passwort eingeben..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAnalysis(null);
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button onClick={handleAnalyze} disabled={!password || isAnalyzing}>
                  Analysieren
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={generatePassword} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sicheres Passwort generieren
                </Button>
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  disabled={!password}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6 animate-slide-in">
              {/* Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Passwort-Stärke</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <SecurityScore score={analysis.score} size="lg" />
                    <div className="flex-1 ml-8 space-y-4">
                      <div>
                        <Badge className={getStrengthColor(analysis.strength)}>
                          {analysis.strength}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          {analysis.details.hasUppercase ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">Großbuchstaben</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {analysis.details.hasLowercase ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">Kleinbuchstaben</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {analysis.details.hasNumbers ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">Zahlen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {analysis.details.hasSpecialChars ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">Sonderzeichen</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Geschätzte Knackzeit:{" "}
                          <strong className="text-foreground">
                            {analysis.details.estimatedCrackTime}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback */}
              {analysis.feedback.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Analyse-Ergebnisse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.feedback.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <Card className="border-blue-500/20 bg-blue-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-500">
                      <CheckCircle className="h-5 w-5" />
                      Empfehlungen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Password Tips */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Best Practices für sichere Passwörter</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Mindestens 12 Zeichen lang</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Kombination aus Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Keine persönlichen Informationen (Namen, Geburtstage, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Für jeden Account ein einzigartiges Passwort</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Nutze einen Passwort-Manager zur sicheren Aufbewahrung</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

