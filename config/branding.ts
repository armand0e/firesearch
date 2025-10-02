// Branding configuration - Customize your Firesearch instance

export const branding = {
  // App Name
  appName: 'Firesearch',
  appTagline: 'Deep Research',
  appDescription: 'AI-powered deep research combining Firecrawl web scraping with LangGraph intelligence',
  
  // Logo
  logo: {
    path: '/firecrawl-logo-with-fire.png',
    alt: 'Firecrawl Logo',
    width: 113,
    height: 24,
    url: 'https://firecrawl.dev'
  },
  
  // Colors - Tailwind class names
  colors: {
    primary: 'orange', // orange, blue, purple, green, red, etc.
    accent: 'red',
    
    // Gradient (for hero title)
    gradientFrom: 'from-orange-600',
    gradientVia: 'via-red-600',
    gradientTo: 'to-yellow-600',
    gradientFromDark: 'dark:from-orange-400',
    gradientViaDark: 'dark:via-red-500',
    gradientToDark: 'dark:to-yellow-500',
    
    // Button colors
    buttonBg: 'bg-orange-500',
    buttonHover: 'hover:bg-orange-600',
    buttonDisabled: 'disabled:bg-gray-300',
    
    // Status colors
    statusActive: 'orange',
    statusComplete: 'green',
    statusIdle: 'gray',
    
    // Border and accent colors
    borderPrimary: 'border-orange-200 dark:border-orange-900/40',
    bgPrimary: 'bg-orange-50 dark:bg-orange-900/10',
    textPrimary: 'text-orange-600 dark:text-orange-400'
  },
  
  // Links
  links: {
    github: 'https://github.com/mendableai/firesearch',
    homepage: 'https://firecrawl.dev',
    firecrawl: 'https://firecrawl.dev',
    langgraph: 'https://www.langchain.com/langgraph'
  },
  
  // Footer
  footer: {
    poweredBy: [
      { name: 'Firecrawl', url: 'https://firecrawl.dev' },
      { name: 'LangGraph', url: 'https://www.langchain.com/langgraph' }
    ]
  },
  
  // Suggested queries
  suggestedQueries: [
    'Who are the founders of Firecrawl?',
    'When did NVIDIA release the RTX 4080 Super?',
    "Compare the latest iPhone 16 and Samsung Galaxy S25",
    "Compare Claude 4 to OpenAI's o3",
  ]
} as const;

// Helper function to get a color class
export function getColorClass(type: 'primary' | 'accent' | 'button' | 'status', variant?: string) {
  const { colors } = branding;
  
  switch (type) {
    case 'primary':
      return `${colors.primary}-${variant || '500'}`;
    case 'accent':
      return `${colors.accent}-${variant || '500'}`;
    case 'button':
      return `${colors.buttonBg} ${colors.buttonHover}`;
    case 'status':
      switch (variant) {
        case 'active':
          return colors.statusActive;
        case 'complete':
          return colors.statusComplete;
        default:
          return colors.statusIdle;
      }
    default:
      return '';
  }
}
