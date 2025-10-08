# Avatar Component

_Visual representation of users and entities_

## Overview

Avatar is a visual representation of a user or entity profile in the interface. It supports images, text as initials, and icons, providing a humanizing touch to digital interfaces.

## Typology

The avatar definition is split into 4 types:

### 1. Image Avatar

**Purpose**: Whenever possible, use a thumbnail image of a user to provide an additional humanizing touch to the interface and help visually organize information.

**Fallback System**: If there is an error loading the Avatar Image, the component uses fallbacks in this order:

1. If there's a name prop, generates initials
2. If there's no name prop, uses a default icon avatar

### 2. Initials Avatar

**Purpose**: When no image source is provided, the first two characters of the provided name are used as a placeholder.

**Behavior**:

- Initials are generated intelligently based on user name
- Always displays a maximum of 2 characters
- Initials are displayed capitalized
- Uses smart parsing to select appropriate characters

### 3. Icon Avatar

**Purpose**: Icons can be displayed instead of images or initials for generic entities or when user information is not available.

**Use cases**:

- Default state for new users
- System entities or services
- Anonymous users or guests
- Generic representations

### 4. Inverse Avatar

**Purpose**: Use this Avatar type on colored backgrounds to ensure proper contrast and visibility.

**Context**: Designed specifically for use over:

- Dark backgrounds
- Colored containers
- Media backgrounds
- Branded surfaces

## Sizing

### Default Size

By default, the Avatar component is available in **Large size** but can be resized as needed.

### Recommended Standard Sizes

- **24px**: Small avatars for compact layouts
- **32px**: Regular size for lists and cards
- **40px**: Medium size for prominent display
- **56px**: Large size for profiles and headers
- **64px**: Extra large for profile pages and hero sections

### Responsive Considerations

- Consider different sizes for different screen sizes
- Ensure minimum touch target size on mobile (44px recommended)
- Test readability of initials at smaller sizes

## Avatar with Badge

Each Avatar type supports a badge (non-numeric or numeric) on the top-right corner.

### Use Cases

- **New information available**: Indicate updates or notifications
- **Status indicators**: Online/offline, availability status
- **Reminders and notifications**: Personal alerts and messages
- **Counters**: Number of unread messages or notifications

### Badge Types

- **Non-numeric badge**: Simple indicator dot
- **Numeric badge**: Shows count up to 99+ format

For detailed badge behavior, see the [Badge component documentation](./badge.md).

## Custom Colors

Avatar backgrounds can be customized to match brand colors or provide visual variety in user interfaces while maintaining accessibility standards.

### Color Guidelines

- Ensure sufficient contrast for initials text
- Use consistent color schemes across the application
- Consider accessibility for color-blind users
- Maintain brand color consistency

## Implementation Guidelines

### Image Optimization

- **Format**: Use web-optimized formats (WebP, optimized JPEG/PNG)
- **Size**: Provide images at 2x resolution for crisp display on high-DPI screens
- **Aspect ratio**: Use 1:1 (square) aspect ratio
- **Loading**: Implement progressive loading for better performance

### Accessibility

- **Alt text**: Provide meaningful alt text for screen readers
- **Focus states**: Ensure interactive avatars have visible focus indicators
- **Color contrast**: Maintain WCAG AA compliance for text on background
- **Screen reader**: Announce user names and status information

### Performance

- **Image caching**: Implement proper caching strategies
- **Lazy loading**: Load images only when needed
- **Fallback handling**: Graceful degradation when images fail
- **Size optimization**: Serve appropriately sized images

## Usage Examples

### Profile Display

```
[Avatar] John Doe
Senior Designer
```

### User Lists

```
[Avatar] John Doe     [Badge]
[Avatar] Jane Smith   [Badge]
[Avatar] Mike Johnson
```

### Comments Section

```
[Avatar] John Doe
"This looks great! I especially like the color scheme."
2 hours ago
```

### Navigation Header

```
[Logo] ——————————————— [Avatar with dropdown]
```

## Best Practices

### Do's

- Use real user photos when available
- Implement proper fallback hierarchy
- Maintain consistent sizing within contexts
- Provide meaningful alternative text
- Use appropriate badge indicators

### Don'ts

- Don't use low-quality or pixelated images
- Don't ignore accessibility requirements
- Don't make avatars too small to be recognizable
- Don't use inappropriate or offensive placeholder images
- Don't overcrowd with too many badges

## States

### Default States

- **Normal**: Standard display state
- **Loading**: While image is being fetched
- **Error**: When image fails to load (shows fallback)
- **Empty**: No user data available (shows default icon)

### Interactive States

When avatars are interactive (clickable):

- **Hover**: Visual feedback on mouse over
- **Focus**: Keyboard focus indicator
- **Active**: Pressed/clicked state
- **Disabled**: When interaction is not available

## Integration Notes

### With Other Components

Avatars integrate seamlessly with:

- **[Badges](./badge.md)**: For notification indicators
- **Cards**: In user profile cards
- **Lists**: For user lists and directories
- **Headers**: For user account access
- **Comments**: For user identification in discussions

### Data Requirements

- **User name**: For initials generation
- **Image URL**: For photo display
- **Alternative text**: For accessibility
- **Status information**: For badge display

---

_Part of the Mística Design System component library_
