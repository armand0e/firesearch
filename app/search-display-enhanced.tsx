'use client';

import Image from 'next/image';
import { getFaviconUrl, getDefaultFavicon, markFaviconFailed } from '@/lib/favicon-utils';

// Enhanced SourceProcessingLine with inline "Open" link
export function SourceProcessingLineEnhanced({ url, stage, summary }: {
  url: string;
  stage: 'browsing' | 'extracting' | 'analyzing' | 'complete';
  summary?: string;
}) {
  const stageLabels = {
    browsing: 'Browsing',
    extracting: 'Extracting',
    analyzing: 'Analyzing',
    complete: 'Complete'
  };

  return (
    <div className="group flex items-start gap-2 text-xs py-1.5 animate-fade-in hover:bg-orange-50/30 dark:hover:bg-orange-900/5 rounded-lg px-2 -mx-2 transition-colors">
      <Image
        src={getFaviconUrl(url)}
        alt=""
        width={16}
        height={16}
        className="w-4 h-4 rounded flex-shrink-0 mt-0.5"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = getDefaultFavicon(16);
          markFaviconFailed(url);
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-700 dark:text-gray-300 truncate">
          {new URL(url).hostname}
        </div>
        {stage === 'complete' ? (
          summary ? (
            <div className="text-gray-500 dark:text-gray-500 mt-0.5 line-clamp-2">
              {summary}
            </div>
          ) : (
            <div className="flex items-center gap-1 mt-0.5">
              <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-500 dark:text-gray-500">
                Complete
              </span>
            </div>
          )
        ) : (
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-gray-500 dark:text-gray-500">
              {stageLabels[stage as keyof typeof stageLabels]}...
            </span>
          </div>
        )}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-[10px] font-medium text-orange-600 dark:text-orange-400 mt-0.5 flex items-center gap-0.5 hover:gap-1 hover:text-orange-700 dark:hover:text-orange-300"
        aria-label={`Open ${new URL(url).hostname}`}
        title="Open source"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <path d="M15 3h6v6" />
          <path d="M10 14L21 3" />
        </svg>
        <span>Open</span>
      </a>
    </div>
  );
}

// Sources ticker showing real-time analysis
export function SourcesTicker({ sources }: { sources: { url: string; stage: string }[] }) {
  if (sources.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 via-orange-100/50 to-orange-50 dark:from-orange-950/20 dark:via-orange-900/10 dark:to-orange-950/20 rounded-lg p-3 border border-orange-200/50 dark:border-orange-900/30">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Analyzing sources</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">({sources.length})</span>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {sources.slice(0, 10).map((source, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 flex-shrink-0 animate-fade-in-delay-${Math.min(i, 9)}`}
          >
            <Image
              src={getFaviconUrl(source.url)}
              alt=""
              width={14}
              height={14}
              className="w-3.5 h-3.5 rounded"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = getDefaultFavicon(14);
                markFaviconFailed(source.url);
              }}
            />
            <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium max-w-[120px] truncate">
              {new URL(source.url).hostname.replace('www.', '')}
            </span>
          </div>
        ))}
        {sources.length > 10 && (
          <div className="flex items-center px-2 py-1 text-[10px] text-gray-500 dark:text-gray-400">
            +{sources.length - 10} more
          </div>
        )}
      </div>
    </div>
  );
}
