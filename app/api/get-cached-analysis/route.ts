import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json({ error: 'Domain erforderlich' }, { status: 400 });
    }

    // Suche nach der letzten Analyse für diese Domain
    const cached = await prisma.websiteVisit.findFirst({
      where: {
        domain: domain,
        aiAnalysis: {
          not: null,
        },
      },
      orderBy: {
        visitedAt: 'desc',
      },
    });

    if (cached && cached.aiAnalysis) {
      // Cache ist gültig - sende zurück
      return NextResponse.json({
        analysis: cached.aiAnalysis,
        analyzedAt: cached.visitedAt,
        fromCache: true,
      });
    }

    // Keine gecachte Analyse gefunden
    return NextResponse.json({
      analysis: null,
      fromCache: false,
    });
  } catch (error) {
    console.error('Cache-Lookup Fehler:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden gecachter Daten' },
      { status: 500 }
    );
  }
}

