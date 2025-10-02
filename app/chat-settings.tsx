'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { search } from './search';
import { readStreamableValue } from 'ai/rsc';
import { SearchDisplay } from './search-display';
import { SearchEvent, Source } from '@/lib/langgraph-search-engine';
import { MarkdownRenderer } from './markdown-renderer';
import { CitationTooltip } from './citation-tooltip';
import Image from 'next/image';
import { getFaviconUrl, getDefaultFavicon, markFaviconFailed } from '@/lib/favicon-utils';
import { useSettings } from '@/components/settings/SettingsProvider';

const SUGGESTED_QUERIES = [
  'Who are the founders of Firecrawl?',
  'When did NVIDIA release the RTX 4080 Super?',
  "Compare the latest iPhone 16 and Samsung Galaxy S25",
  "Compare Claude 4 to OpenAI's o3",
];

function SourcesList({ sources }: { sources: Source[] }) {
  const [showSourcesPanel, setShowSourcesPanel] = useState(false);
  const [expandedSourceIndex, setExpandedSourceIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex -space-x-2">
          {(() => {
            const uniqueDomains = new Map<string, Source>();
            sources.forEach((source) => {
              try {
                const domain = new URL(source.url).hostname;
                if (!uniqueDomains.has(domain)) uniqueDomains.set(domain, source);
              } catch {}
            });
            const uniqueSources = Array.from(uniqueDomains.values());

            return (
              <>
                {uniqueSources.slice(0, 5).map((source, i) => (
                  <Image
                    key={i}
                    src={getFaviconUrl(source.url)}
                    alt=""
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-white"
                    style={{ zIndex: 5 - i }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = getDefaultFavicon(24);
                      markFaviconFailed(source.url);
                    }}
                  />
                ))}
                {uniqueSources.length > 5 && (
                  <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                      +{uniqueSources.length - 5}
                    </span>
                  </div>
                )}
              </>
            );
          })()}
        </div>
        <button
          onClick={() => setShowSourcesPanel(true)}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-2"
        >
          <span>View {sources.length} sources & page contents</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {showSourcesPanel && <div className="fixed inset-0 z-30" onClick={() => setShowSourcesPanel(false)} />}

      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${showSourcesPanel ? 'translate-x-0' : 'translate-x-full'} z-40 overflow-y-auto scrollbar-hide`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Sources ({sources.length})</h3>
            <button
              onClick={() => setShowSourcesPanel(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close sources panel"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            {sources.map((source, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors">
                <div
                  className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${expandedSourceIndex === i ? '' : 'rounded-lg'}`}
                  onClick={() => setExpandedSourceIndex(expandedSourceIndex === i ? null : i)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-medium text-orange-600 mt-0.5">[{i + 1}]</span>
                    <Image
                      src={getFaviconUrl(source.url)}
                      alt=""
                      width={20}
                      height={20}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = getDefaultFavicon(20);
                        markFaviconFailed(source.url);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sm text-gray-900 dark:text-gray-100 hover:text-orange-600 dark:hover:text-orange-400 line-clamp-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {source.title}
                      </a>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{new URL(source.url).hostname}</p>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedSourceIndex === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {expandedSourceIndex === i && source.content && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{source.content.length.toLocaleString()} characters</span>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto scrollbar-hide">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <MarkdownRenderer content={source.content} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function DeepResearchPanel({ events }: { events: SearchEvent[] }) {
  const [isPlanExpanded, setIsPlanExpanded] = useState(true);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const plan = useMemo(() => {
    const ev = events.find(
      (e) => e.type === 'thinking' && (e.message.includes('###') || e.message.includes('**'))
    );
    return ev && ev.type === 'thinking' ? ev.message : null;
  }, [events]);
  
  const filteredEvents = useMemo(() => {
    if (!plan) return events;
    return events.filter((e) => !(e.type === 'thinking' && e.message === plan));
  }, [events, plan]);

  // Calculate research status
  const researchStatus = useMemo(() => {
    const finalResult = events.find(e => e.type === 'final-result');
    if (finalResult) return { status: 'complete', label: 'Complete', color: 'green' };
    
    const latestPhase = events.findLast(e => e.type === 'phase-update');
    if (latestPhase && latestPhase.type === 'phase-update') {
      const phaseLabels: Record<string, string> = {
        understanding: 'Understanding',
        planning: 'Planning',
        searching: 'Searching',
        analyzing: 'Analyzing',
        synthesizing: 'Synthesizing'
      };
      return { status: 'active', label: phaseLabels[latestPhase.phase] || 'Processing', color: 'orange' };
    }
    
    return { status: 'idle', label: 'Idle', color: 'gray' };
  }, [events]);

  // Calculate progress percentage
  const progress = useMemo(() => {
    const phases = ['understanding', 'planning', 'searching', 'analyzing', 'synthesizing', 'complete'];
    const latestPhase = events.findLast(e => e.type === 'phase-update');
    if (latestPhase && latestPhase.type === 'phase-update') {
      const currentIndex = phases.indexOf(latestPhase.phase);
      return Math.round(((currentIndex + 1) / phases.length) * 100);
    }
    return 0;
  }, [events]);

  // Count sources found
  const sourcesCount = useMemo(() => {
    const foundEvents = events.filter(e => e.type === 'found');
    return foundEvents.reduce((acc, event) => {
      return acc + (event.type === 'found' ? event.sources.length : 0);
    }, 0);
  }, [events]);

  // Update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {plan && (
        <div className="group relative border border-orange-200 dark:border-orange-900/40 rounded-2xl bg-gradient-to-br from-orange-50/90 via-orange-50/70 to-orange-100/50 dark:from-orange-900/15 dark:via-orange-900/8 dark:to-orange-900/10 p-5 shadow-lg backdrop-blur-md transition-all duration-500 hover:shadow-xl hover:scale-[1.01] hover:border-orange-300 dark:hover:border-orange-800">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-orange-100/20 to-transparent dark:via-orange-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer shimmer-bg" />
          
          {/* Header */}
          <div className="relative flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              {/* Animated badge */}
              <div className="relative">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white text-sm font-bold shadow-lg animate-pulse-glow">
                  P
                </span>
                {researchStatus.status === 'active' && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                )}
              </div>
              
              {/* Title and status */}
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Research Plan</span>
                <div className="flex items-center gap-2 mt-0.5">
                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    researchStatus.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    researchStatus.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {researchStatus.status === 'active' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    )}
                    {researchStatus.label}
                  </span>
                  
                  {/* Progress percentage */}
                  {progress > 0 && researchStatus.status !== 'complete' && (
                    <span className="text-[10px] font-mono font-semibold text-orange-600 dark:text-orange-400">
                      {progress}%
                    </span>
                  )}
                  
                  {/* Time elapsed */}
                  <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                    {formatTime(elapsedTime)}
                  </span>
                  
                  {/* Sources count */}
                  {sourcesCount > 0 && (
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      • {sourcesCount} sources
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Expand/collapse button */}
            <button
              onClick={() => setIsPlanExpanded(!isPlanExpanded)}
              className="p-2 hover:bg-orange-100/80 dark:hover:bg-orange-900/30 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label={isPlanExpanded ? "Collapse plan" : "Expand plan"}
            >
              <svg 
                className={`w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${isPlanExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          {progress > 0 && researchStatus.status !== 'complete' && (
            <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer shimmer-bg" />
              </div>
            </div>
          )}
          
          {/* Content */}
          <div 
            className={`overflow-hidden transition-all duration-500 ease-out ${isPlanExpanded ? 'max-h-[32rem] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none overflow-y-auto scrollbar-hide max-h-28rem">
              <MarkdownRenderer content={plan || ''} />
            </div>
          </div>
          
          {/* Keyboard hint */}
          {isPlanExpanded && (
            <div className="mt-4 pt-3 border-t border-orange-200/50 dark:border-orange-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[9px] font-mono border border-gray-300 dark:border-gray-700">↑</kbd>
                <span>Collapse to see more details</span>
              </p>
            </div>
          )}
        </div>
      )}
      <SearchDisplay events={filteredEvents} />
    </div>
  );
}

