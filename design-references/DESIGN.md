# Design System Strategy: The Digital Editorial Board

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **"The Technical Curator."** 

Unlike generic dashboard templates that rely on heavy lines and grey boxes, this system treats technical interview content like high-end editorial matter. We are moving away from the "standard app" look and toward a sophisticated, immersive experience that feels both authoritative and vibrant. 

The system utilizes **Intentional Asymmetry** and **Tonal Depth** to guide the eye. By breaking the rigid grid with floating elements and layered surfaces, we create an environment where complex information feels approachable and premium. We leverage high-contrast typography scales—pairing a brutalist display face with a highly readable geometric body face—to establish a clear hierarchy that feels contemporary and "engineered."

## 2. Colors
Our palette is rooted in deep obsidian tones, punctuated by high-energy, neon-adjacent accents that denote difficulty and technical category.

*   **Primary (`#ff8aa7`):** Reserved for high-priority actions and "Advanced" level indicators. It should be used sparingly to maintain its "alarm" and "prestige" value.
*   **Secondary (`#feb300`):** Used for "Intermediate" indicators and cautionary states. It provides a warm, energetic contrast to the cool background.
*   **Tertiary (`#81ecff`):** Used for "Beginner" or "General" info, providing a calming, technical "glow."
*   **The "No-Line" Rule:** Designers are strictly prohibited from using `1px` solid borders to define sections. Layout boundaries must be established via background shifts—for instance, a `surface-container-low` card sitting on a `surface` background.
*   **Surface Hierarchy & Nesting:** Use the `surface-container` tiers to create physical depth. 
    *   Main background: `background` (#0e0e0e).
    *   Primary card areas: `surface-container` (#1a1a1a).
    *   Nested elements (e.g., code snippets): `surface-container-high` (#20201f).
*   **The Glass & Gradient Rule:** Floating elements (modals, dropdowns) should use `surface-bright` with a 60% opacity and a `20px` backdrop-blur to create a "glassmorphism" effect. CTAs should use a linear gradient from `primary` to `primary-container` to add "soul" and dimension.

## 3. Typography
We use a tri-font system to balance technical precision with editorial flair.

*   **Display & Headlines (Space Grotesk):** This typeface provides a "Neo-Brutalist" feel. Use `display-lg` for hero interview titles. The wide apertures and geometric shapes feel modern and professional.
*   **Titles & Body (Manrope):** Manrope is our workhorse. Its high x-height ensures readability of complex technical answers. Use `body-md` for question descriptions.
*   **Labels (Inter):** Used for metadata, tags, and micro-copy. Inter provides the necessary "utility" look for difficulty badges and timestamps.

## 4. Elevation & Depth
Depth is a functional tool, not just an aesthetic choice. It is achieved through **Tonal Layering** rather than traditional structural lines.

*   **The Layering Principle:** Stacking tiers creates a natural lift. A `surface-container-lowest` (#000000) element placed on top of a `surface-container` (#1a1a1a) creates a "pressed-in" look for input fields, while `surface-container-highest` creates a "lifted" look for cards.
*   **Ambient Shadows:** If a floating state is required (e.g., a card being dragged), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. Never use pure black shadows; always tint the shadow with the `surface-tint` to simulate real-world light bounce.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline-variant` token at **15% opacity**. This creates a "suggestion" of a boundary without cluttering the UI.
*   **Glassmorphism:** Apply a `blur-xl` to elements utilizing `surface-bright` at reduced opacity to make the UI feel integrated into the background glow effects seen in the brand's creative direction.

## 5. Components

### Cards (The Question Block)
*   **Style:** No borders. Use `surface-container` for the background.
*   **Header:** Position the difficulty chip (e.g., "ADVANCED" in `primary`) in the top right using `label-sm` with a `0.125rem` letter spacing.
*   **Spacing:** Use `spacing-6` (1.5rem) for internal padding to allow the content to breathe.

### Chips (Difficulty & Tags)
*   **Intermediate:** `secondary_container` background with `on_secondary_container` text.
*   **Advanced:** `primary_container` background with `on_primary_container` text.
*   **Shape:** Use `rounded-full` for tags to contrast against the `rounded-md` question cards.

### Buttons
*   **Primary:** A gradient-filled container (`primary` to `primary_container`) with `on_primary_fixed` text. Use `rounded-sm` for a more aggressive, professional look.
*   **Secondary/Ghost:** `outline-variant` at 20% opacity for the border. No fill.

### Lists
*   **Execution:** Forbid the use of horizontal divider lines. Use `spacing-4` (1rem) gaps between list items and alternating `surface-container-low` and `surface-container-lowest` backgrounds to distinguish items.

### Special Component: The "Technical Glow"
*   **Purpose:** To highlight the active question.
*   **Execution:** A background radial gradient using the Difficulty color (Primary or Secondary) at 5% opacity, bleeding slightly outside the card boundaries.

## 6. Do's and Don'ts

### Do's
*   **DO** use whitespace as a separator. If you think you need a line, try adding `8px` of extra padding instead.
*   **DO** use `Space Grotesk` for all numbers (e.g., "Question 01") to give them a distinct, engineered look.
*   **DO** use high-contrast color shifts for hover states (e.g., shifting from `surface-container` to `surface-bright`).

### Don'ts
*   **DON'T** use 100% white (`#ffffff`) for long-form body text. Use `on_surface_variant` (#adaaaa) to reduce eye strain in the dark theme.
*   **DON'T** use standard "Material" rounded corners (8px-12px) for everything. Mix sharp `rounded-sm` for structural elements and `rounded-full` for interactive chips.
*   **DON'T** ever use a solid grey border for a card. It flattens the UI and destroys the "Technical Curator" aesthetic.