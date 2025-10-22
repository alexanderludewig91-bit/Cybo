import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: 'Passwort ist erforderlich' }, { status: 400 });
    }

    const analysis = analyzePassword(password);

    // Speichere Analyse (ohne Passwort!)
    await prisma.scanHistory.create({
      data: {
        type: 'password',
        input: `Password check (${analysis.strength})`,
        result: JSON.stringify({ score: analysis.score, strength: analysis.strength }),
        score: analysis.score,
      },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Password Check Error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Passwortprüfung' },
      { status: 500 }
    );
  }
}

function analyzePassword(password: string): PasswordAnalysis {
  let score = 0;
  const feedback: string[] = [];
  const suggestions: string[] = [];

  // Längenprüfung
  const length = password.length;
  if (length < 8) {
    feedback.push('Passwort ist zu kurz (< 8 Zeichen)');
    suggestions.push('Verwende mindestens 12 Zeichen');
    score += Math.min(length * 5, 30);
  } else if (length < 12) {
    feedback.push('Passwort hat akzeptable Länge');
    suggestions.push('Längere Passwörter sind noch sicherer');
    score += 40;
  } else if (length < 16) {
    feedback.push('Gute Passwortlänge');
    score += 50;
  } else {
    feedback.push('Ausgezeichnete Passwortlänge');
    score += 60;
  }

  // Zeichentypen prüfen
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let varietyScore = 0;
  if (hasUppercase) varietyScore += 10;
  if (hasLowercase) varietyScore += 10;
  if (hasNumbers) varietyScore += 10;
  if (hasSpecialChars) varietyScore += 15;

  score += varietyScore;

  if (!hasUppercase) {
    feedback.push('Keine Großbuchstaben gefunden');
    suggestions.push('Füge Großbuchstaben hinzu');
  }
  if (!hasLowercase) {
    feedback.push('Keine Kleinbuchstaben gefunden');
    suggestions.push('Füge Kleinbuchstaben hinzu');
  }
  if (!hasNumbers) {
    feedback.push('Keine Zahlen gefunden');
    suggestions.push('Füge Zahlen hinzu');
  }
  if (!hasSpecialChars) {
    feedback.push('Keine Sonderzeichen gefunden');
    suggestions.push('Füge Sonderzeichen hinzu (!@#$%...)');
  }

  // Häufige Muster prüfen
  const commonPatterns = [
    /^123+/,
    /abc+/i,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
    /(.)\1{2,}/, // Wiederholte Zeichen
    /^[0-9]+$/, // Nur Zahlen
    /^[a-zA-Z]+$/, // Nur Buchstaben
  ];

  const hasCommonPatterns = commonPatterns.some((pattern) => pattern.test(password));

  if (hasCommonPatterns) {
    score -= 20;
    feedback.push('Enthält häufige oder wiederholte Muster');
    suggestions.push('Vermeide häufige Wörter und Muster');
  }

  // Sequenzen prüfen
  const hasSequence = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
  if (hasSequence) {
    score -= 10;
    feedback.push('Enthält aufeinanderfolgende Zeichen');
    suggestions.push('Vermeide Sequenzen wie "abc" oder "123"');
  }

  // Bonus für Länge und Vielfalt
  if (length >= 16 && varietyScore >= 40) {
    score += 10;
    feedback.push('Exzellente Kombination aus Länge und Vielfalt');
  }

  // Score normalisieren
  score = Math.max(0, Math.min(100, score));

  // Stärke bestimmen
  let strength: string;
  if (score < 40) {
    strength = 'Sehr schwach';
  } else if (score < 60) {
    strength = 'Schwach';
  } else if (score < 75) {
    strength = 'Mittel';
  } else if (score < 90) {
    strength = 'Stark';
  } else {
    strength = 'Sehr stark';
  }

  // Geschätzte Zeit zum Knacken
  let estimatedCrackTime: string;
  if (score < 40) {
    estimatedCrackTime = 'Sekunden bis Minuten';
  } else if (score < 60) {
    estimatedCrackTime = 'Stunden bis Tage';
  } else if (score < 75) {
    estimatedCrackTime = 'Monate';
  } else if (score < 90) {
    estimatedCrackTime = 'Jahre';
  } else {
    estimatedCrackTime = 'Jahrhunderte+';
  }

  if (score >= 80 && suggestions.length === 0) {
    suggestions.push('Ausgezeichnetes Passwort! Bewahre es sicher auf.');
  }

  return {
    score,
    strength,
    feedback,
    suggestions,
    details: {
      length,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecialChars,
      hasCommonPatterns,
      estimatedCrackTime,
    },
  };
}

