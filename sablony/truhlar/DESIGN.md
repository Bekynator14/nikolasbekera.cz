# Design System Document: The Industrial Atelier

## 1. Overview & Creative North Star
**Creative North Star: "The Master’s Workshop"**

This design system moves away from the generic, "app-like" feel of modern service platforms and instead adopts an **Editorial Industrial** aesthetic. It treats the digital interface like a high-end monograph or a premium architectural portfolio. 

The system breaks the "template" look through **intentional asymmetry** and **tonal depth**. Instead of centering everything, we use staggered layouts and overlapping imagery to mimic the way a craftsman lays out tools on a workbench—organized, but with a human touch. We prioritize "High-Contrast Precision," where heavy, robust typography meets expansive white space, creating a sense of authority and uncompromising quality.

---

### 2. Colors: Tonal Architecture
The palette is built on "Industrial Contrast." We use high-density charcoals and safety-inspired accents to evoke the physical world of craft.

*   **Primary (`#a93800`):** Our "Safety Orange." Used sparingly for high-precision actions and critical focus points.
*   **Secondary (`#546067`):** "Steel Blue-Grey." Provides a professional, dampened tone for secondary information.
*   **Surface Hierarchy (`#fcf9f8` to `#e5e2e1`):** We leverage a "warm-industrial" white.
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Use background shifts (e.g., a `surface-container-low` section sitting on a `surface` background) to define boundaries. This creates a more sophisticated, seamless transition between content areas.
*   **Signature Textures:** For Hero sections and primary CTAs, use a subtle linear gradient from `primary` (`#a93800`) to `primary_container` (`#ff5e13`) at a 135-degree angle. This adds a "forged" metallic depth that flat colors cannot replicate.

---

### 3. Typography: The Robust Voice
We utilize a pairing of **Manrope** for structural authority and **Inter** for technical clarity.

*   **Display & Headlines (Manrope):** These are our "Impact" layers. Set `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create an authoritative, editorial feel. Headlines should feel "heavy" to ground the page.
*   **Body & Labels (Inter):** Inter provides the "Technical Manual" legibility required for service specs and pricing. 
*   **The Hierarchy Strategy:** Use extreme scale shifts. A `display-md` headline should often be paired directly with `body-sm` metadata to create a "Big-and-Small" dynamic that feels intentional and high-end.

---

### 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to create "atmosphere."

*   **The Layering Principle:** Depth is achieved by stacking surface tiers. Place a `surface-container-lowest` card on a `surface-container-low` section. This produces a "paper-on-stone" effect that feels tactile and premium.
*   **Ambient Shadows:** If a floating element (like a Quote Calculator) is required, use a shadow with a 40px blur at 6% opacity, tinted with the `on-surface` color (`#1c1b1b`). This mimics natural shop lighting rather than a digital drop shadow.
*   **The "Ghost Border" Fallback:** If a container needs more definition, use the `outline-variant` (`#e4beb2`) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** For navigation bars or floating action panels, use `surface` at 80% opacity with a `20px` backdrop-blur. This allows the high-quality imagery of the craft to bleed through the UI, integrating the work with the interface.

---

### 5. Components: The Craftsman’s Toolkit

#### **Buttons: The Action Pivot**
*   **Primary:** Sharp `md` (0.375rem) corners. Uses the signature Orange gradient. High-contrast white text.
*   **Secondary:** `surface_container_highest` background with `on_surface` text. No border.
*   **Interaction:** On hover, primary buttons should slightly expand (scale 1.02) with an increased ambient shadow to feel "pressed" into the page.

#### **Inputs & Fields**
*   **Style:** Use "Underline" style inputs with a thick 2px `outline` color for the bottom border only, or fully enclosed containers using `surface_container_high`. 
*   **Focus:** Transition the bottom border to `primary` orange.

#### **Cards & Lists**
*   **No Dividers:** Forbid the use of horizontal lines. Use 48px or 64px of vertical white space to separate list items.
*   **Asymmetric Cards:** For service offerings, use cards with varying heights. This breaks the "grid" and feels like a curated portfolio.

#### **Signature Component: "The Detail Loupe"**
A custom image component that features a high-resolution "macro" shot of a craft detail (e.g., a weld, a wood grain, a stitch) overlapping a text block. This reinforces the "high-quality" and "detail-oriented" brand pillar.

---

### 6. Do’s and Don’ts

**Do:**
*   **Do** use large amounts of white space (128px+ between major sections).
*   **Do** overlap elements. Let an image break the container of a text block to create depth.
*   **Do** use `tertiary` (`#00629e`) specifically for "Trust Elements" like certifications, reviews, or guarantees.

**Don’t:**
*   **Don't** use 1px black or grey borders. It makes the site look like a budget template.
*   **Don't** use generic stock photography. Imagery must be high-contrast, macro-focused, and "in-progress."
*   **Don't** center-align long blocks of text. Stick to left-aligned editorial layouts for an authoritative voice.