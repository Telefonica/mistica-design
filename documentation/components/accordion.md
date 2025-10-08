# Accordion Component

_Expandable content sections for organizing information_

## Overview

Accordions are interactive components that allow users to show and hide content sections, helping to organize information in a compact and scannable format.

## Key Features

- **Expandable sections**: Click to reveal/hide content
- **Flexible content**: Supports various content types in slots
- **Multiple compositions**: Different layout patterns available
- **Accessibility**: Full keyboard navigation and screen reader support

## Anatomy

An Accordion is an individual component, but it is very common to display multiple Accordions stacked vertically to visually present them as a group.

The Accordion is made up of a header and a content panel and it has two different views: collapsed and expanded. When expanded, the panel displays text as a paragraph or custom content if needed.

### Header Components

1. **Asset (optional)**: Visual element like icon or image
2. **Title (required)**: Should be as brief as possible while still being clear and descriptive
3. **Subtitle (optional)**: Should be short and concise
4. **Detail**: Secondary text to provide brief information
5. **Action chevron (required)**: Indicates if the panel is expanded or collapsed

### Panel Components

An accordion must always show content associated with the header:

6. **Body content (required)**: Content inside a panel may be paragraphs and include custom content if needed
7. **Divider (optional)**: Visual separator between sections

## Usage Guidelines

### When to Use

- **Information organization**: When you have multiple sections of related content
- **Space management**: To conserve vertical space while keeping content accessible
- **Progressive disclosure**: When users need to focus on specific sections
- **FAQ sections**: Perfect for frequently asked questions format

### When Not to Use

- **Critical information**: Don't hide essential information that users need immediately
- **Single content block**: Not necessary for content that doesn't need to be hidden
- **Navigation**: Don't use for primary navigation elements

## Behavior

### Interaction States

- **Collapsed**: Default state showing only the header
- **Expanded**: Shows header and content panel
- **Loading**: While content is being fetched (if applicable)
- **Disabled**: When interaction is not available

### Keyboard Navigation

- **Tab**: Navigate between accordion headers
- **Enter/Space**: Toggle accordion open/closed
- **Arrow keys**: Navigate between accordion items in a group
- **Home/End**: Jump to first/last accordion in a group

## Grouped Accordions

Although it is not a type of component accordion as such, given that it would be built at the atomic level, it serves as a solution in cases where you need to group accordions together to better organize the information.

To build grouped accordions, use the boxed and accordion components together at the atomic level.

### Examples of Compositions

Different compositions can be built using this method to accommodate various content organization needs.

## Slot Customization

The body content of an Accordion can be quite versatile and adapt to various information presentation needs. Use the Slot if you need to include:

- **Links and interactive elements**
- **Text in different formats** (lists, paragraphs, headings)
- **Media content** (images, videos)
- **Form elements** (when appropriate)
- **Other UI components**

## Accessibility

### ARIA Support

- **aria-expanded**: Indicates whether the accordion panel is expanded
- **aria-controls**: Associates the button with the panel it controls
- **aria-labelledby**: Associates the panel with its header
- **role="button"**: For accordion headers that aren't button elements

### Screen Reader Support

- Clear announcement of expanded/collapsed state
- Proper heading hierarchy within content
- Descriptive labels for interactive elements

### Focus Management

- Visible focus indicators on interactive elements
- Logical tab order through accordion groups
- Focus remains on trigger after expansion/collapse

## Implementation Notes

### Performance

- **Lazy loading**: Consider loading content only when expanded
- **Virtual scrolling**: For accordions with many items
- **Animation optimization**: Use CSS transforms for smooth transitions

### Responsive Behavior

- Accordions adapt well to different screen sizes
- Consider stacking behavior on mobile devices
- Ensure touch targets meet minimum size requirements

### Best Practices

- Keep header text concise but descriptive
- Provide visual cues for expandable content
- Test with real content to ensure proper behavior
- Consider default expanded state for important content

---

_Part of the Mística Design System component library_