export function Chat() {
  const { settings, openSettings } = useSettings();
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string | React.ReactNode; isSearch?: boolean; searchResults?: string }>>([]);
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasShownSuggestions, setHasShownSuggestions] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [pendingQuery, setPendingQuery] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        const res = await fetch('/api/check-env');
        const data = await res.json();
        if (data.environmentStatus) {
          const envHasKey: boolean = data.environmentStatus.FIRECRAWL_API_KEY;
          setHasApiKey(Boolean(envHasKey || settings.firecrawl.apiKey));
        }
      } catch {
        setHasApiKey(Boolean(settings.firecrawl.apiKey));
      }
    };
    checkEnvironment();
  }, [settings.firecrawl.apiKey]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleFollowUp = (event: Event) => {
      const ce = event as CustomEvent;
      const q = ce.detail.question as string;
      setInput(q);
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 100);
    };
    document.addEventListener('followUpQuestion', handleFollowUp);
    return () => document.removeEventListener('followUpQuestion', handleFollowUp);
  }, []);

  const performSearch = useCallback(async (query: string) => {
    setIsSearching(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const events: SearchEvent[] = [];
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: 'assistant', content: <DeepResearchPanel events={events} />, isSearch: true },
    ]);

    try {
      const conversationContext: Array<{ query: string; response: string }> = [];
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (msg.role === 'user' && i + 1 < messages.length) {
          const nextMsg = messages[i + 1];
          if (nextMsg.role === 'assistant' && nextMsg.searchResults) {
            conversationContext.push({ query: msg.content as string, response: nextMsg.searchResults });
          }
        }
      }

      const { stream } = await search(query, conversationContext, settings.firecrawl.apiKey || undefined, {
        firecrawlApiUrl: settings.firecrawl.apiUrl,
        llm: {
          apiKey: settings.llm.apiKey,
          baseURL: settings.llm.baseURL,
          modelFast: settings.llm.modelFast,
          modelQuality: settings.llm.modelQuality,
          streamUsage: settings.llm.streamUsage,
        },
      });

      let finalContent = '';
      let streamingStarted = false;
      const resultMsgId = (Date.now() + 2).toString();

      for await (const event of readStreamableValue(stream)) {
        if (!event) continue;
        events.push(event);

        if (event.type === 'content-chunk') {
          const content = events
            .filter((e) => e.type === 'content-chunk')
            .map((e) => (e.type === 'content-chunk' ? e.chunk : ''))
            .join('');

          if (!streamingStarted) {
            streamingStarted = true;
            setMessages((prev) => [
              ...prev,
              { id: resultMsgId, role: 'assistant', content: <MarkdownRenderer content={content} streaming={true} />, isSearch: false },
            ]);
          } else {
            setMessages((prev) =>
              prev.map((m) => (m.id === resultMsgId ? { ...m, content: <MarkdownRenderer content={content} streaming={true} /> } : m)),
            );
          }
        }

        if (event.type === 'final-result') {
          finalContent = event.content;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === resultMsgId
                ? {
                    ...m,
                    content: (
                      <div className="space-y-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <MarkdownRenderer content={finalContent} />
                        </div>
                        <CitationTooltip sources={event.sources || []} />
                        {event.followUpQuestions && event.followUpQuestions.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Follow-up questions</h3>
                            <div className="space-y-2">
                              {event.followUpQuestions.map((question, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    const evt = new CustomEvent('followUpQuestion', { detail: { question }, bubbles: true });
                                    document.dispatchEvent(evt);
                                  }}
                                  className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                                      {question}
                                    </span>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <SourcesList sources={event.sources || []} />
                      </div>
                    ),
                    searchResults: finalContent,
                  }
                : m,
            ),
          );
        }

        setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? { ...m, content: <DeepResearchPanel events={[...events]} />, searchResults: finalContent } : m)));
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
      const msg = error instanceof Error ? error.message : 'An error occurred during search';
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: (
            <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-medium">Search Error</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{msg}</p>
            </div>
          ),
          isSearch: false,
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  }, [messages, settings]);

  useEffect(() => {
    if (pendingQuery && hasApiKey) {
      performSearch(pendingQuery);
      setPendingQuery('');
    }
  }, [hasApiKey, pendingQuery, performSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSearching) return;
    setShowSuggestions(false);

    const userMessage = input;
    setInput('');

    if (!hasApiKey) {
      setPendingQuery(userMessage);
      openSettings();
      const userMsgId = Date.now().toString();
      setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: userMessage, isSearch: true }]);
      return;
    }

    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: userMessage, isSearch: true }]);

    await performSearch(userMessage);
  };

  return (
    <div className="flex flex-col flex-1">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => {
                    if (!hasShownSuggestions && messages.length === 0) {
                      setShowSuggestions(true);
                      setHasShownSuggestions(true);
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Enter query..."
                  className="w-full h-14 rounded-full border border-zinc-200 bg-white pl-6 pr-16 text-base text-gray-900 dark:text-gray-100 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-orange-400 shadow-sm"
                  disabled={isSearching}
                />
                <button
                  type="submit"
                  disabled={isSearching || !input.trim()}
                  className="absolute right-2 top-2 h-10 w-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  aria-label="Search"
                >
                  {isSearching ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>

                {showSuggestions && !input && messages.length === 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="p-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">Try searching for:</p>
                      {SUGGESTED_QUERIES.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setInput(suggestion)}
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="line-clamp-1">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto scrollbar-hide px-4 sm:px-6 lg:px-8 py-6" ref={messagesContainerRef}>
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`${msg.role === 'user' ? 'flex justify-end' : 'w-full'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-2xl">
                      <span className="inline-block px-5 py-3 rounded-2xl bg-[#FBFAF9] dark:bg-zinc-800 text-[#36322F] dark:text-zinc-100">
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full">{msg.content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => {
                    if (!hasShownSuggestions) {
                      setShowSuggestions(true);
                      setHasShownSuggestions(true);
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Enter query..."
                  className="w-full h-14 rounded-full border border-zinc-200 bg-white pl-6 pr-16 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-orange-400 shadow-sm"
                  disabled={isSearching}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Search"
                >
                  {isSearching ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  )}
                </button>

                {showSuggestions && !input && (
                  <div className="absolute bottom-full mb-2 w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="p-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">Try searching for:</p>
                      {SUGGESTED_QUERIES.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setInput(suggestion)}
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="line-clamp-1">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
