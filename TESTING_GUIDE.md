# 🧪 Firesearch Testing Guide

Quick guide to test all the new DeepResearch-inspired features.

## 🚀 Quick Start

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

## ✅ Feature Testing Checklist

### 1. Hero Section Enhancements
**What to test**: Visual improvements and animations

**Steps**:
1. Load the homepage
2. Observe the staggered fade-up animations:
   - "Firesearch" title (150ms delay)
   - "Deep Research" subtitle (350ms delay)
   - Description text (550ms delay)
3. Check for glow effect behind "Firesearch"
4. Verify gradient colors: orange → red → yellow

**Expected**: Smooth, sequential animations with no flickering

---

### 2. Collapsible Research Plan
**What to test**: Plan card functionality

**Steps**:
1. Start a search query (e.g., "Who are the founders of Firecrawl?")
2. Wait for the research plan to appear at the top
3. Look for the gradient card with "P" badge
4. Click the dropdown arrow to collapse
5. Click again to expand
6. Hover over the card

**Expected**: 
- ✅ Plan appears in a gradient card
- ✅ Smooth collapse/expand animations
- ✅ Hover shows subtle shadow
- ✅ Plan does NOT appear twice in the progress list

---

### 3. Settings Integration
**What to test**: Settings dialog and persistence

**Steps**:
1. Click "Settings" button in header
2. Configure LLM provider:
   - Change provider to "OpenRouter"
   - Enter API key: `sk-test-key`
   - Set base URL: `https://openrouter.ai/api/v1`
3. Configure Firecrawl:
   - Enter API key: `fc-test-key`
   - Set API URL: `https://api.firecrawl.dev`
4. Click "Save"
5. Refresh the page
6. Open Settings again

**Expected**: 
- ✅ All settings persist after refresh
- ✅ Settings stored in localStorage
- ✅ Cookie `firesearch_settings` created

---

### 4. Search Functionality
**What to test**: End-to-end search with custom settings

**Steps**:
1. Configure valid Firecrawl and OpenAI keys in Settings
2. Enter query: "What are the latest features in Next.js 15?"
3. Observe the search progress:
   - Progress sidebar shows steps
   - Sources are found and analyzed
   - Real-time updates stream in
4. Wait for final result
5. Check citations and follow-up questions

**Expected**:
- ✅ Progress sidebar updates in real-time
- ✅ Sources show favicons
- ✅ Final answer renders with markdown
- ✅ Citations are clickable
- ✅ Follow-up questions work

---

### 5. Enhanced Source Lines (If Implemented)
**What to test**: Hover-reveal "Open" links

**Steps**:
1. Start a search
2. When sources appear in the progress pane
3. Hover over any source line
4. Look for "Open" link with icon
5. Click the "Open" link

**Expected**:
- ✅ "Open" link fades in on hover
- ✅ External link icon shows
- ✅ Opens source in new tab
- ✅ Smooth hover transitions

---

### 6. Dark Mode
**What to test**: Theme switching

**Steps**:
1. Toggle system dark mode (or browser extension)
2. Check all components:
   - Hero gradients
   - Research plan card
   - Progress sidebar
   - Settings dialog
3. Verify contrast and readability

**Expected**:
- ✅ All text is readable
- ✅ Gradients adjust to dark theme
- ✅ Borders remain visible
- ✅ No flashing during mode switch

---

### 7. Responsive Design
**What to test**: Mobile/tablet layouts

**Steps**:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at breakpoints:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1024px
4. Check hero typography scaling
5. Verify settings dialog width

**Expected**:
- ✅ Hero title scales down (4.5rem → 2.5rem)
- ✅ No horizontal scroll
- ✅ Buttons remain accessible
- ✅ Settings dialog fits screen

---

### 8. Animations Performance
**What to test**: Smooth animations without jank

**Steps**:
1. Open Chrome DevTools → Performance tab
2. Start recording
3. Load homepage
4. Let animations complete
5. Start a search
6. Stop recording
7. Check for frame drops (green bars should be consistent)

