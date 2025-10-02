# 🎨 Branding & Customization Guide

Complete guide to customize Firesearch with your own branding, colors, and dark mode.

## 🌓 Dark Mode

### Features
- ✅ **Auto-detect**: Respects system preferences
- ✅ **Manual toggle**: Sun/Moon icon in header
- ✅ **Persistent**: Saves preference to localStorage
- ✅ **Smooth transitions**: 200ms animated toggle
- ✅ **No flicker**: Prevents hydration mismatch

### Usage
The dark mode toggle is automatically added to the header. Users can:
1. Click the sun/moon icon to toggle
2. Their preference is saved automatically
3. Returns to their preference on reload

### Customization
Edit `components/ThemeToggle.tsx` to change:
- Icon styles
- Button appearance
- Animation timing
- Default theme

---

## 🎨 Branding System

All branding is centralized in `config/branding.ts` for easy customization.

### Quick Start

**File**: `config/branding.ts`

```typescript
export const branding = {
  appName: 'YourApp',           // Change the app name
  appTagline: 'Your Tagline',   // Hero subtitle
  appDescription: '...',         // Hero description
  // ... more options
}
```

---

## 📝 Customization Options

### 1. App Identity

```typescript
branding.appName = 'DeepSearch';           // Main title
branding.appTagline = 'AI Research';       // Subtitle
branding.appDescription = 'Your custom description...';
```

**Result**: Updates hero section, page title, and metadata.

---

### 2. Logo

```typescript
branding.logo = {
  path: '/your-logo.png',    // Logo file path
  alt: 'Your Logo',          // Alt text
  width: 150,                // Width in pixels
  height: 40,                // Height in pixels
  url: 'https://yoursite.com' // Click destination
}
```

**Steps**:
1. Add your logo to `public/your-logo.png`
2. Update the config
3. Refresh the page

---

### 3. Color Schemes

#### Primary Colors
```typescript
branding.colors = {
  primary: 'blue',      // blue, purple, green, pink, etc.
  accent: 'indigo',     // Accent color
  
  // ... more color options
}
```

#### Supported Colors
- `orange` (default)
- `blue`
- `purple`
- `green`
- `red`
- `pink`
- `indigo`
- `teal`
- `cyan`

#### Gradient (Hero Title)
```typescript
branding.colors = {
  gradientFrom: 'from-blue-600',
  gradientVia: 'via-purple-600',
  gradientTo: 'to-pink-600',
  
  // Dark mode variants
  gradientFromDark: 'dark:from-blue-400',
  gradientViaDark: 'dark:via-purple-500',
  gradientToDark: 'dark:to-pink-500',
}
```

**Example Color Schemes**:

```typescript
// Professional Blue
{
  gradientFrom: 'from-blue-600',
  gradientVia: 'via-cyan-600',
  gradientTo: 'to-teal-600',
}

// Vibrant Purple
{
  gradientFrom: 'from-purple-600',
  gradientVia: 'via-pink-600',
  gradientTo: 'to-rose-600',
}

// Nature Green
{
  gradientFrom: 'from-green-600',
  gradientVia: 'via-emerald-600',
  gradientTo: 'to-teal-600',
}
```

---

### 4. Buttons

```typescript
branding.colors = {
  buttonBg: 'bg-blue-500',          // Button background
  buttonHover: 'hover:bg-blue-600', // Hover state
  buttonDisabled: 'disabled:bg-gray-300',
}
```

Updates all primary action buttons throughout the app.

---

### 5. Status Colors

```typescript
branding.colors = {
  statusActive: 'blue',    // Research in progress
  statusComplete: 'green', // Research complete
  statusIdle: 'gray',      // No activity
}
```

Controls the Research Plan card status indicators.

---

### 6. Links

```typescript
branding.links = {
  github: 'https://github.com/yourusername/yourrepo',
  homepage: 'https://yoursite.com',
  firecrawl: 'https://firecrawl.dev',
  langgraph: 'https://www.langchain.com/langgraph'
}
```

Updates all external links in the app.

---

### 7. Footer

```typescript
branding.footer = {
  poweredBy: [
    { name: 'Your Service', url: 'https://yourservice.com' },
    { name: 'Another Service', url: 'https://another.com' }
  ]
}
```

Customizes the "Powered by" section.

---

### 8. Suggested Queries

```typescript
branding.suggestedQueries = [
  'Your first suggested query',
  'Another interesting query',
  'A third query example',
  'One more query',
]
```

Updates the dropdown suggestions in the search input.

---

## 🎯 Example Configurations

### Tech Startup

