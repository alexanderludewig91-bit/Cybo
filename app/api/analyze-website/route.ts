import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { url, data } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL erforderlich' }, { status: 400 });
    }

    // Erstelle Analyse-Prompt
    const prompt = `Analysiere diese Website auf Sicherheit und Datenschutz:

URL: ${url}
Cookies: ${data.cookiesCount || 0}
Tracker: ${data.trackersCount || 0} (${data.trackers?.slice(0, 3).map((t: any) => new URL(t.url).hostname).join(', ') || 'keine'})
Third-Parties: ${data.thirdPartiesCount || 0}
HTTPS: ${url.startsWith('https://') ? 'Ja' : 'Nein'}

Gib eine kurze, prägnante Bewertung in 2-3 Sätzen:
1. Ist die Website vertrauenswürdig?
2. Welche Datenschutz-Risiken gibt es?
3. Eine konkrete Empfehlung.

Antworte auf Deutsch und professionell.`;

    // Nur wenn API Key gesetzt ist
    if (!process.env.OPENAI_API_KEY) {
      const fallbackAnalysis = generateFallbackAnalysis(url, data);
      
      // Speichern in DB
      await saveWebsiteVisit(url, data, fallbackAnalysis);
      
      return NextResponse.json({
        analysis: fallbackAnalysis,
        provider: 'fallback',
      });
    }

    // KI-Analyse
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein Cybersecurity-Experte, der Websites auf Sicherheit und Datenschutz bewertet.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const analysis = completion.choices[0].message.content || 'Keine Analyse verfügbar';

    // Speichern in DB
    await saveWebsiteVisit(url, data, analysis);

    return NextResponse.json({
      analysis,
      provider: 'openai',
    });
  } catch (error) {
    console.error('Website-Analyse Fehler:', error);
    
    // Fallback bei Fehler
    const fallbackAnalysis = generateFallbackAnalysis(req.url, {});
    
    return NextResponse.json({
      analysis: fallbackAnalysis,
      provider: 'fallback',
    });
  }
}

// Fallback-Analyse ohne KI
function generateFallbackAnalysis(url: string, data: any): string {
  const hasHttps = url.startsWith('https://');
  const trackersCount = data.trackersCount || 0;
  const cookiesCount = data.cookiesCount || 0;

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

  // Empfehlung
  if (!hasHttps || trackersCount > 5) {
    analysis += 'Empfehlung: Vorsicht bei der Eingabe persönlicher Daten.';
  } else {
    analysis += 'Die Website erscheint grundsätzlich sicher.';
  }

  return analysis;
}

// Speichere Website-Besuch in Datenbank
async function saveWebsiteVisit(url: string, data: any, analysis: string) {
  try {
    const domain = new URL(url).hostname;
    
    // Prüfe ob bereits ein Eintrag für diese Domain existiert
    const existing = await prisma.websiteVisit.findFirst({
      where: { domain },
      orderBy: { visitedAt: 'desc' },
    });

    if (existing) {
      // Update bestehenden Eintrag
      await prisma.websiteVisit.update({
        where: { id: existing.id },
        data: {
          url,
          title: data.title || existing.title,
          cookiesCount: data.cookiesCount || existing.cookiesCount,
          trackersCount: data.trackersCount || existing.trackersCount,
          thirdPartiesCount: data.thirdPartiesCount || existing.thirdPartiesCount,
          requestsCount: data.requestsCount || existing.requestsCount,
          permissions: JSON.stringify(data.permissions || []),
          trackers: JSON.stringify(data.trackers || []),
          cookies: JSON.stringify(data.cookies || []),
          aiAnalysis: analysis,
          lastSeenAt: new Date(), // Update Zeitstempel
        },
      });
      console.log('✅ Gecachte Analyse aktualisiert für:', domain);
    } else {
      // Erstelle neuen Eintrag
      await prisma.websiteVisit.create({
        data: {
          url,
          title: data.title || '',
          domain,
          cookiesCount: data.cookiesCount || 0,
          trackersCount: data.trackersCount || 0,
          thirdPartiesCount: data.thirdPartiesCount || 0,
          requestsCount: data.requestsCount || 0,
          permissions: JSON.stringify(data.permissions || []),
          trackers: JSON.stringify(data.trackers || []),
          cookies: JSON.stringify(data.cookies || []),
          aiAnalysis: analysis,
        },
      });
      console.log('✅ Neue Analyse gespeichert für:', domain);
    }
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
  }
}


