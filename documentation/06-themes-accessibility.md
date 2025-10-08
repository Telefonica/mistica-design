# Mística - Themes and Accessibility

_Mística Digital Design System - Part 6: Themes and Accessibility_

## Theming

### Overview

A theme is a collection of design tokens that define how Mística components are displayed.

Each brand supported by Mística shares the same theme base definition and only the design token values change. The values applied by each brand are what we call a **skin**.

**Note:** For some brands, there are extended definitions in the theme. These definitions are tied to extended components that are only available in that brand.

### Skins

Not all visual properties in our components are available for brand customization in the theme definition. At the moment, each skin can only define the following values:

- **Color**: Brand-specific color palettes
- **Text-presets font-weight**: From presets 5 to 10
- **Border radius**: Corner rounding values

### Color Theming

Within a theme, the color type design tokens also vary depending on the following:

- **Color scheme**: Adjustments on the whole interface based on configuration or user preferences
- **Theme variant/context**: Adjustments at the component level based on configuration

#### Color Scheme

Mística components have built-in support for **light and dark modes**.

On all Mística implementations, the color scheme can be:

- **Forced as light**
- **Forced as dark**
- **Auto**: OS dependent

#### Variants

In addition to light and dark modes, components are displayed differently depending on the variant and the variant context they're placed in.

#### Variant Context

A container variant defined as default/inverse/alternative creates a context. All components placed in this context change to improve contrast.

- **Over inverse**: Components placed inside a container defined as `inverse`
- **Over alternative**: Components placed inside a container defined as `alternative`
- **Over media**: Components placed inside a container with an image in the background and defined as `media`

### Component Variants

Specific components can be rendered in different variants (default/inverse/alternative) to provide visual hierarchy and contrast.

#### Inverse Components

The components that can be rendered as inverse include:

- Buttons
- Text elements
- Icons
- Cards
- Forms

#### Usage Guidelines

- **Use inverse components sparingly**: High usage can increase cognitive load
- **Use inverse components to attract user attention**: For primary actions and important information
- **Ensure proper contrast**: Always test readability and accessibility

## Accessibility

### Mission Statement

At Telefónica, our mission is to connect people. Therefore, it is essential for us to break down the barriers between people and technology by providing the best possible experience for everyone.

### Accessibility Philosophy

Accessibility in Mística for everyone means caring deeply about making quality products. A quality product should be usable and useful to everyone.

### Foundation vs. Complete Accessibility

Mística provides accessible components that offer a **solid foundation** for creating inclusive products at Telefónica. However, complete product accessibility is **not guaranteed** by using these components alone.

It's essential to:

- **Integrate components properly**
- **Consider other design and UX aspects**
- **Avoid unforeseen barriers**
- **Ensure accessible experience throughout the product**

### Collaborative Approach

Inclusive design requires that accessibility be considered at every stage, from early designs to the final product. This means that **all team members must collaborate** to ensure that accessibility is implemented correctly.

### International Standards

Mística follows international accessibility standards to ensure compliance and best practices:

- **WCAG 2.1 AA**: Web Content Accessibility Guidelines
- **Section 508**: US Federal accessibility requirements
- **EN 301 549**: European accessibility standard
- **Platform-specific guidelines**: iOS, Android, and web accessibility standards

### Global Framework

Mística provides a comprehensive accessibility framework that includes:

#### Annotation Kit

Tools and resources for documenting accessibility requirements in designs and specifications.

#### Essentials Guide

Fundamental accessibility principles and implementation guidelines for teams.

### Accessibility Features

#### Color and Contrast

- **Sufficient contrast ratios** for all text and UI elements
- **Color-blind friendly** palette choices
- **Alternative indicators** beyond color alone

#### Typography

- **Scalable text** that works with browser zoom up to 200%
- **Clear font choices** that maintain legibility
- **Proper heading hierarchy** for screen readers

#### Interactive Elements

- **Keyboard navigation** support for all interactive components
- **Focus indicators** that are clearly visible
- **Touch target sizes** that meet minimum size requirements
- **Screen reader compatibility** with proper ARIA labels

#### Content Structure

- **Semantic HTML** usage for proper screen reader interpretation
- **Logical reading order** maintained across all layouts
- **Alternative text** for images and media content
- **Descriptive link text** that provides context

### Internationalization and Localization

#### Phone Numbers

Phone numbers automatically change in Mística according to the configured region code of the skin. The phone number format adapts to different region codes supported by Mística.

#### Text Wrapping

Mística has defined rules for hyphenating words that apply across all brands and languages:

- If the word does not fit in its container, a hyphen will appear
- If the word fits in the container but does not fit on the line, it will move to the next line

#### Language Support

- **Right-to-left (RTL)** language support
- **Text expansion** considerations for different languages
- **Cultural adaptations** for color meanings and symbols
- **Local accessibility standards** compliance

### Implementation Guidelines

#### For Designers

- Use annotation kit to document accessibility requirements
- Ensure sufficient color contrast in all designs
- Design with keyboard navigation in mind
- Test designs with accessibility tools

#### For Developers

- Implement proper semantic HTML structure
- Add appropriate ARIA labels and roles
- Test with keyboard navigation
- Validate with screen readers
- Run automated accessibility tests

#### For Content Creators

- Write descriptive alternative text for images
- Use clear and simple language
- Structure content with proper headings
- Provide captions for video content

### Testing and Validation

Regular accessibility testing should include:

- **Automated testing** with accessibility scanning tools
- **Manual keyboard navigation** testing
- **Screen reader testing** with actual assistive technology
- **User testing** with people with disabilities
- **Color contrast verification** tools
- **Mobile accessibility testing** on actual devices

---

_This document is part of the Mística Digital Design System documentation series. Continue with Part 7: Glossary for definitions of key terms and concepts._