```typescript
export const branding = {
  appName: 'ResearchAI',
  appTagline: 'Deep Intelligence',
  appDescription: 'AI-powered research platform for modern teams',
  
  colors: {
    primary: 'blue',
    gradientFrom: 'from-blue-600',
    gradientVia: 'via-cyan-600',
    gradientTo: 'to-teal-600',
    gradientFromDark: 'dark:from-blue-400',
    gradientViaDark: 'dark:via-cyan-400',
    gradientToDark: 'dark:to-teal-400',
  },
  
  logo: {
    path: '/researchai-logo.png',
    alt: 'ResearchAI',
    url: 'https://researchai.com'
  }
}
```

### Academic Institution

```typescript
export const branding = {
  appName: 'Scholar Search',
  appTagline: 'Academic Research',
  appDescription: 'Comprehensive research tool for academic excellence',
  
  colors: {
    primary: 'indigo',
    gradientFrom: 'from-indigo-600',
    gradientVia: 'via-purple-600',
    gradientTo: 'to-violet-600',
  },
  
  suggestedQueries: [
    'Latest research in quantum computing',
    'Climate change studies 2024',
    'Machine learning breakthroughs',
    'Medical research advances',
  ]
}
```

### Creative Agency

```typescript
export const branding = {
  appName: 'CreativeMinds',
  appTagline: 'Research & Insights',
  appDescription: 'Discover trends and insights for creative campaigns',
  
  colors: {
    primary: 'pink',
    gradientFrom: 'from-pink-600',
    gradientVia: 'via-rose-600',
    gradientTo: 'to-orange-600',
  }
}
```

---

## 🚀 Advanced Customization

### Custom Components

Want more control? Edit these files directly:

1. **Header**: `app/page.tsx` (lines 10-40)
2. **Hero**: `app/page.tsx` (lines 45-71)
3. **Footer**: `app/page.tsx` (lines 80-99)
4. **Theme Toggle**: `components/ThemeToggle.tsx`

### Add Your Logo

```bash
# 1. Add your logo file
cp your-logo.png public/

# 2. Update branding config
# Edit config/branding.ts

# 3. Refresh browser
```

### Custom Favicon

```bash
# Replace these files in /public:
- favicon.ico
- icon.svg
- apple-icon.png
```

---

## 🎨 Color Reference

### Tailwind Colors Available

All Tailwind colors work:
- `slate`, `gray`, `zinc`, `neutral`, `stone`
- `red`, `orange`, `amber`, `yellow`, `lime`
- `green`, `emerald`, `teal`, `cyan`, `sky`
- `blue`, `indigo`, `violet`, `purple`, `fuchsia`
- `pink`, `rose`

### Shade Ranges
- `50` - Lightest
- `100` - Very Light
- `200-400` - Light
- `500` - Base (default)
- `600-700` - Dark
- `800-900` - Very Dark
- `950` - Darkest

---

## 📱 Responsive Design

All branding automatically adapts to:
- **Mobile**: Compact layout, smaller text
- **Tablet**: Medium sizing
- **Desktop**: Full size with animations
- **Dark Mode**: Optimized colors for both themes

---

## ✅ Checklist

Before going live, customize:

- [ ] App name and tagline
- [ ] Logo and favicon
- [ ] Color scheme (3-5 colors)
- [ ] Hero description
- [ ] Suggested queries
- [ ] External links
- [ ] Footer credits
- [ ] Test dark mode
- [ ] Test responsive design
- [ ] Verify all links work

---

## 🐛 Troubleshooting

### Logo Not Showing
- ✅ Check file exists in `/public`
- ✅ Verify file path in `branding.logo.path`
- ✅ Clear browser cache

### Colors Not Updating
- ✅ Make sure to use Tailwind format: `from-blue-600`
- ✅ Restart dev server: `npm run dev`
- ✅ Clear browser cache

### Dark Mode Not Working
- ✅ Check `ThemeToggle` is imported in `page.tsx`
- ✅ Verify `dark:` classes in Tailwind config
- ✅ Test localStorage: `localStorage.getItem('theme')`

---

## 📚 Resources

- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
- [Tailwind Gradients](https://tailwindcss.com/docs/gradient-color-stops)
- [Next.js Images](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)

---

## 🎉 Examples in the Wild

Want inspiration? Check out these color schemes:

**Firecrawl (default)**: Orange → Red → Yellow  
**Stripe**: Blue → Purple → Pink  
**Linear**: Indigo → Purple → Pink  
**Vercel**: Black → Gray → White  
**Notion**: Black with subtle accents  

---

**Need help?** Open an issue on GitHub or check the main README.md

**Happy Branding! 🎨**
