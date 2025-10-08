# Carousels

_Carousels allow several elements to be grouped together in a reduced space with the help of horizontal scroll._

## Overview

Carousels are interactive components that enable users to browse through multiple items horizontally within a constrained space. They are particularly useful for displaying collections of content such as cards, images, or other components in an organized, space-efficient manner.

## Types of Carousels

Mística provides three distinct carousel types, each optimized for different use cases:

### 1. Carousel (Standard)

The standard carousel is the most flexible and commonly used variant.

**Characteristics**:

- Wide range of configuration options
- Supports both free and paged scrolling
- Can include autoplay functionality
- Optional bullet point navigation
- Configurable page offset settings

**Use Cases**:

- Product galleries
- Content recommendations
- Featured items display
- Multi-item browsing

### 2. Centered Carousel

Forces elements to appear centered on the screen for focused content presentation.

**Characteristics**:

- Elements are always centered
- Cannot use free scrolling (paged only)
- No autoplay functionality
- No loop capability
- Optional bullet point navigation

**Use Cases**:

- Hero content display
- Featured product showcase
- Focused content presentation
- Single-item emphasis

### 3. Slideshow

Full-width image carousel optimized for visual storytelling.

**Characteristics**:

- Full-width image display
- Supports all standard carousel configurations
- Optimized for visual content
- Ideal for hero sections

**Use Cases**:

- Hero banners
- Image galleries
- Visual storytelling
- Marketing campaigns

## Configuration Options

Carousels offer extensive configuration capabilities to adapt to different needs:

### Scrolling Behavior

**Free Scrolling**:

- Users can scroll freely without anchor points
- Smooth, continuous navigation
- Natural touch/mouse interaction

**Paged Scrolling**:

- Items anchor to specific positions
- Friction when moving between items
- More controlled navigation experience

### Autoplay

**Features**:

- Automatic item transitions (5 seconds by default)
- Customizable timing intervals
- Only available with loop functionality
- Prevents stopping at the last item

**Considerations**:

- Use sparingly to avoid overwhelming users
- Provide clear pause/play controls
- Ensure accessibility compliance

### Loop Functionality

**Behavior**:

- Infinite scrolling capability
- Returns to first item after last item
- Only available with autoplay mode
- Seamless user experience

### Page Offset

Controls the visibility of next/previous items:

**Regular Offset**:

- Standard preview of adjacent items
- Balanced content visibility

**Large Offset**:

- Extended preview of next item
- Enhanced navigation context

### Bullet Points Navigation

**Features**:

- Visual indicator of current position
- Direct navigation to specific items
- Can be shown or hidden based on design needs
- Helps users understand content scope

## Carousel-Specific Behaviors

### Standard Carousel Configuration

Available configurations:

- **Free**: ✅ Available
- **Paged**: ✅ Available
- **Autoplay**: ✅ Available
- **Loop**: ✅ Available (only with autoplay)
- **Page Offset**: ✅ Regular and Large
- **Bullet Points**: ✅ Show/Hide option

### Centered Carousel Constraints

Specific limitations:

- **Free**: ❌ Not available
- **Paged**: ✅ Required (default behavior)
- **Autoplay**: ❌ Not available
- **Loop**: ❌ Not available
- **Page Offset**: ✅ Available
- **Bullet Points**: ✅ Show/Hide option

### Slideshow Configuration

Full feature set:

- **Free**: ✅ Available
- **Paged**: ✅ Available
- **Autoplay**: ✅ Available (5 seconds default)
- **Loop**: ✅ Available (only with autoplay)
- **Page Offset**: ✅ Regular and Large
- **Bullet Points**: ✅ Show/Hide option

## Custom Controls

Carousels support custom control implementations for enhanced user experience:

**Control Types**:

- Previous/Next buttons
- Bullet point indicators
- Progress indicators
- Custom navigation elements

**Positioning**:

- Overlay controls on content
- External control placement
- Integrated with carousel container

**Customization**:

- Brand-specific styling
- Custom icons and interactions
- Responsive behavior
- Accessibility enhancements

## Content Integration

### Card Integration

When cards are used within carousels:

- Card sizing adapts to carousel constraints
- Alignment properties modify based on carousel type
- Content hierarchy remains consistent
- Interactive elements maintain functionality

### Media Content

**Images**:

- Responsive sizing
- Aspect ratio preservation
- Lazy loading support
- Alt text requirements

**Videos**:

- Autoplay considerations
- Mobile optimization
- Bandwidth awareness
- Accessibility compliance

## Responsive Behavior

### Mobile Considerations

**Touch Interactions**:

- Swipe gesture support
- Natural scrolling physics
- Momentum scrolling
- Edge feedback

**Performance**:

- Optimized rendering
- Memory management
- Battery efficiency
- Network considerations

### Desktop Optimizations

**Mouse Interactions**:

- Hover states
- Drag functionality
- Keyboard navigation
- Focus management

**Display Adaptations**:

- Multi-item visibility
- Responsive breakpoints
- Content scaling
- Navigation prominence

## Accessibility

### Keyboard Navigation

**Required Support**:

- Arrow key navigation
- Tab order management
- Focus indicators
- Screen reader compatibility

### Screen Reader Support

**Implementation Requirements**:

- Descriptive labels
- Live region announcements
- Item count information
- Navigation state communication

### Motor Accessibility

**Considerations**:

- Sufficient target sizes
- Clear navigation controls
- Pause/play functionality
- Alternative navigation methods

## Usage Guidelines

### When to Use Carousels

**Ideal Scenarios**:

- Space-constrained layouts
- Multiple related items
- Progressive disclosure
- Content exploration

### When to Avoid Carousels

**Poor Use Cases**:

- Critical information that must be seen
- Long lists better suited for scrolling
- Single-item display
- Content requiring detailed analysis

### Best Practices

**Design Principles**:

- Limit to 7-10 items for optimal usability
- Provide clear navigation indicators
- Ensure content is discoverable
- Test across devices and assistive technologies

**Content Guidelines**:

- Use consistent item sizing
- Maintain visual hierarchy
- Provide meaningful captions
- Ensure all content is accessible via alternative means

## Performance Considerations

### Optimization Strategies

**Loading**:

- Implement lazy loading for non-visible items
- Optimize image sizes and formats
- Consider progressive enhancement

**Rendering**:

- Use hardware acceleration where appropriate
- Minimize DOM manipulation
- Implement efficient event handling

**Memory Management**:

- Clean up resources for off-screen items
- Monitor memory usage patterns
- Implement efficient caching strategies

## Technical Implementation

### Development Considerations

**Framework Integration**:

- Component lifecycle management
- State management patterns
- Event handling architecture
- Testing strategies

**Configuration Management**:

- Provide clear API documentation
- Support for development teams
- Configuration validation
- Error handling patterns

For detailed implementation guidelines and code examples, refer to the technical documentation and component library.
