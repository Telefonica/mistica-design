# Chips

_Chips are interactive elements that provide users with a set of options. Users can tap a chip to make selections._

## Overview

Chips are compact, interactive components that enable users to make selections, filter content, organize information, or trigger actions. They offer a versatile way to display options in a space-efficient format and are particularly useful for categorization and filtering interfaces.

## Anatomy

Chips are composed of several elements that work together to provide clear functionality:

### Core Elements

**Container** (Required):

- Defines the boundary of each chip
- All chip elements are wrapped within the container
- Width adapts to content length

**Text Label** (Required):

- Describes what each chip represents
- Should be concise and descriptive
- Primary method of chip identification

### Optional Elements

**Icon** (Optional):

- 16x16 asset such as vectorial icon or bitmap
- Provides visual context or category indication
- Enhances recognition and usability

**Closable Icon** (Optional):

- Interactive area for removing the chip
- Typically an "X" or close symbol
- Enables dynamic chip management

**Badge** (Optional):

- Indicates important or new information
- Primarily used with navigation chips
- Shows count or status indicators

## Types of Chips

Chips have different behavioral patterns based on their intended use case:

### 1. Filter Chips (Checkbox Behavior)

**Functionality**:

- Function as checkboxes in a group
- Multiple selections allowed
- Independent selection states
- Ideal for search filters and content categorization

**Use Cases**:

- Content filtering (categories, tags, attributes)
- Search refinement
- Multi-criteria selection
- Preference settings

**Visual States**:

- **Unselected**: Default state, ready for selection
- **Selected**: Visually distinct, indicating active filter
- **Hover**: Provides selection preview

**Example**: Product filtering by size, color, brand, price range

### 2. Choice Chips (Radio Button Behavior)

**Functionality**:

- Function as radio buttons in a group
- Single selection only
- Selecting one deselects others
- Ideal for mutually exclusive options

**Use Cases**:

- Single option selection
- Settings with exclusive choices
- View mode selection
- Sorting options

**Visual States**:

- **Unselected**: Available for selection
- **Selected**: Single active choice highlighted
- **Hover**: Shows potential selection

**Example**: Sorting options (newest, oldest, price high-to-low)

### 3. Input Chips

**Functionality**:

- User-generated content representation
- Dynamic addition and removal
- Editable chip collections
- Support for keyboard input workflows

**Use Cases**:

- Tag management
- Keyword entry
- Contact/recipient selection
- Custom category creation

**Behavior**:

- **Addition**: Users can add new chips through input
- **Removal**: Chips can be deleted with close icon or keyboard
- **Editing**: May support inline editing of chip labels

**Example**: Email recipients, blog post tags, search keywords

### 4. Navigation Chips

**Functionality**:

- Serve as navigation entry points
- Link to different sections or pages
- May include badges for status indication
- Support for hierarchical navigation

**Use Cases**:

- Section navigation
- Quick access links
- Category browsing
- Status-based navigation

**Features**:

- **Badge Integration**: Show counts or new item indicators
- **Navigation State**: May indicate current location
- **Hierarchical Support**: Can represent nested navigation

**Example**: Category navigation with item counts, notification areas with badges

## Interaction Patterns

### Selection Behavior

**Single Tap/Click**:

- Primary interaction method
- Toggles state based on chip type
- Provides immediate visual feedback

**Keyboard Navigation**:

- Arrow keys for navigation between chips
- Space/Enter for selection
- Tab for moving to chip groups

### State Management

**Filter Chips**:

- Maintain independent states
- Support multiple active selections
- Clear indication of applied filters

**Choice Chips**:

- Ensure single selection enforcement
- Smooth transition between selections
- Clear deselection of previous choice

## Visual Design

### Size and Spacing

**Chip Dimensions**:

- Height: Consistent across chip types
- Width: Adaptive to content length
- Padding: Balanced internal spacing

**Group Spacing**:

- Consistent gaps between chips
- Adequate touch target spacing
- Visual grouping of related chips

### Typography

**Label Text**:

- Clear, readable font size
- Appropriate font weight for hierarchy
- Consistent text treatment across types

### Color and States

**State Indication**:

- Clear visual difference between selected/unselected
- Consistent color application
- Accessible contrast ratios

**Brand Alignment**:

- Integration with design system colors
- Consistent with overall interface theming

## Accessibility

### Keyboard Support

**Navigation Requirements**:

- Tab order integration
- Arrow key navigation within groups
- Enter/Space for activation
- Escape for canceling actions

### Screen Reader Support

**Implementation Needs**:

- Proper role definitions (checkbox, radio, button)
- Clear state announcements
- Group labeling for chip collections
- Description of chip purpose and state

### Visual Accessibility

**Contrast and Clarity**:

- Sufficient color contrast for all states
- Clear focus indicators
- Don't rely solely on color for state indication
- Adequate size for touch targets

## Usage Guidelines

### When to Use Chips

**Ideal Scenarios**:

- Multiple option selection with limited space
- Filter interfaces requiring multiple criteria
- Tag-based organization systems
- Quick action triggers
- Navigation with limited options

### When Not to Use Chips

**Better Alternatives**:

- **Dropdown menus**: For extensive option lists
- **Checkboxes**: For traditional form layouts
- **Buttons**: For primary actions
- **Links**: For simple navigation

### Best Practices

**Content Guidelines**:

- Keep chip labels concise (1-2 words ideally)
- Use consistent terminology across similar chips
- Avoid overly technical language
- Ensure labels are self-explanatory

**Layout Guidelines**:

- Group related chips together
- Provide clear section headers when needed
- Allow for wrapping in responsive layouts
- Maintain consistent spacing patterns

**Interaction Guidelines**:

- Provide immediate visual feedback
- Support both mouse and keyboard interaction
- Include clear methods for bulk operations when relevant
- Ensure error states are clearly communicated

## Responsive Behavior

### Mobile Considerations

**Touch Interactions**:

- Adequate touch target size (minimum 44px)
- Appropriate spacing to prevent accidental selection
- Swipe support for horizontal chip collections

**Layout Adaptation**:

- Wrapping behavior for narrow screens
- Scrollable collections when appropriate
- Clear overflow handling

### Desktop Optimizations

**Mouse Interactions**:

- Hover states for better discoverability
- Precise selection feedback
- Right-click context menus when applicable

## Technical Implementation

### Development Considerations

**Component Structure**:

- Flexible container system
- Proper event handling
- State management integration
- Performance optimization for large collections

**Accessibility Implementation**:

- Semantic HTML structure
- ARIA attributes for complex interactions
- Keyboard event handling
- Screen reader optimization

For detailed implementation guidelines and code examples, refer to the technical documentation and accessibility standards.
