# Cards

*A card is a component that displays grouped content on a single topic. It is always displayed inside a box-shaped container.*

## Overview

Cards serve as entry points to access more detailed information and can also start processes for users to complete. They are versatile containers that help organize and present content in a visually appealing and structured way.

## Types and Sizes

Mística provides four main card types, each optimized for different content presentation needs:

- **Cover Card** - For strong visual impact with imagery
- **Media Card** - For highlighted content with accompanying images  
- **Data Card** - For displaying relevant product/service information
- **Naked Card** - For flexible content presentation

## Common Elements

All card types share the same set of common elements, which are optional and can be combined freely:

- **Asset**: 40×40 asset such as a vector or bitmap
- **Dismiss**: Closes or hides the card
- **Top actions**: Customizable actions
- **Tag**: Used to display content states
- **Pretitle**: Complementary information for the title (e.g., categories)
- **Title**: Include at least a title to ensure hierarchy. Keep it within 2 lines
- **Description**: Short text giving context or details. Try not to exceed 2 lines
- **Body slot**: Custom content area for flexible layouts
- **Bottom actions**: Can include a link, a small button, or both
- **Footer**: Used to separate content at the bottom of the card. Optionally visible, with customizable background and theming
- **Media**: Can be an image or a video, positioned differently based on card type

## Media and Aspect Ratios

### Media Usage

Media can be used in two ways depending on the card type:

- **Cover Card**: As a background, occupying the full card
- **Media and Naked Cards**: As a positioned element, placed at the top, left, or right

### Aspect Ratios

The supported aspect ratios are:
- **16:9** - Wide cinematic format
- **21:9** - Ultra-wide format  
- **7:10** - Portrait format
- **4:3** - Classic format
- **1:1** - Square format
- **Free** - Allows height to adapt to content with no fixed proportion

**Important**: If content height exceeds the height defined by the aspect ratio, the card will grow independently to accommodate the content.

## Card Types

### Cover Card

**Purpose**: Designed to create strong visual impact and draw user attention to imagery or audiovisual content.

**Characteristics**:
- Image/video used as background covering the full card
- Aspect ratio defines the base height of the entire card
- Content always aligns to the bottom
- Ideal for hero content and promotional materials

### Media Card

**Purpose**: Used to display highlighted content and is always accompanied by an image.

**Media Positions**:
- **Top positioned** (default)
- **Left positioned**
- **Right positioned**

**Characteristics**:
- Media element can be repositioned for layout flexibility
- Aspect ratio applies only to the image, not total card height
- Content aligns to the top when grouped

### Data Card

**Purpose**: Specifically designed to display relevant information about products or services for users.

**Characteristics**:
- Optimized for information display
- Clear hierarchy for data presentation
- Content alignment varies by size:
  - **Display size**: Aligns to bottom
  - **Default and Snap sizes**: Align to top

### Naked Card

**Purpose**: Provides maximum flexibility for content presentation.

**Media Features**:
- Supports both images and videos
- Unique feature: Supports circular images (not available for videos)
- Media positioning options: top, left, or right
- Note: When using circular images, avoid top actions as layout may become unbalanced

**Color Customization**:
- Allows custom color schemes
- Flexible theming options

## Card Grouping

When cards are grouped together, their behavior adapts for visual consistency:

### Height Matching
- All cards in a group adjust to match the tallest card
- Content alignment becomes critical for visual consistency

### Alignment Rules by Type
- **Cover Card**: Always aligns content to the bottom
- **Media and Naked Card**: Always align content to the top
- **Data Card**: 
  - Display size: Aligns to bottom
  - Default and Snap sizes: Align to top

### Carousel Integration
When cards are inside carousels, they modify their size and alignment properties. Refer to carousel documentation for specific behaviors.

## Slots

Slots provide component customization capabilities:

**Purpose**: 
- Offer flexibility and scalability
- Allow adaptation to specific product requirements
- Enable custom content insertion

**Location**: 
- Inserted between content and actions in the card body
- Available in both body and footer areas

**Examples**:
- Custom data displays
- Interactive elements
- Specialized content layouts
- Brand-specific components

## Interaction Patterns

Cards support various interaction patterns:

- **Tap/Click**: Navigate to detailed content
- **Top Actions**: Quick actions without navigation
- **Bottom Actions**: Primary and secondary actions
- **Dismiss**: Remove or hide the card
- **Swipe**: Carousel navigation (when applicable)

## Accessibility

### Key Considerations
- All interactive elements must be keyboard accessible
- Provide meaningful alt text for images
- Ensure sufficient color contrast
- Use proper heading hierarchy
- Support screen reader navigation

### Implementation Notes
- Cards should have clear focus indicators
- Action buttons need descriptive labels
- Media content requires appropriate alternative text
- Navigation between cards should be logical and predictable

## Usage Guidelines

### When to Use Cards
- Displaying grouped, related content
- Creating entry points to detailed information
- Organizing content in grid or list layouts
- Presenting actionable content with clear CTAs

### When Not to Use Cards
- For single pieces of information that don't need grouping
- When content doesn't warrant the visual separation
- In dense layouts where cards add unnecessary visual weight

### Best Practices
- Keep titles concise (within 2 lines)
- Limit descriptions to essential information
- Use consistent aspect ratios within card groups
- Ensure sufficient contrast between card content and background
- Test card layouts across different screen sizes

## Technical Implementation

Cards are implemented as flexible container components that:
- Adapt to different content types
- Support responsive behavior
- Integrate with the broader design system
- Maintain consistent spacing and typography
- Support theming and customization

For detailed implementation guidelines, refer to the technical documentation and component API reference.