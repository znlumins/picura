# Picura - Refined Glass Design System

# Summary

A sophisticated glass-themed fintech dashboard with a minimalist black and white primary aesthetic, using high-blur glass surfaces, subtle ambient lighting, and vibrant accent colors for data visualization and micro-interactions.

# Style

The style essence is **'Refined Glass'**. It relies on a neutral grayscale base with backdrop blurs fixed at 35px. Borders are thin (1px) and translucent white. Typography is clean and modern, using Outfit for branding/headers and Inter for body text. Animations are smooth and use custom cubic-beziers for a premium, weighty feel. Depth is created through layered glass effects rather than heavy shadows.

## Spec

* **Base Canvas:** Deep black base (`#050505`) with a subtle grain texture overlay (35% opacity).
* **Glass Panels:** `backdrop-filter: blur(35px) saturate(150%)`.
* **Glass Backgrounds:** Linear gradients from top-to-bottom: `linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%)`.
* **Glass Soft:** `backdrop-filter: blur(20px)`, `rgba(255,255,255,0.035)`.
* **Glass Strong:** `backdrop-filter: blur(35px)`, `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 100%)`.
* **Borders & Highlights:** 1px solid border at `rgba(255,255,255,0.10)` with an inner white highlight `box-shadow: inset 0 1px 0 rgba(255,255,255,0.14)`.
* **Typography:**
  - Headers / Branding: `Outfit`, Semibold (600), tracking `-0.025em`.
  - Body Text: `Inter`, 400-500 weight.
  - Data / Currency / Codes: `JetBrains Mono`, 500-600 weight.
* **Color Palette:**
  - Primary Base: `#050505`
  - Primary White: `#FFFFFF`
  - Secondary Slate: `#94A3B8`
  - Slate Muted: `#64748B`
  - Accent Blue: `#3B82F6` (Usage / Analytics)
  - Accent Emerald: `#10B981` (Savings / Success / Settled)
  - Accent Rose: `#F43F5E` (Spending / Quota Limits)
  - Accent Amber: `#F59E0B` (Pending / Warnings)
* **Animations:** All transitions must use `cubic-bezier(0.16, 1, 0.3, 1)` with a duration of `0.3s` to `0.6s`.

---

# Layout & Structure

A classic dashboard structure featuring a fixed-width left sidebar and a flexible main content area. Content is organized into a modular bento-style grid with varying card sizes to establish visual hierarchy.

## Sidebar
* **Width:** 280px.
* **Background:** `glass-soft` (blur 20px, 3.5% opacity).
* **Layout:** Vertical flex (`h-screen sticky top-0`).
* **Elements:**
  - Top logo area (44px square white box with black character `P`).
  - Navigation links with 17px icons and 14px text.
  - Floating 'wallet card' at the bottom with a `float` animation (`translateY: -6px`, 5s duration).

## Header
* **Layout:** Horizontal flex.
* **Left:** 30px display heading in `Outfit` with 14px date/greeting subtext.
* **Right:** 
  - 224px wide glass search bar.
  - White primary button with heavy glow `shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)]`.
  - Circular avatar (40px) with slate gradient.

## Hero Balance Section
* **Style:** Large `glass-strong` card (blur 35px, 14% top opacity).
* **Layout:** Flex-between.
* **Left:** `Outfit` 48px balance display with 11px uppercase labels. Bottom stats row with 18px semibold figures and 1px top border.
* **Right:** Large SVG area (420px x 130px) featuring a smooth white line chart with a `shimmerLine` stroke-dash animation.

## Metrics Grid
* **Structure:** Three-column grid. Each card is `glass` (35px blur).
* **Card 1 (Rose Accent):** Spending / Quota Consumption with small SVG area chart (`h-14`) at the bottom.
* **Card 2 (Blue Accent):** API Usage / Photo Processing with small SVG area chart (`h-14`) at the bottom.
* **Card 3 (Emerald Accent):** Savings / Completed Selections with small SVG area chart (`h-14`) at the bottom.

## Recent Activity
* **Style:** Full-width `glass-strong` panel.
* **Header:** Title with 'View all' action link.
* **Content:** Vertical list of rows with hover states `background: rgba(255,255,255,0.025)`.
* **Row Elements:**
  - 40px rounded-xl glass boxes for icons with themed colors (Blue, Emerald, Amber).
  - Activity details & timestamp.
  - Right-aligned monospaced currency/metric values (`JetBrains Mono`).

---

# Special Components

## Liquid Glass Card
A multi-layered glass panel with sophisticated lighting effects:
* `backdrop-filter: blur(35px) saturate(150%)`.
* `background: linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%)`.
* `box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 20px 40px -15px rgba(0,0,0,0.5)`.
* 1px border gradient: `linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.02) 35%, rgba(255,255,255,0) 60%)`.

## Ambient Background Glow
Subtle, non-distracting background lighting to add depth to the dark base:
* Top-left: `radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 70%)` with a 55px blur filter.
* Bottom-right: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)`.
* Dimensions: 640px – 720px each.

## Segmented AI Usage Ring
A multi-colored SVG donut chart with rounded caps and gap effects:
* SVG radius 46, stroke-width 16.
* Segments using `stroke-dasharray` and negative `stroke-dashoffset`:
  - Blue (`#3B82F6`)
  - Emerald (`#10B981`)
  - Amber (`#F59E0B`)
  - Slate (`#64748B`)
* `stroke-linecap: round`.

---

# Special Notes & Guardrails

* **MUST:** Maintain the 35px blur and 1px border on all glass panels to ensure depth consistency.
* **MUST NOT:** Use solid black or heavy flat shadows for panel definition; use border highlights and translucent layers instead.
* **MUST:** Keep interactive elements like 'Quick Action' buttons on a `glass-soft` background to avoid visual clutter.
* **MUST:** Animate all elements on entrance using a fade-up with staggered delays (`0.05s` increments) using `cubic-bezier(0.16, 1, 0.3, 1)`.
