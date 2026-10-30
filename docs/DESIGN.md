# Picura Indonesia

## Overview

**Product:** Picura Indonesia **Surface type:** dashboard **Audience:** Business users and internal teams **Brand character:** Data-driven application interface with a rich, diverse color palette and 5 typefaces.

> **Note:** Surface detection confidence is low. Verify the inferred audience and brand context before relying on this file.

### Design Principles

- Data visibility — the most important metric should be visible without interaction.  
- Progressive disclosure — surface summaries, reveal detail on demand.  
- Efficiency over decoration — every pixel should communicate state or enable action.

## Colors

| Token | Value | Role |
| :---- | :---- | :---- |
| \--border-color | `#D0D5DD` | Border |
| color-17 | `#F3F3F3` | Background |
| color-18 | `#F9F9F8` | Background |
| color-12 | `#D6E4FF` | Surface |
| color-13 | `#E6E6E6` | Surface |
| color-14 | `#FFE1DF` | Surface |
| color-1 | `#101828` | Text Primary |
| color-2 | `#454444` | Text Primary |
| color-3 | `#0000EE` | Text Primary |
| color-5 | `#6B7280` | Text Secondary |
| color-4 | `#155EEF` | Accent |
| color-6 | `#FF0000` | Accent |
| color-7 | `#17B26A` | Accent |
| color-8 | `#76A4FF` | Accent |
| color-9 | `#FFAB9D` | Background Dark |
| color-10 | `#D1D1D1` | Text Light |
| color-15 | `#E8E8E8` | Text Light |
| color-16 | `#EBEBEB` | Text Light |
| color-19 | `#FFFFFF` | Text Light |

## Typography

**Font stack:** Inter, Inter Display, Manrope, sans-serif, Times New Roman

| Level | Size | Usage |
| :---- | :---- | :---- |
| text-xs | 10px | Captions, metadata |
| text-sm | 12px | Labels, secondary text |
| text-base | 14px | Body text (default) |
| text-lg | 16px | Subheadings, emphasis |
| text-xl | 18px | Section headings |
| text-2xl | 20px | Section headings |
| text-3xl | 24px | Section headings |
| text-4xl | 30px | Section headings |
| text-9 | 32px | General use |

**Weight scale:** 400 · 500 · 600 · 700 **Line heights:** 48px · 28px · 18px · 12px · 16.8px · 22px · 24px · 38.4px · 25.5px · 36px · 20px · 14.4px · 32px · 26px · 38px · 42px · 16px

## Spacing

**Base unit:** 4px

`space-1: 1px` · `space-2: 2px` · `space-3: 3px` · `space-4: 4px` · `space-5: 5px` · `space-6: 6px` · `space-7: 8px` · `space-8: 10px` · `space-9: 12px` · `space-10: 16px` · `space-11: 20px` · `space-12: 24px` · `space-13: 26px` · `space-14: 27px` · `space-15: 32px` · `space-16: 48px` · `space-17: 64px` · `space-18: 74px` · `space-19: 111px`

## Shapes

**Border radius:** `radius-sm: 1px` · `radius-md: 2px` · `radius-lg: 4px` · `radius-xl: 6px` · `radius-full: 8px` · `radius-6: 10px` · `radius-7: 12px` · `radius-8: 16px` · `radius-9: 18px` · `radius-10: 24px` · `radius-11: 32px` · `radius-12: 48px` · `radius-13: 100px` · `radius-14: 999px` · `radius-15: 1000px`

## Elevation

- **shadow-sm:** `rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(12, 17, 29, 0.15) 0px 0px 0px 1px inset, rgba(12, 17, 29, 0.08) 0px -2px 0px 0px inset`  
- **shadow-md:** `rgba(0, 0, 0, 0.25) 0px 1px 2px 0px`  
- **shadow-lg:** `rgb(186, 85, 68) 0px 4px 5.3px 0px`  
- **shadow-xl:** `rgba(255, 255, 255, 0.6) 0px 0px 6px 1px`  
- **shadow-5:** `rgba(0, 0, 0, 0.08) 0px 1px 7px 0px`  
- **shadow-6:** `rgba(0, 0, 0, 0.16) 0px 8px 24px 0px`  
- **shadow-7:** `rgba(0, 0, 80, 0.35) 0px 8px 32px 0px`

## Motion

- **duration-fast:** `all`  
- **duration-fast:** `none`  
- **duration-base:** `background 0.2s`  
- **duration-base:** `background 0.2s, transform 0.15s`  
- **duration-base:** `background 0.25s`  
- **duration-base:** `transform 0.3s, opacity 0.1s, visibility linear, bottom linear`  
- **duration-slow:** `0.8s steps(1) infinite paused cursor-blink`

## Components

- **Buttons:** 37 detected  
- **Links:** 52 detected  
- **Inputs:** 1 detected  
- **Navigation:** 1 elements  
- **Lists:** 1 detected  
- **Images:** 132 detected

## Do's and Don'ts

### Do

