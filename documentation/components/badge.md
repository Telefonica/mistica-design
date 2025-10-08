# Badge Component

_Information and notification indicators_

## Overview

Badge is an interactive component that indicates new information associated with any component in the app. It provides visual cues to users about updates, notifications, and new content.

## What is a Badge?

A badge is an element used to indicate that there is new information associated with any component in the app.

**Important**: A badge is **not** used to indicate new features in the app - other elements should be used for that purpose.

### Examples of Badge Usage

**New Information (use badge):**

- A new plan added to an existing area
- A new mobile launch included in a product area
- New messages in a conversation
- Updated content in a section

**New Features (don't use badge):**

- A completely new area showing available plans
- A new section for mobile phone launches
- New application functionality

## Badge Types

The badge definition is split into 2 types:

### Non-numeric Badge

#### Definition

Displayed to indicate new **non-urgent and impersonal** information.

#### Use Cases

- **Non-urgent information**: Updates that don't require immediate attention
- **Impersonal content**: Information available for a group of users, not individual users
- **General updates**: New content, features, or information sections
- **System notifications**: App updates, maintenance notices

#### Behavior

**Notifications:**

- Should **not** send push notifications
- Should **not** count in app launcher badge

**Display Logic:**

- Appears when new information is available
- Disappears completely when new information is viewed
- Guides user to new information like breadcrumbs
- Shows on elements containing new information and related navigation

**Connection to Information:**

- Should guide users to the new information
- If information is at inner navigation levels, badge guides user through the path
- Acts like a breadcrumb trail to the final destination

#### Anatomy

- **No numbers**: Simple indicator without count
- **Placement**: Recommended on right or upper right side of element
- **Visual style**: Simple dot or indicator shape

### Numeric Badge

#### Definition

Indicates new **personal and urgent** information - specifically conversations and personal communications.

#### Use Cases

- **Personal communications**: Messages, calls, personal notifications
- **Urgent information**: Time-sensitive updates requiring attention
- **Individual user data**: Content specific to the logged-in user
- **Conversation notifications**: Chat messages, email, direct communications

#### Behavior

**Notifications:**

- **Should** send push notifications
- **Should** count in app launcher badge

**Display Logic:**

- Shows count of new personal communications
- Number decreases as items are viewed (e.g., 9 → 4 after viewing 5 items)
- Maximum display of 2 digits (1-9, shows "+9" for counts above 9)
- Completely disappears when count reaches 0

**Connection to Information:**

- Guides user to new personal information
- Maintains count accuracy across navigation levels
- Updates in real-time as items are read/viewed

#### Anatomy

- **Numeric display**: Shows count from 1-9, "+9" for higher numbers
- **Placement**: Recommended on right or upper right side of element
- **Real-time updates**: Count changes as content is consumed

## Implementation Guidelines

### Visual Design

- **Size**: Appropriately sized for visibility without overwhelming
- **Color**: High contrast colors for accessibility
- **Position**: Consistent placement across similar elements
- **Animation**: Subtle entrance/exit animations when appropriate

### Accessibility

- **Screen readers**: Provide meaningful announcements for state changes
- **Color contrast**: Ensure badges meet WCAG AA standards
- **Alternative indicators**: Don't rely solely on color to convey information
- **Focus management**: Ensure badges don't interfere with keyboard navigation

### Performance

- **Real-time updates**: Efficient updating mechanisms for numeric badges
- **State management**: Proper synchronization between badge state and actual content
- **Caching**: Appropriate caching strategies for badge states

## Usage Examples

### Non-numeric Badge Examples

```html
<!-- Navigation tab with new content -->
<tab> Promotions [•] </tab>

<!-- Menu item with updates -->
<menu-item> Settings [•] </menu-item>
```

### Numeric Badge Examples

```html
<!-- Messages with count -->
<tab> Messages [3] </tab>

<!-- Avatar with notifications -->
<avatar> User Photo [5] </avatar>
```

## Integration with Other Components

### Avatar with Badge

Each [Avatar](./avatar.md) type supports both non-numeric and numeric badges on the top-right corner for:

- New message notifications
- Status updates
- Personal alerts

### Navigation Elements

Badges commonly appear on:

- Tab navigation items
- Menu items
- Button elements
- List items

## Best Practices

### Do's

- Use numeric badges for personal, urgent communications
- Use non-numeric badges for general, non-urgent updates
- Clear badges when content is viewed
- Guide users efficiently to new content
- Maintain consistent placement and styling

### Don'ts

- Don't use badges for new features (use other indicators)
- Don't overwhelm users with too many badges
- Don't ignore accessibility requirements
- Don't use numeric badges for non-personal content
- Don't forget to clear badges when content is consumed

## States and Transitions

### Badge States

- **Hidden**: No new information available
- **Visible**: New information available, showing appropriate indicator
- **Updating**: Real-time changes to numeric count
- **Clearing**: Transition when badge is dismissed

### Transition Animations

- **Appear**: Subtle entrance animation when badge appears
- **Update**: Smooth number changes for numeric badges
- **Disappear**: Clean exit animation when badge is cleared

## Technical Considerations

### Data Synchronization

- Real-time updates for accurate badge states
- Proper handling of offline/online state changes
- Synchronization across multiple app instances

### Performance Optimization

- Efficient badge state management
- Minimal impact on app performance
- Proper cleanup of badge listeners and timers

---

_Part of the Mística Design System component library_
