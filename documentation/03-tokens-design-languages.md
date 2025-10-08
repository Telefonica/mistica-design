# Mística - Tokens and Design Languages

_Mística Digital Design System - Part 3: Tokens and Design Languages_

## Tokens

Tokens are those system pieces that are more subatomic, such as colour, typography, spaces, edge width, rounded corners, shadows, animations or even media queries.

### Learn to Use Mística Colors

There are many other tokens used for specific things such as Buttons or Feedback, but here we share the most generic ones.

If you need to know more about color and contrast, refer to our specific accessibility section.

### Colors

The following list shows all the colors available in Mística:

#### Color Categories

- **Primary Colors**: Main brand colors used for primary actions and key elements
- **Secondary Colors**: Supporting colors for secondary actions and information
- **Semantic Colors**: Colors with specific meanings (success, warning, error, info)
- **Neutral Colors**: Grayscale colors for text, borders, and backgrounds
- **Background Colors**: Surface colors for different contexts

### Palettes

Mística provides comprehensive color palettes that ensure:

- **Brand consistency** across all products
- **Accessibility compliance** with proper contrast ratios
- **Thematic variations** for different brands within Telefónica
- **Dark and light mode** support
- **Contextual adaptations** for different backgrounds

### Border Radius

Border radius tokens provide consistent corner rounding across components:

- **Small radius**: For subtle rounded corners
- **Medium radius**: Standard rounding for most components
- **Large radius**: For prominent rounded elements
- **Circle**: For fully rounded elements
- **None**: For sharp, square corners

### Typography

Typography tokens define the foundational text styles used throughout the system.

#### Mística's Font Stack

The typography system includes carefully selected fonts that ensure:

- **Legibility** across all devices and screen sizes
- **Brand consistency** with Telefónica's visual identity
- **Performance optimization** with web-safe fallbacks
- **Accessibility** compliance with reading standards

#### Brand Fonts

Furthermore, if your project or product requires it to create a cohesive brand experience, you have available brand-specific fonts that align with Telefónica's visual identity.

#### What are Text-Presets?

The text-presets nomenclature allows us to make these styles reusable on different screens and in different contexts, regardless of their location. At the same time, they make it possible to create a relationship of sizes between the different formats and devices with which we design: mobile, desktop, TV, etc., allowing us to address the different content and requirements of a product.

**Currently available sizes:**

- **App/Mobile**: Optimized for mobile interfaces
- **Desktop**: Optimized for desktop and larger screens

#### Typography Hierarchy

Text-presets are organized in a hierarchical system:

- **text-preset-1**: Largest size for main headings
- **text-preset-2**: Large headings and important titles
- **text-preset-3**: Medium headings and section titles
- **text-preset-4**: Small headings and labels
- **text-preset-5**: Body text and standard content
- **text-preset-6**: Small text and secondary information
- **text-preset-7**: Smallest text for captions and metadata

#### Weighing Details

Mística doesn't allow the possibility of playing with different types of weights in large sizes (from text-preset-5 onwards). This is because we consider large typographic sizes as a feature that a brand can leverage to showcase its personality, therefore, the size of these larger weights is determined by each skin.

#### Correspondences

The sizes shown in the system correspond to the size and height of the line, ensuring proper spacing and readability across all implementations.

#### Combining Text-Presets

Text-presets allow styles to be reused across different screens and contexts, regardless of their location. This means that, for example, a text-preset-5 (18 Light) can be used either as a Title or as a Body.

For this reason, we have defined a hierarchy that helps us combine the different styles in a logical way when designing.

### Accessibility in Typography

Typography tokens are designed with accessibility in mind:

- **Sufficient contrast ratios** for all text colors
- **Scalable text sizes** that work with browser zoom
- **Clear font choices** that maintain legibility
- **Proper line spacing** for comfortable reading

## Conversational Design Language

### Overview

Conversation design is a design language based on human conversation. It's a synthesis of several design disciplines, including:

- **Voice user interface design**
- **Interaction design**
- **Visual design**
- **Motion design**
- **Audio design**
- **UX writing**

The designer curates the conversation, defining the flow and its underlying logic in a detailed design specification that completes the user experience.

### Multimodal Nature

It's a common misconception to assume that "conversation" refers only to what is spoken or heard. Conversation is inherently **multimodal**, incorporating:

- **Text-based interactions**
- **Voice commands and responses**
- **Visual feedback and cues**
- **Gesture-based inputs**
- **Contextual awareness**

### What is Aura?

Aura represents Telefónica's conversational AI and voice interface system, integrated into the Mística design system to provide consistent conversational experiences across all touchpoints.

---

_This document is part of the Mística Digital Design System documentation series. Continue with Part 4: Layouts for information about layout systems and responsive design._
