# TODO: Reusable Components for Interview Prep App

## Design Reference
Location: `/root/.openclaw/workspace/tools/interview-nextjs/design-references/`
- DESIGN.md - Full design system documentation
- code.html - HTML implementation reference
- screen.png - Visual reference

## Components to Build

### 1. Question Card Component
**File:** `components/QuestionCard.tsx`
**Features:**
- Tonal layering (no borders)
- Technical glow on hover
- Level badges (Basic/Intermediate/Advanced)
- Expand/collapse answer
- Topic icons
- Metadata display

### 2. Filter Bar Component
**File:** `components/FilterBar.tsx`
**Features:**
- Icon-prefixed select dropdowns
- Search input with icon
- Clear filters button
- Responsive grid layout
- Focus states with subtle ring

### 3. Bulk Actions Bar Component
**File:** `components/BulkActionsBar.tsx`
**Features:**
- Checkbox selection
- Selected count display
- Approve/Reject selected actions
- Slide-in animation when items selected
- Deselect all button

### 4. Modal Component
**File:** `components/Modal.tsx`
**Features:**
- Glassmorphism backdrop
- Smooth animations (framer-motion)
- Close on backdrop click
- Escape key support
- Responsive sizing

### 5. Button Component
**File:** `components/Button.tsx`
**Variants:**
- Primary (gradient)
- Secondary (outline)
- Ghost (transparent)
- Danger (error color)
**States:** Default, Hover, Active, Disabled, Loading

### 6. Badge Component
**File:** `components/Badge.tsx`
**Types:**
- Level badges (Basic/Intermediate/Advanced)
- Status badges (Pending/Approved/Rejected)
- Source badges (AI/User)
**Styling:** Rounded-full, uppercase, tracking-widest

### 7. Select Component
**File:** `components/Select.tsx`
**Features:**
- Icon prefix support
- Custom styling (no default arrow)
- Focus ring
- Placeholder text
- Disabled state

## Design System Tokens

### Colors
```typescript
const colors = {
  primary: '#ff8aa7',
  secondary: '#feb300',
  tertiary: '#81ecff',
  background: '#0e0e0e',
  surface: '#1a1a1a',
  surfaceHigh: '#20201f',
  surfaceBright: '#2c2c2c',
}
```

### Typography
```typescript
const fonts = {
  display: 'Space Grotesk',
  body: 'Manrope',
  label: 'Inter',
}
```

### Spacing
```typescript
const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
}
```

## Implementation Priority
1. ✅ Basic layout and navigation (DONE)
2. ✅ Authentication system (DONE)
3. ✅ Filter components with icons (DONE)
4. 🔲 Extract reusable components
5. 🔲 Add bulk actions
6. 🔲 Improve animations
7. 🔲 Add loading states

## Notes
- Follow "No-Line" rule - use tonal layering instead of borders
- Use glassmorphism for modals and floating elements
- Apply technical glow effects on hover
- Maintain tri-font system (Space Grotesk, Manrope, Inter)
- Keep components small and focused
- Use TypeScript for type safety
- Leverage Tailwind CSS for styling
- Use Framer Motion for animations

## Reference Files
- Current implementation: `/root/.openclaw/workspace/tools/interview-nextjs/`
- Design reference: `/root/.openclaw/workspace/tools/interview-nextjs/design-references/`
- Existing components: `/root/.openclaw/workspace/tools/interview-nextjs/components/`

---
Created: 2026-03-29
Status: Planning phase
Next: Extract QuestionCard component first