**Expected**:
- ✅ Consistent 60 FPS
- ✅ No layout shifts (CLS < 0.1)
- ✅ No long tasks (< 50ms)

---

### 9. Accessibility
**What to test**: Screen reader and keyboard navigation

**Steps**:
1. Tab through the page with keyboard only
2. Verify focus indicators are visible
3. Check aria-labels on icon buttons:
   - Settings button
   - Search submit button
   - Close buttons
   - Collapse/expand buttons
4. Test with screen reader (NVDA/JAWS)

**Expected**:
- ✅ All interactive elements are tabbable
- ✅ Focus indicators are visible
- ✅ aria-labels are descriptive
- ✅ Form inputs have labels

---

### 10. Edge Cases
**What to test**: Error handling and edge cases

**Steps**:
1. **No API Keys**: Try searching without keys
   - Expected: Settings dialog opens, query pending
2. **Invalid Keys**: Enter invalid keys
   - Expected: Graceful error message
3. **Network Offline**: Disconnect and search
   - Expected: Error state, not crash
4. **Very Long Query**: Enter 500-character query
   - Expected: Input handles long text
5. **Special Characters**: Search with `<script>alert('xss')</script>`
   - Expected: Safely escaped

**Expected**: No crashes, helpful error messages

---

## 🐛 Known Issues to Watch For

### CSS Lint Warnings (Safe to Ignore)
- `@custom-variant`, `@theme`, `@apply`: Tailwind directives
- `scrollbar-width`: Progressive enhancement
- `-webkit-backdrop-filter` order: Intentional for compatibility

### TypeScript Warnings
- `chat-settings.tsx:375`: Check `useCallback` dependency array closure

### Browser Compatibility
- Backdrop blur: Not supported in Firefox < 103 (graceful fallback)
- `scrollbar-width: none`: Not in Safari (uses `::-webkit-scrollbar`)

---

## 📊 Performance Benchmarks

### Target Metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTI** (Time to Interactive): < 3.5s

### Test with Lighthouse:
```bash
# In Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Performance" + "Accessibility"
4. Click "Analyze page load"
```

**Target Scores**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

---

## 🔧 Debugging Tips

### Check Console Errors
```bash
# Open browser console (F12)
# Look for:
- Red errors
- Yellow warnings
- Network failures
```

### Verify Cookie Persistence
```javascript
// In browser console:
document.cookie.split(';').find(c => c.includes('firesearch_settings'))

// Expected output:
// " firesearch_settings={...encoded JSON...}"
```

### Check LocalStorage
```javascript
// In browser console:
localStorage.getItem('firesearch:settings:v1')

// Expected output:
// "{"llm":{...},"firecrawl":{...}}"
```

### Verify Server Actions
```bash
# In terminal/logs:
# Look for:
- "cookies() should be awaited" warnings
- API call success/failures
- Search engine initialization
```

---

## 🎯 Acceptance Criteria

Before merging/deploying, ensure:

- [ ] All animations are smooth (60 FPS)
- [ ] Research plan card works (collapse/expand)
- [ ] Settings persist after refresh
- [ ] Search completes with valid keys
- [ ] Dark mode works correctly
- [ ] Mobile layout is responsive
- [ ] No console errors on load
- [ ] Lighthouse score > 90 (performance)
- [ ] Accessibility score > 95
- [ ] All lint warnings addressed or documented

---

## 📞 Support

**Found a bug?**
1. Check [DEEPRESEARCH_UI_SUMMARY.md](./DEEPRESEARCH_UI_SUMMARY.md) for known issues
2. Open an issue on GitHub with:
   - Browser and version
   - Steps to reproduce
   - Screenshots/video
   - Console errors

**Need help?**
- Check the [README.md](./README.md) for setup
- Review [.env.example](./.env.example) for environment variables
- Consult Firecrawl docs: https://docs.firecrawl.dev

---

**Happy Testing! 🚀**
