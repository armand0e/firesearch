import { Chat } from './chat-settings';
import Image from 'next/image';
import { SettingsButton } from '@/components/settings/SettingsProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { branding } from '@/config/branding';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { Sparkles } from '@/components/ui/sparkles';
import { MeteorEffect } from '@/components/ui/meteor-effect';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-white dark:from-black dark:via-orange-950/5 dark:to-black">
      {/* Animated background effects */}
      <AnimatedGridPattern className="opacity-30 dark:opacity-20" />
      <FloatingParticles className="opacity-40 dark:opacity-30" quantity={40} />
      
      {/* Header with glassmorphism */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl px-6 py-3 shadow-lg backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/20 dark:border-white/10">
            <div className="flex items-center justify-between">
              <a
                href={branding.logo.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={branding.logo.alt}
                className="transition-transform hover:scale-105 active:scale-95"
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
                <SettingsButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section with magical effects */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <MeteorEffect number={15} />
        
        <div className="max-w-5xl mx-auto text-center relative">
          {/* Floating orbs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-500/20 dark:bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-500/10 dark:bg-red-400/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
          
          <div className="relative">
            <Sparkles density={15} speed="medium">
              <h1 className="text-[3rem] lg:text-[5.5rem] font-black tracking-tighter leading-[0.85] opacity-0 animate-fade-up [animation-duration:700ms] [animation-delay:100ms] [animation-fill-mode:forwards]">
                <span className="relative inline-block px-4">
                  <span className={`relative z-10 text-transparent bg-clip-text bg-gradient-to-r ${branding.colors.gradientFrom} ${branding.colors.gradientVia} ${branding.colors.gradientTo} ${branding.colors.gradientFromDark} ${branding.colors.gradientViaDark} ${branding.colors.gradientToDark}`}>
                    {branding.appName}
                  </span>
                  {/* Multiple glow layers */}
                  <span className="absolute inset-0 blur-3xl opacity-40 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 dark:from-yellow-400 dark:via-red-400 dark:to-orange-400 -z-10 animate-pulse" />
                  <span className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-orange-500 to-red-500 dark:from-yellow-500 dark:to-red-400 -z-10" />
                </span>
                <span className="block mt-3 text-[2.5rem] lg:text-[3.5rem] text-gray-900 dark:text-white opacity-0 animate-fade-up [animation-duration:700ms] [animation-delay:300ms] [animation-fill-mode:forwards]">
                  {branding.appTagline}
                </span>
              </h1>
            </Sparkles>
            
            <p className="mt-10 text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto opacity-0 animate-fade-up [animation-duration:700ms] [animation-delay:500ms] [animation-fill-mode:forwards] leading-relaxed font-medium">
              {branding.appDescription.split('Firecrawl')[0]}
              <span className={`font-bold ${branding.colors.textPrimary} relative inline-block`}>
                Firecrawl
                <span className="absolute -inset-1 bg-orange-500/10 dark:bg-yellow-500/20 blur -z-10" />
              </span>
              {branding.appDescription.split('Firecrawl')[1].split('LangGraph')[0]}
              <span className={`font-bold ${branding.colors.textPrimary} relative inline-block`}>
                LangGraph
                <span className="absolute -inset-1 bg-orange-500/10 dark:bg-yellow-500/20 blur -z-10" />
              </span>
              {branding.appDescription.split('LangGraph')[1]}
            </p>

            {/* Feature badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3 opacity-0 animate-fade-up [animation-duration:700ms] [animation-delay:700ms] [animation-fill-mode:forwards]">
              {['AI-Powered', 'Real-time', 'Lightning Fast', 'Open Source'].map((feature) => (
                <span
                  key={feature}
                  className="glass-card px-4 py-2 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-md bg-white/50 dark:bg-white/10 border border-white/20 dark:border-white/10 shadow-sm hover:scale-105 transition-transform cursor-default"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content with floating card effect */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-3xl shadow-2xl backdrop-blur-2xl bg-white/80 dark:bg-black/50 border border-white/20 dark:border-white/10 p-1 hover:shadow-orange-500/10 transition-shadow duration-500">
            <div className="rounded-[1.4rem] overflow-hidden bg-gradient-to-b from-white/50 to-white/30 dark:from-black/30 dark:to-black/20">
              <Chat />
            </div>
          </div>
        </div>
      </div>

      {/* Footer with glassmorphism */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl px-6 py-4 backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/20 dark:border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                Powered by{' '}
                {branding.footer.poweredBy.map((service, index) => (
                  <span key={service.name}>
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${branding.colors.textPrimary} hover:opacity-80 font-semibold transition-all hover:underline`}
                    >
                      {service.name}
                    </a>
                    {index < branding.footer.poweredBy.length - 1 && ' and '}
                  </span>
                ))}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <a href="#" className={`hover:${branding.colors.textPrimary} transition-colors`}>Privacy</a>
                <span>•</span>
                <a href="#" className={`hover:${branding.colors.textPrimary} transition-colors`}>Terms</a>
                <span>•</span>
                <a href="#" className={`hover:${branding.colors.textPrimary} transition-colors`}>Docs</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
