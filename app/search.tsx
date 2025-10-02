"use server";

import { createStreamableValue } from 'ai/rsc';
import { FirecrawlClient } from "@/lib/firecrawl";
import { LangGraphSearchEngine as SearchEngine, SearchEvent } from "@/lib/langgraph-search-engine";
import { cookies } from 'next/headers';

type LlmOptions = {
  apiKey?: string;
  baseURL?: string;
  modelFast?: string;
  modelQuality?: string;
  streamUsage?: boolean;
};

export async function search(
  query: string,
  context?: { query: string; response: string }[],
  firecrawlApiKey?: string,
  options?: { firecrawlApiUrl?: string; llm?: LlmOptions }
) {
  const stream = createStreamableValue<SearchEvent>();
  // Work on a local resolved copy of options to avoid undefined mutations
  const resolvedOptions: { firecrawlApiUrl?: string; llm?: LlmOptions } = options ? { ...options } : {};
  
  // Fallback to cookie-provided settings when not passed explicitly
  if (!options || !firecrawlApiKey) {
    try {
      const cookieStore = await cookies();
      const raw = cookieStore.get('firesearch_settings')?.value;
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw));
        if (!resolvedOptions.llm && parsed?.llm) resolvedOptions.llm = parsed.llm;
        if (!resolvedOptions.firecrawlApiUrl && parsed?.firecrawl?.apiUrl) resolvedOptions.firecrawlApiUrl = parsed.firecrawl.apiUrl;
        if (!firecrawlApiKey && parsed?.firecrawl?.apiKey) firecrawlApiKey = parsed.firecrawl.apiKey;
      }
    } catch {}
  }

  // Create FirecrawlClient with key and optional custom URL
  const firecrawl = new FirecrawlClient(firecrawlApiKey, resolvedOptions.firecrawlApiUrl);
  const searchEngine = new SearchEngine(firecrawl, { llm: resolvedOptions.llm });
  
  // Run search in background
  (async () => {
    try {
      // Stream events as they happen
      await searchEngine.search(query, (event) => {
        stream.update(event);
      }, context);
      
      stream.done();
    } catch (error) {
      stream.error(error);
    }
  })();

  return { stream: stream.value };
}