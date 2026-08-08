---
name: Neon-Slate
colors:
  surface: "#051424"
  surface-dim: "#051424"
  surface-bright: "#2c3a4c"
  surface-container-lowest: "#010f1f"
  surface-container-low: "#0d1c2d"
  surface-container: "#122131"
  surface-container-high: "#1c2b3c"
  surface-container-highest: "#273647"
  on-surface: "#d4e4fa"
  on-surface-variant: "#b9cbbc"
  inverse-surface: "#d4e4fa"
  inverse-on-surface: "#233143"
  outline: "#849587"
  outline-variant: "#3b4a3f"
  surface-tint: "#00e38b"
  primary: "#f4fff3"
  on-primary: "#00391f"
  primary-container: "#00ff9d"
  on-primary-container: "#007143"
  inverse-primary: "#006d40"
  secondary: "#bcc7de"
  on-secondary: "#263143"
  secondary-container: "#3e495d"
  on-secondary-container: "#aeb9d0"
  tertiary: "#fefbff"
  on-tertiary: "#283044"
  tertiary-container: "#d7dff9"
  on-tertiary-container: "#5a6279"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#56ffa8"
  primary-fixed-dim: "#00e38b"
  on-primary-fixed: "#002110"
  on-primary-fixed-variant: "#00522f"
  secondary-fixed: "#d8e3fb"
  secondary-fixed-dim: "#bcc7de"
  on-secondary-fixed: "#111c2d"
  on-secondary-fixed-variant: "#3c475a"
  tertiary-fixed: "#dae2fd"
  tertiary-fixed-dim: "#bec6e0"
  on-tertiary-fixed: "#131b2e"
  on-tertiary-fixed-variant: "#3f465c"
  background: "#051424"
  on-background: "#d4e4fa"
  surface-variant: "#273647"
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 4.8rem
    fontWeight: "800"
    lineHeight: "1.1"
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 3.2rem
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 2.4rem
    fontWeight: "600"
    lineHeight: "1.3"
  body-lg:
    fontFamily: Sora
    fontSize: 1.8rem
    fontWeight: "400"
    lineHeight: "1.6"
  body-md:
    fontFamily: Sora
    fontSize: 1.6rem
    fontWeight: "400"
    lineHeight: "1.6"
  label-md:
    fontFamily: Sora
    fontSize: 1.4rem
    fontWeight: "600"
    lineHeight: "1"
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Sora
    fontSize: 1.2rem
    fontWeight: "500"
    lineHeight: "1"
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 2.8rem
    fontWeight: "700"
    lineHeight: "1.2"
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 1rem
  xs: 0.4rem
  sm: 0.8rem
  md: 1.6rem
  lg: 2.4rem
  xl: 4.8rem
  container-max: 144rem
  gutter: 2.4rem
---

## Brand & Style

The design system for GamerPulse sits at the intersection of professional performance hardware and high-energy gaming culture. It avoids the clichés of "gamer" aesthetics—such as aggressive red-and-black palettes or cluttered HUDs—in favor of a sophisticated, high-performance interface.

The design style is **Corporate Modern with a Tech-Noir influence**. It utilizes deep, saturated slate tones to create a focused environment, allowing high-vibrancy neon accents to guide the user's eye to critical interactions. The visual language is precise, clean, and highly legible, evoking the feel of a premium, state-of-the-art gaming dashboard rather than a toy.

- **Primary Audience:** Competitive gamers, hardware enthusiasts, and digital creators.
- **Emotional Response:** High-performance, focused, energized, and premium.

## Colors

The palette is built on a foundation of "Atmospheric Slates." By avoiding pure black, the design maintains depth and allows for subtle shadow play and layering.

- **Primary (#00ff9d):** A vibrant neon green used exclusively for primary actions, success states, and critical performance indicators.
- **Secondary (#1e293b):** The "Surface" color. Used for cards, navigation bars, and elevated UI elements.
- **Tertiary (#0f172a):** The "Background" color. This deep charcoal provides the base canvas for the entire application.
- **Neutral (#94a3b8):** A muted slate-blue used for secondary text, borders, and inactive states to maintain a low-friction visual hierarchy.

## Typography

This design system utilizes **Sora** across all levels. Sora’s geometric structure and wide stance reflect the technical nature of the gaming industry while remaining highly legible in data-dense environments.

**Base Sizing:**
The system adheres to a **10px base font-size (1rem = 10px)**. All typographic scales are calculated based on this root unit to ensure mathematical harmony across the UI.

- **Headlines:** Use heavy weights (700-800) with slight negative letter-spacing to create a "locked-in" technical feel.
- **Labels:** Small labels use uppercase with increased letter-spacing to mimic technical spec sheets and hardware branding.
- **Body:** Standardized at 1.6rem for optimal readability against dark backgrounds.

## Layout & Spacing

The layout follows a **Fluid Grid** model with strict adherence to an 8px (0.8rem) rhythm. The "Neon-Slate" aesthetic requires generous internal padding within components to maintain its premium feel and avoid the "cluttered" look often found in gaming apps.

- **Desktop:** 12-column grid, 2.4rem gutters, 4.8rem side margins.
- **Tablet:** 8-column grid, 1.6rem gutters, 2.4rem side margins.
- **Mobile:** 4-column grid, 1.6rem gutters, 1.6rem side margins.

Use the `xl` (4.8rem) spacing unit for vertical section separation to give the content room to breathe.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** and **Color-Tinted Glows** rather than traditional drop shadows.

1.  **Base Layer:** Tertiary (#0f172a) - The canvas.
2.  **Raised Layer:** Secondary (#1e293b) - Used for cards and modals.
3.  **Accent Elevation:** Primary Glow - Interactive elements use a subtle `box-shadow: 0 0 15px rgba(0, 255, 157, 0.2)` when hovered or active.

Avoid high-contrast white borders. Instead, use 1px solid borders in a slightly lighter slate than the background to define boundaries without breaking the "Tech-Noir" immersion.

## Shapes

The shape language is defined by **Round_Six** (interpreted as a consistent 0.6rem or 6px base). This provides a modern, friendly touch to an otherwise sharp and technical interface.

- **Base Components (Buttons, Inputs):** 0.6rem (6px) radius.
- **Large Components (Cards, Modals):** 1.2rem (12px) radius.
- **Media/Avatars:** Fully circular (pill-shaped) for contrast against geometric layout blocks.

## Components

Components must follow a **strict BEM (Block, Element, Modifier) methodology** for CSS architecture.

- **Buttons:**
  - `.button--primary`: Solid Primary color (#00ff9d) background with Tertiary (#0f172a) text. Heavy 700 weight.
  - `.button--secondary`: Ghost style with a Primary color border and Primary text.
- **Cards:**
  - `.card`: Secondary background (#1e293b), 1.2rem border-radius. Borders should be `1px solid rgba(148, 163, 184, 0.1)`.
- **Input Fields:**
  - `.input__field`: Darker than the card background. On focus, the border transitions to Primary Green with a subtle outer glow.
- **Chips/Badges:**
  - `.badge`: Small, uppercase text. Use a low-opacity Primary Green background (10-15%) with full-opacity Primary Green text for a "lit from within" effect.
- **Status Indicators:**
  - Small pulsing circles using the Primary Green for "Live" or "Online" states.
