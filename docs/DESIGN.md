# Lightdash — Style Reference
> violet pixel-grid on drafting paper

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Lightdash operates as a calm, developer-first command center: a near-white canvas populated by slate-gray typography, subtle hairline borders, and one saturated violet (#5e4cff) that powers every interactive moment. The brand voice is confident and quiet — headlines are set in a custom geometric sans (Space Grotesk / Britti Sans) at 48–76px with aggressively tight tracking (-0.025em), making them feel architectural rather than decorative. Body copy uses Inter at 14–18px with slightly negative letter-spacing, keeping dense information readable without feeling heavy. Surfaces layer gently from #ffffff canvas to #f6f8fa sections to 12px-rounded cards, and a pixel-art violet mosaic in the hero is the only ornamental gesture — a deliberate nod to the 'code-native' identity. Components are flat and borderless-by-default; elevation is borrowed from layered rgba shadows tinted with the brand's slate (#272835) rather than neutral gray, which keeps every card visually on-brand.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#ffffff` | `--color-canvas-white` | Primary page background, card surfaces, input fills |
| Cloud Mist | `#f6f8fa` | `--color-cloud-mist` | Alternate section background, subtle surface tier below white |
| Frost Tint | `#eceff3` | `--color-frost-tint` | Tertiary surface, muted background blocks |
| Ash Border | `#cdd2d9` | `--color-ash-border` | Hairline dividers, card borders, table separators |
| Mist Border | `#c1c7d0` | `--color-mist-border` | Secondary borders, disabled state outlines |
| Fog Text | `#a4abb8` | `--color-fog-text` | Helper text, link underlines in body copy, placeholder text |
| Steel Text | `#818898` | `--color-steel-text` | Muted metadata, timestamps, caption text |
| Slate Body | `#666d80` | `--color-slate-body` | Secondary body text, descriptions, supporting paragraphs |
| Graphite Heading | `#36394a` | `--color-graphite-heading` | Primary headings, strong body text, high-emphasis content |
| Midnight Ink | `#272835` | `--color-midnight-ink` | Dark surface fills, announcement bar, code terminal background, primary button background |
| Onyx | `#1a1b25` | `--color-onyx` | Deepest text, high-contrast dark surfaces |
| Volt Violet | `#5e4cff` | `--color-volt-violet` | Primary CTA fill, active link, brand accent — vivid violet against slate neutrals is the single chromatic punctuation of the entire system |
| Lavender Wash | `#c8ccf3` | `--color-lavender-wash` | Muted accent background, hero pixel-art mid-tones, tag chips |
| Lilac Whisper | `#dfdbff` | `--color-lilac-whisper` | Tertiary accent surface, selected row tint, soft callout |

## Tokens — Typography

### Space Grotesk / Britti Sans — Display headlines and hero copy
- **Substitute:** Space Grotesk Bold / Semibold
- **Weights:** 600
- **Sizes:** 18px, 24px, 32px, 48px, 56px, 76px
- **Line height:** 0.95 - 1.10
- **Letter spacing:** -0.025em at 56-76px, -0.02em at 24-48px
- **Role:** Display headlines and hero copy. Aggressive tracking makes text feel architectural and code-like.

### Inter — Body copy, UI controls, paragraphs
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 18px
- **Line height:** 1.33 - 1.63
- **Letter spacing:** -0.010em to -0.020em
- **Role:** Body copy, buttons, badges, form labels, nav links.

### IBM Plex Mono — Code snippets, terminal, photo tags, technical metadata
- **Weights:** 400, 500
- **Sizes:** 12px, 13px
- **Letter spacing:** -0.020em
- **Role:** Code blocks, technical IDs, photographer metadata.

## Spacing & Shapes
- **Base unit:** 4px
- **Border Radius:**
  - Cards: `12px`
  - Buttons & Inputs: `8px`
  - Badges & Pills: `999px`
- **Shadows:**
  - Standard cards: `none` (1px `#cdd2d9` border)
  - Subtle elevated cards: `rgba(39, 40, 53, 0.08) 0px 12px 12px -6px, rgba(39, 40, 53, 0.1) 0px 0px 0px 1px`
  - Product preview: `rgba(0, 0, 0, 0.05) 0px 2px 5px 0px, rgba(0, 0, 0, 0.04) 0px 9px 9px 0px, rgba(39, 40, 53, 0.08) 0px 24px 24px -12px`

## Brand Assets & Anti-AI-Slop Rules
1. **Official Logo:** Uses official Picura SVG vector mark & logotype (`public/logo.svg`).
2. **No Lucide AI-Slop Icons:** Do not use generic Lucide icons or icons inside colored circles. Use clean, bespoke, minimalist SVG line glyphs or typographic indicators.
3. **One Violet per Viewport:** Use `#5e4cff` for the primary CTA/action only. Rest of the interface relies on calm, pristine slate and graphite neutrals.
4. **Pixel-Art Accent Grid:** Subtle 4px-12px decorative mosaic in `#5e4cff`, `#c8ccf3`, `#dfdbff`.
