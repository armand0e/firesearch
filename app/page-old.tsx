import { Chat } from './chat-settings';
import Image from 'next/image';
import { SettingsButton } from '@/components/settings/SettingsProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { branding } from '@/config/branding';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logo */}
      <header className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a
            href={branding.logo.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={branding.logo.alt}
          >
            <Image
              src={branding.logo.path}
              alt={branding.logo.alt}
              width={branding.logo.width}
              height={branding.logo.height}
              className="w-[113px] h-auto"
            />
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="https://github.com/mendableai/firesearch"
              target="_blank"
              rel="noopener noreferrer"
              className="justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none rounded-[10px] text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-[#36322F] text-[#fff] hover:bg-[#4a4542] disabled:bg-[#8c8885] disabled:hover:bg-[#8c8885] [box-shadow:inset_0px_-2.108433723449707px_0px_0px_#171310,_0px_1.2048193216323853px_6.325301647186279px_0px_rgba(58,_33,_8,_58%)] hover:translate-y-[1px] hover:scale-[0.98] hover:[box-shadow:inset_0px_-1px_0px_0px_#171310,_0px_1px_3px_0px_rgba(58,_33,_8,_40%)] active:translate-y-[2px] active:scale-[0.97] active:[box-shadow:inset_0px_1px_1px_0px_#171310,_0px_1px_2px_0px_rgba(58,_33,_8,_30%)] disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:scale-100 h-10 px-4 py-2 font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Use this template
            </a>
            <SettingsButton />
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/30 via-transparent to-transparent dark:from-orange-950/10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="text-[2.5rem] lg:text-[4.5rem] text-[#36322F] dark:text-white font-bold tracking-tight leading-[0.85] opacity-0 animate-fade-up [animation-duration:600ms] [animation-delay:150ms] [animation-fill-mode:forwards]">
            <span className="relative inline-block px-2">
              <span className={`relative z-10 text-transparent bg-clip-text bg-gradient-to-r ${branding.colors.gradientFrom} ${branding.colors.gradientVia} ${branding.colors.gradientTo} ${branding.colors.gradientFromDark} ${branding.colors.gradientViaDark} ${branding.colors.gradientToDark}`}>
                {branding.appName}
              </span>
              {/* Glow effect */}
              <span className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-orange-400 to-red-400 -z-10" aria-hidden="true" />
            </span>
            <span className="block mt-2 text-[2rem] lg:text-[3rem] opacity-0 animate-fade-up [animation-duration:600ms] [animation-delay:350ms] [animation-fill-mode:forwards]">
              {branding.appTagline}
            </span>
          </h1>
          <p className="mt-8 text-base lg:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto opacity-0 animate-fade-up [animation-duration:600ms] [animation-delay:550ms] [animation-fill-mode:forwards] leading-relaxed">
            {branding.appDescription.split('Firecrawl')[0]}
            <span className={`font-semibold ${branding.colors.textPrimary}`}>Firecrawl</span>
            {branding.appDescription.split('Firecrawl')[1].split('LangGraph')[0]}
            <span className={`font-semibold ${branding.colors.textPrimary}`}>LangGraph</span>
            {branding.appDescription.split('LangGraph')[1]}
          </p>
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="flex-1">
        {/* Chat component */}
        <Chat />
      </div>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by{' '}
            {branding.footer.poweredBy.map((service, index) => (
              <span key={service.name}>
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${branding.colors.textPrimary} hover:opacity-80 font-medium transition-opacity`}
                >
                  {service.name}
                </a>
                {index < branding.footer.poweredBy.length - 1 && ' and '}
              </span>
            ))}
          </p>
        </div>
      </footer>
    </div>
  );
}