# Mística - Layouts

_Mística Digital Design System - Part 4: Layouts_

## Overview

In Mística we divide the layout components into two main groups:

### Full Page Oriented

- **Responsive Layout**
- **Grid Layout**

### Content Oriented

- **Grid**
- **Horizontal Scroll**

## Using Layout Components

Layout components can be combined and nested to create complex page structures. The following example mixes multiple layout components wrapped inside a responsive layout to demonstrate the flexible nature of the system.

## Responsive Layout

The responsive layout centers the content applying the correct margins in the horizontal axis for each of the different breakpoints defined.

### Breakpoints and Margins

| Breakpoint        | Device Range  | Horizontal Margin |
| ----------------- | ------------- | ----------------- |
| **Mobile**        | 320 - 767px   | 16px              |
| **Tablet**        | 768 - 1023px  | 32px              |
| **Desktop**       | 1024 - 1511px | 48px              |
| **Large Desktop** | +1512px       | auto              |

### Alignment Options

The responsive layout provides various alignment options to control how content is positioned within the container:

- **Left aligned**: Content aligns to the left edge
- **Center aligned**: Content centers within the container
- **Right aligned**: Content aligns to the right edge
- **Justified**: Content stretches to fill available width

## Grid Layout

Distributes the content in 12 columns with predefined gutters depending on the breakpoint. It is also possible to define the vertical spacing for tablet and mobile when the items are vertically stacked.

### Grid Specifications

| Breakpoint        | Device Range  | Columns | Column Size | Gutters |
| ----------------- | ------------- | ------- | ----------- | ------- |
| **Mobile**        | 320 - 767px   | 1       | Fluid       | —       |
| **Tablet**        | 768 - 1023px  | 1       | Fluid       | —       |
| **Desktop**       | 1024 - 1511px | 12      | Fluid       | 24px    |
| **Large Desktop** | +1512px       | 12      | 96px        | 24px    |

### Grid Layout Templates

The grid layout provides a set of predefined templates that distribute the content in identified patterns:

- **6 + 6**: Focused on image + text distributions
- **8 + 4**: Used for main content + aside distributions
- **4 + 6**: Used for the master detail layout
- **5 + 4**: Exclusively used for the full screen funnel
- **3 + 9**: Useful for compact navigation or filter left sections

## Grid Component

The grid component helps to distribute the content in both vertical and horizontal axes.

### Configuration Options

The grid allows the following configurations:

- **Columns and rows**: Define the amount of columns or rows
- **Grid item span**: Define the amount of columns, rows or both a grid item can occupy
- **Gutter**: Define the space between columns or rows
- **Alignment**: Define how items are aligned inside each cell of the grid

### Columns, Rows & Span

The number of columns and rows of the grid can either be:

- **Explicitly defined**: Set specific numbers for columns and rows
- **Automatically generated**: Based on the size and number of grid items

Grid items can span multiple columns or rows to create complex layouts and accommodate different content sizes.

### Gutter Spacing

The space between columns or rows can be defined independently:

- **Column gutters**: Horizontal spacing between grid items
- **Row gutters**: Vertical spacing between grid items
- **Uniform gutters**: Same spacing for both columns and rows
- **Custom gutters**: Different spacing for different sections

### Alignment

The grid items can be aligned both in the vertical and horizontal axes:

**Horizontal Alignment:**

- Left
- Center
- Right
- Stretch

**Vertical Alignment:**

- Top
- Center
- Bottom
- Stretch

## Horizontal Scroll

The Horizontal scroll component allows content overflow outside the parent container limits.

### Use Cases

- **Content carousels**: Displaying multiple items horizontally
- **Navigation tabs**: When there are too many tabs for the container width
- **Image galleries**: Horizontal scrolling through multiple images
- **Card collections**: Scrollable lists of cards or tiles

### Implementation Notes

- Automatically handles touch and mouse scrolling
- Provides scroll indicators when needed
- Maintains accessibility for keyboard navigation
- Responsive behavior across different screen sizes

## Fixed Footer Layout

The fixed footer layout allows placing content in an overlay fixed at the bottom of the screen in mobile devices. In desktop this overlay will disappear, the layer will not be fixed to the bottom and will behave like other content.

### Characteristics

- **Mobile behavior**: Fixed to bottom of screen
- **Desktop behavior**: Normal content flow
- **Flexible content**: Any content can be placed inside (slot-based)
- **Responsive adaptation**: Automatically adjusts based on screen size

### Common Use Cases

- **Action buttons**: Primary actions that need to remain accessible
- **Form submission**: Save/submit buttons for long forms
- **Navigation controls**: Bottom navigation tabs on mobile
- **Call-to-action elements**: Important actions that shouldn't scroll away

## Spacing

### Spacing Types

#### Box

It works as a "wrapping" of the component if applied. We can also add inner paddings to control the internal spacing of components.

#### Stack

The stack separates the spaces between components vertically, creating consistent vertical rhythm throughout the interface.

### Spacing Scale

Mística uses a consistent spacing scale that ensures:

- **Visual hierarchy**: Different spacing levels create clear content organization
- **Responsive behavior**: Spacing adapts appropriately across device sizes
- **Design consistency**: Uniform spacing patterns across all components
- **Accessibility**: Adequate touch targets and readability spacing

---

_This document is part of the Mística Digital Design System documentation series. Continue with Part 5: Components for detailed information about individual UI components._
