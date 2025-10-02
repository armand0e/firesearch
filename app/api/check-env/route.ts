import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Check cookie from Settings UI
  let cookieHasFirecrawlKey = false;
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get('firesearch_settings')?.value;
    if (raw) {
      const parsed = JSON.parse(decodeURIComponent(raw));
      cookieHasFirecrawlKey = Boolean(parsed?.firecrawl?.apiKey);
    }
  } catch {}

  const environmentStatus = {
    FIRECRAWL_API_KEY: !!process.env.FIRECRAWL_API_KEY || cookieHasFirecrawlKey,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
  };

  return NextResponse.json({ environmentStatus });
}