- Reference tokens by name, not raw values — agents and developers should use `color.text.primary`, not `#171717`.  
- Define all interactive states: default, hover, focus-visible, active, disabled.  
- Use the spacing scale for all padding, margin, and gap values.  
- Write content in sentence case. Reserve ALL CAPS for acronyms only.  
- Test every component at the smallest and largest breakpoint before shipping.

### Don't

- Do not introduce colors outside the extracted palette.  
- Do not use arbitrary spacing values — stick to the scale.  
- Do not mix border-radius values. Pin to the detected set (1px, 2px, 4px, 6px, 8px, 10px, 12px, 16px, 18px, 24px, 32px, 48px, 100px, 999px, 1000px).  
- Do not use decorative shadows on data-dense layouts.  
- Do not hide critical status information behind interactions.  
- Do not ship components without defining hover, focus-visible, and disabled states.

## Writing Tone

Efficient, data-forward, action-oriented. Labels over sentences.

## Authoring Workflow

When creating or updating a component guideline for this system, follow this sequence:

1. **State the intent** — one sentence on what the component does and why it exists.  
2. **Map tokens** — list every color, spacing, typography, and radius token the component uses. No raw values.  
3. **Define anatomy** — break the component into named parts (container, label, icon, etc.) with their token assignments.  
4. **Specify states** — document every state: default, hover, focus-visible, active, disabled, loading, error, empty.  
5. **Describe interactions** — keyboard, pointer, and touch behavior, including edge cases (long content, overflow, truncation).  
6. **Add accessibility criteria** — write testable pass/fail checks (e.g. "focus ring must be visible at 3:1 contrast").  
7. **List anti-patterns** — concrete examples of misuse with a brief explanation of why each is wrong.  
8. **Close with a QA checklist** — a mechanical list of verifiable items (see Definition of Done below).

## Required Output Structure

Every component guideline produced from this system must contain these sections, in order:

1. Overview — purpose, when to use, when not to use.  
2. Tokens and foundations — all referenced tokens from the tables above.  
3. Anatomy and variants — named parts, variant matrix, responsive behavior.  
4. States and interactions — full state table, keyboard/pointer/touch behavior.  
5. Accessibility — ARIA attributes, contrast requirements, focus management, screen reader behavior.  
6. Content guidelines — copy length, tone, capitalisation, placeholder text rules.  
7. Anti-patterns — explicit examples of what not to build, with reasoning.

## Component Requirements

Every component built against this system must:

- Reference only tokens defined in the tables above — no hardcoded hex, px, or font values.  
- Define all interactive states: default, hover, focus-visible, active, disabled, loading, error.  
- Specify responsive behavior at the smallest and largest supported breakpoint.  
- Handle edge cases: empty state, overflow / truncation, maximum content length.  
- Include keyboard navigation (Tab, Enter, Escape, Arrow keys where applicable).  
- Document ARIA roles, labels, and live-region behavior where relevant.  
- Include known page component density: \- **Buttons:** 37 detected  
- **Links:** 52 detected  
- **Inputs:** 1 detected  
- **Navigation:** 1 elements  
- **Lists:** 1 detected  
- **Images:** 132 detected

## Definition of Done

A component is not complete until every item below is checked:

- Renders correctly in its default state (smoke test).  
- All states documented and visually verified (hover, focus, disabled, loading, error, empty).  
- All visual values use design tokens — zero hardcoded values.  
- Keyboard navigation works without a pointer.  
- No critical accessibility violations (contrast, ARIA, focus order).  
- Tested at smallest and largest breakpoint.  
- Anti-patterns section lists at least one concrete misuse example.  
- Documentation covers purpose, usage, props/API, and limitations.

# Picura Indonesia — Landing Page Specification

## 1\. Hero Section

**Headline:** Empower Your Business Decisions with Data-Driven Clarity  
**Subheadline:** Picura Indonesia delivers real-time analytics and actionable insights designed for modern business users and internal teams.  
**Primary CTA:** Request a Demo (Button token: `color-4 / #155EEF`, text: `color-19 / #FFFFFF`)  
**Secondary CTA:** Explore Dashboard Features

## 2\. Key Features & Capabilities

- **Data Visibility:** Critical metrics are surfaced immediately upon load without requiring unnecessary interactions.  
- **Progressive Disclosure:** Clean high-level summaries with rich details revealed effortlessly on demand.  
- **Efficient Workflows:** Minimalist interface engineered specifically for speed and precision across complex data environments.

## 3\. Design System Integration

The landing page strictly adheres to the system tokens:

- **Primary Background:** `color-18 (#F9F9F8)` and `color-17 (#F3F3F3)`  
- **Text Tokens:** Primary headings use `color-1 (#101828)`, body copy uses `color-2 (#454444)`, and secondary labels use `color-5 (#6B7280)`  
- **Accent Colors:** Primary actions leverage `color-4 (#155EEF)` with success/status indicators using `color-7 (#17B26A)`

## 4\. Call to Action

- Ready to transform your dashboard experience? Visit [Picura Indonesia](https://www.dicoding.com/) or get in touch with our team today.