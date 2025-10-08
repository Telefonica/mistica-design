# Buttons Component

_Action triggers and interactive elements_

## Overview

Buttons let users perform actions and make choices immediately with simple interaction. They are one of the most fundamental interactive elements in any interface, providing clear calls-to-action and enabling user tasks.

## Anatomy

All button types have the following elements:

### Core Elements

1. **Label**: Text describing the action the button will perform
2. **Container**: Button background, borders, and overall shape
3. **Icon (optional)**: Visual element that supports or replaces the label
4. **Loading spinner**: Shown during processing states
5. **Loading label**: Text shown during loading state

### Icon Integration

#### Leading Icons

- **Position**: Appear before (to the left of) the label
- **Purpose**: Provide visual context or enhance recognition
- **Usage**: Common actions like "Save", "Download", "Print"

#### Trailing Icons

- **Position**: Appear after (to the right of) the label
- **Purpose**: Indicate direction or additional functionality
- **Usage**: Dropdown arrows, external links, forward navigation

## Size Variants

### Standard Size

**Default button size** for most use cases:

- Optimal for desktop and tablet interfaces
- Good balance of visibility and proportion
- Recommended for primary actions

### Small Variant

**Compact version** used for specific scenarios:

#### Spatial Needs

- **Compact components**: When space is limited
- **Dense interfaces**: Tables, cards, inline actions
- **Secondary actions**: Less prominent functionality

#### Screen Prominence

- **Page hierarchy**: Creating visual hierarchy and focus
- **Action priority**: De-emphasizing secondary actions
- **Interface balance**: Avoiding button overwhelm

## Button States

Buttons can present the following different states:

### Basic States

- **Normal**: Default, ready-for-interaction state
- **Hover**: Desktop-only state when mouse is over the button
- **Focus**: Accessibility state for keyboard navigation (system-determined)
- **Disabled**: Non-interactive state when action is unavailable

### Interaction States

- **Pressed**: Visual feedback during click/tap (Android)
- **Selected**: Sustained selection state (iOS)
- **Active**: General pressed/active state (Desktop)

### Processing States

- **Loading**: Shows spinner and optional loading text
- **Processing**: Button becomes non-interactive during action execution

## Loading State

When processing an action, buttons provide clear feedback:

### Visual Changes

- **Loading spinner**: Animated indicator showing progress
- **Loading label**: Optional text like "Saving..." or "Processing..."
- **Disabled interaction**: Prevents multiple submissions
- **Visual feedback**: Clear indication that action is in progress

### Implementation Notes

- Maintain button size during loading
- Provide meaningful loading text when helpful
- Ensure loading state is accessible to screen readers
- Set appropriate timeout handling

## Button Types and Variants

### Primary Buttons

- **Purpose**: Main actions, highest priority
- **Usage**: One per screen/section typically
- **Examples**: "Save", "Submit", "Continue", "Purchase"

### Secondary Buttons

- **Purpose**: Alternative actions, medium priority
- **Usage**: Multiple allowed per screen
- **Examples**: "Cancel", "Back", "Learn More"

### Tertiary/Text Buttons

- **Purpose**: Low priority actions, minimal visual weight
- **Usage**: Multiple allowed, often for navigation
- **Examples**: "Skip", "Dismiss", "View Details"

### Inverse Buttons

- **Purpose**: Use on colored backgrounds
- **Context**: Over media, dark backgrounds, branded surfaces
- **Accessibility**: Ensures proper contrast ratios

## Accessibility

### Keyboard Support

- **Tab navigation**: Buttons are focusable via Tab key
- **Enter activation**: Buttons activate with Enter key
- **Space activation**: Buttons activate with Space key
- **Focus indicators**: Clear visual indication of keyboard focus

### Screen Reader Support

- **Button role**: Proper semantic button elements or ARIA roles
- **Descriptive labels**: Clear, action-oriented text
- **State announcements**: Loading, disabled, and pressed states
- **Context information**: Additional context when label alone isn't sufficient

### Visual Accessibility

- **Color contrast**: Meet WCAG AA standards for text and background
- **Size requirements**: Minimum 44px touch target on mobile
- **Focus indicators**: Visible focus states for keyboard users
- **State differentiation**: Clear visual differences between states

## Usage Guidelines

### Content Guidelines

#### Button Labels

- **Action-oriented**: Use verbs that describe what will happen
- **Specific**: "Save Changes" instead of just "OK"
- **Concise**: Keep labels short but descriptive
- **Consistent**: Use the same labels for the same actions throughout

#### Examples of Good Labels

- "Add to Cart" (not "Add")
- "Download PDF" (not "Download")
- "Send Message" (not "Send")
- "Create Account" (not "Submit")

### Placement Guidelines

#### Primary Actions

- **Prominent placement**: Easy to find and access
- **Logical order**: Follow expected patterns (OK/Cancel)
- **Visual hierarchy**: Most important action should be most prominent

#### Secondary Actions

- **Supporting role**: Present but not competing with primary
- **Logical grouping**: Related actions grouped together
- **Clear distinction**: Visually different from primary actions

## Responsive Behavior

### Desktop

- **Hover states**: Rich interaction feedback
- **Precise clicking**: Smaller targets acceptable
- **Keyboard navigation**: Full keyboard support

### Tablet

- **Touch-friendly**: Larger targets for finger interaction
- **No hover**: Focus on tap interactions
- **Orientation awareness**: Adapt to portrait/landscape

### Mobile

- **Minimum touch targets**: 44px minimum for accessibility
- **Thumb-friendly placement**: Consider thumb reach zones
- **Gesture integration**: Work with mobile interaction patterns

## Integration with Forms

### Form Submission

- **Primary submit button**: Clear indication of main action
- **Validation integration**: Disabled until form is valid
- **Error handling**: Clear feedback for failed submissions

### Multi-step Forms

- **Next/Continue buttons**: Progress through steps
- **Back buttons**: Return to previous steps
- **Save draft functionality**: Preserve user progress

## Best Practices

### Do's

- Use clear, action-oriented labels
- Provide appropriate visual hierarchy
- Include loading states for async actions
- Test with keyboard navigation
- Follow platform conventions
- Group related actions logically

### Don'ts

- Don't use vague labels like "Click Here" or "Submit"
- Don't make too many buttons primary (typically one per section)
- Don't forget disabled and loading states
- Don't ignore mobile touch target sizes
- Don't rely solely on color to convey button state
- Don't place destructive actions next to primary actions

## Common Patterns

### Call-to-Action (CTA)

```html
<button class="primary">Get Started Today</button>
```

### Form Actions

```html
<button class="primary" type="submit">Save Changes</button>
<button class="secondary" type="button">Cancel</button>
```

### Navigation

```html
<button class="secondary">
  <icon>arrow-left</icon>
  Back
</button>
<button class="primary">
  Continue
  <icon>arrow-right</icon>
</button>
```

### Loading State

```html
<button class="primary" disabled>
  <spinner></spinner>
  Saving...
</button>
```

---

_Part of the Mística Design System component library_
