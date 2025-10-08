# Counter

_A counter is a component used to increase or decrease a numeric value._

## Overview

The counter component provides users with an intuitive way to adjust numeric values through increment and decrement controls. It's particularly useful for quantity selection, settings adjustment, and any interface where precise numeric input within a specific range is required.

## Anatomy

The counter consists of essential elements that work together to provide clear numeric control:

### Core Elements

**Increase Button** (Required):

- Plus (+) icon or similar increment indicator
- Allows users to raise the current value
- Should be clearly distinguishable
- Provides immediate visual feedback

**Decrease Button** (Required):

- Minus (-) icon or similar decrement indicator
- Allows users to lower the current value
- Should be clearly distinguishable
- May be disabled when minimum value is reached

**Value Text** (Required):

- Displays the current numeric value
- Should be clearly readable
- Updates immediately with user interactions
- May include unit indicators (e.g., "3 items")

### Optional Elements

**Remove Button** (Optional):

- Trash/delete icon or similar removal indicator
- Allows complete removal of the item/element
- Used when the counter represents removable items
- Typically appears when appropriate for the context

## Behavior

### Value Management

**Default Value**:

- Provide meaningful default values when possible
- Consider user context and common use cases
- Avoid starting at zero unless appropriate

**Range Constraints**:

- Define minimum and maximum values
- Disable buttons when limits are reached
- Provide clear feedback about constraints
- Inform users of any range limitations

**Step Increments**:

- Define appropriate step values (typically 1)
- Consider context-specific increments
- Maintain consistency across similar counters

### Remove Functionality

The remove button serves a specific purpose when items can be completely removed:

**Use Cases**:

- Shopping cart items that can be deleted
- Selected options that can be cleared
- List items that can be removed entirely

**Behavior**:

- Typically removes the entire item/context
- May trigger confirmation for important actions
- Should be clearly distinguished from decrease functionality
- May show different states (enabled/disabled/hidden)

## Usage Guidelines

### When to Use Counters

**Ideal Scenarios**:

- Small value ranges where users seldom deviate from defaults
- Quantity selection (items, people, duration)
- Settings with numeric inputs
- Stepper-like interfaces
- Constrained numeric input

**Recommended Range**:

- Values typically between 0-20
- Consider user cognitive load
- Evaluate if the range warrants counter vs. text input

### When Not to Use Counters

**Better Alternatives**:

- **Integer Field**: For large value ranges or precise input
- **Text Field**: When users need to type specific values
- **Slider**: For approximate values within a range
- **Dropdown**: For preset value selection

### Content and Context

**Labeling**:

- Provide clear context for what the counter controls
- Use descriptive labels or surrounding content
- Consider unit indicators (pieces, minutes, items)

**Error Prevention**:

- Inform users of minimum/maximum constraints
- Provide helpful messaging about limits
- Disable inappropriate actions rather than allowing errors

## Accessibility

### Keyboard Navigation

**Required Support**:

- Tab navigation to reach counter controls
- Enter/Space to activate buttons
- Arrow keys for increment/decrement (optional enhancement)
- Clear focus indicators on all interactive elements

### Screen Reader Support

**Implementation Requirements**:

- Proper button labeling ("increase", "decrease", "remove")
- Current value announcements
- Range information when relevant
- Context about what is being counted

### Motor Accessibility

**Considerations**:

- Adequate button size for touch interaction
- Sufficient spacing between controls
- Clear target areas for precise interaction
- Alternative input methods when possible

## Visual Design

### Button Design

**Visual Hierarchy**:

- Clear distinction between increment/decrement buttons
- Consistent icon usage and sizing
- Appropriate visual weight for context

**State Indicators**:

- Disabled states when limits are reached
- Hover and active states for feedback
- Focus indicators for keyboard navigation

### Value Display

**Typography**:

- Clear, readable numeric display
- Appropriate sizing for context
- Consistent number formatting

**Formatting**:

- Use appropriate number formatting
- Include units when helpful
- Consider localization needs

## Responsive Behavior

### Mobile Considerations

**Touch Interaction**:

- Adequate touch target size (minimum 44px)
- Appropriate spacing between controls
- Touch-friendly button design
- Prevent accidental activations

**Layout Adaptation**:

- Responsive sizing for different screen sizes
- Appropriate scaling of controls
- Maintain usability across devices

### Desktop Optimizations

**Enhanced Interactions**:

- Hover states for better feedback
- Keyboard shortcuts when appropriate
- Precise clicking interactions
- Mouse wheel support (where applicable)

## Technical Implementation

### State Management

**Value Tracking**:

- Immediate value updates
- Constraint validation
- Change event handling
- Undo/redo consideration

**Performance**:

- Efficient rendering updates
- Debounced value changes when appropriate
- Memory optimization for multiple counters

### Integration Patterns

**Form Integration**:

- Proper form value submission
- Validation integration
- Error state handling
- Reset functionality

**Component Communication**:

- Change event broadcasting
- Parent component notification
- State synchronization
- Batch update support

## Use Case Examples

### Shopping Cart Quantity

**Context**: Adjusting item quantities in e-commerce
**Features**: Increase/decrease quantity, remove item entirely
**Constraints**: Minimum 1, maximum based on inventory

### Settings Configuration

**Context**: Adjusting numeric preferences
**Features**: Increment/decrement values within acceptable ranges
**Constraints**: Defined min/max based on system limitations

### Time Duration Selection

**Context**: Selecting time periods (minutes, hours)
**Features**: Adjust duration with appropriate step increments
**Constraints**: Reasonable time bounds for the context

### Guest/Attendee Count

**Context**: Selecting number of people for reservations
**Features**: Adjust count with logical limits
**Constraints**: Venue capacity or service limitations

## Best Practices

### User Experience

**Clarity**:

- Make the counter's purpose immediately clear
- Provide context about what is being counted
- Show constraints and limitations clearly

**Efficiency**:

- Reduce steps required for common values
- Consider keyboard shortcuts for power users
- Optimize for the most common use cases

### Content Strategy

**Default Values**:

- Choose sensible defaults based on user behavior
- Consider context and common use patterns
- Avoid surprising users with unexpected defaults

**Feedback**:

- Provide immediate visual feedback
- Communicate constraints clearly
- Show progress toward limits when relevant

For detailed implementation guidelines and code examples, refer to the technical documentation and accessibility standards.
