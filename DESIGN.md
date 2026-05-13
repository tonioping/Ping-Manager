---
name: Synthwave Retro-Futurist System
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#d5c0d7'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#9d8ba0'
  outline-variant: '#514254'
  surface-tint: '#ecb1ff'
  primary: '#ecb1ff'
  on-primary: '#520070'
  primary-container: '#bf00ff'
  on-primary-container: '#ffffff'
  inverse-primary: '#9900ce'
  secondary: '#ffb1c4'
  on-secondary: '#65002e'
  secondary-container: '#ff4a8d'
  on-secondary-container: '#590028'
  tertiary: '#00daf3'
  on-tertiary: '#00363d'
  tertiary-container: '#008392'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f9d8ff'
  primary-fixed-dim: '#ecb1ff'
  on-primary-fixed: '#320046'
  on-primary-fixed-variant: '#75009e'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ffb1c4'
  on-secondary-fixed: '#3f001a'
  on-secondary-fixed-variant: '#8f0044'
  tertiary-fixed: '#9cf0ff'
  tertiary-fixed-dim: '#00daf3'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004f58'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

This design system captures the high-energy, immersive aesthetic of 80s-inspired futurism. It leans heavily into a **Synthwave Glassmorphism** style, characterized by vibrant neon accents cutting through deep, atmospheric shadows. The brand personality is professional yet electrifying, evoking the sensation of a high-tech terminal from a localized future.

Visual depth is achieved through translucent glass layers, blurred backdrops, and luminous glow effects. The interface feels alive with energy, utilizing subtle grid overlays and light-bleed textures to ground the futuristic elements in a nostalgic, tactile digital space. It is designed for high-impact experiences where immersion and visual storytelling are paramount.

## Colors

The palette is anchored by a "Midnight Abyss" background strategy. The primary background is a deep dark navy, while containers use a midnight purple for tonal separation. 

- **Electric Violet (Primary):** Used for primary actions, active states, and dominant glowing accents.
- **Hot Pink (Secondary):** Used for highlighting, notifications, and high-energy decorative elements.
- **Cyan Blue (Tertiary):** Reserved for data visualization, success states, and technical secondary accents.
- **Neon Glows:** All accent colors should be applied with an outer glow (bloom) effect to simulate light emission.
- **Glass Surfaces:** Semi-transparent fills (10-20% opacity) of the surface color combined with a background blur create the glassmorphism effect.

## Typography

The typography strategy pairs technical precision with aggressive geometry. 

- **Headlines:** **Space Grotesk** provides a bold, geometric sans-serif look that feels futuristic and high-contrast. Larger display styles should occasionally utilize a "text-shadow" glow in the primary or secondary accent colors to enhance the synthwave aesthetic.
- **Body:** **Inter** is used for maximum legibility against dark backgrounds. It provides a clean, functional counterpoint to the more expressive headings.
- **Utility/Labels:** **Space Mono** is used for small labels, data points, and technical metadata, reinforcing the "hacker-terminal" or sci-fi instrumentation feel. Use all-caps for labels to increase the structured, architectural look.

## Layout & Spacing

The layout is built on a strict 12-column fluid grid that evokes a digital "blueprint." 

A subtle, low-opacity (5%) cyan or violet grid pattern should be visible in the background or within specific containers to reinforce the retro-tech aesthetic. Padding and margins follow an 8px rhythmic scale. 

**Breakpoints:**
- **Mobile:** 0 - 599px. Single column layout with 20px side margins.
- **Tablet:** 600px - 1023px. 6-column grid.
- **Desktop:** 1024px+. 12-column grid with a maximum content width of 1440px. 

Components should use generous internal padding to allow the background blurs and glows space to breathe.

## Elevation & Depth

Elevation in this design system is not conveyed through traditional drop shadows, but through **light and transparency**.

1.  **Backdrop Blur:** All elevated surfaces must use a `backdrop-filter: blur(12px to 20px)`.
2.  **Glowing Borders:** Instead of shadows, use 1px semi-transparent borders. For higher elevation, use a linear gradient border (e.g., Violet to Pink) with a `box-shadow` that mimics a neon tube glow.
3.  **Tonal Stacking:** Surfaces closer to the user are lighter and more saturated midnight purple.
4.  **Outer Glow:** Critical interactive elements use a "bloom" effect (a soft, colored drop shadow with 0 spread and high blur radius) to appear as if they are emitting light.

## Shapes

The shape language is precise and controlled. We use **Soft (0.25rem)** roundedness for standard UI elements to maintain a professional, architectural feel without becoming too friendly or "bubbly."

- **Containers:** 4px (0.25rem) corner radius.
- **Large Cards:** 8px (0.5rem) corner radius.
- **Decorative Elements:** Use 45-degree chamfered corners (clipped corners) on specific display containers to enhance the futuristic, "cyber" aesthetic.

## Components

### Buttons
- **Primary:** Solid Electric Violet fill with white text. Apply a violet glow on hover.
- **Secondary:** Ghost style with a 1px Hot Pink glowing border and Hot Pink text.
- **Action:** Use a "scanning" animation effect or a subtle gradient shift on hover to indicate energy.

### Cards & Glass Containers
- Background: 15% opacity Midnight Purple.
- Border: 1px semi-transparent white (20% opacity) or a neon gradient.
- Filter: 16px background blur.

### Inputs & Form Fields
- Background: 5% opacity black.
- Border: Bottom-only 2px border in Cyan Blue for a "terminal" look.
- Active State: The border should glow and a subtle Cyan outer glow should appear around the field.

### Chips & Tags
- Pill-shaped but with the "Soft" radius (4px). 
- Use high-saturation background tints (20% opacity) of the accent colors with matching colored text.

### Grid Overlay
- A global decorative component. A repeating 40px square grid in 5% opacity Cyan blue, fixed to the background to provide a sense of scale and digital structure.