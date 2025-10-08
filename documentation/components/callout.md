# Callout

_Callouts are a snippet of information that draws attention to important content._

## Overview

Callouts are prominent information containers designed to highlight important messages, warnings, tips, or critical information to users. They serve as visual interruptions that ensure important content doesn't get overlooked in the regular flow of information.

## Anatomy

A callout consists of several elements that work together to convey important information effectively:

### Core Elements

**Description** (Required):

- The main message content
- Must always be present
- Should be clear and concise
- Primary information delivery method

### Optional Elements

**Icon** (Optional):

- Visual indicator of message type
- Enhances quick recognition
- Supports message categorization
- 16x16 or 20x20 asset recommended

**Title** (Optional):

- Brief header for the message
- Provides context or category
- Should complement the description
- Helps with content scanning

**Actions** (Optional):

- Interactive elements like buttons or links
- Allow users to respond to the message
- Should be relevant to the callout content

**Dismiss** (Optional):

- Allows users to close the callout
- Useful for non-critical information
- Should be used thoughtfully

## Types of Callouts

Callouts serve different purposes and use distinct visual treatments to communicate their intent:

### Critical Alert

**Purpose**: Highlight critical information that users must be aware of

**Characteristics**:

- High visual prominence
- Strong color treatment
- Critical content only
- Not used for error feedback

**Use Cases**:

- System maintenance notifications
- Security alerts
- Service disruptions
- Data loss warnings

**Important Note**: Callouts should never be used as error feedback elements. They are specifically for highlighting critical information that users should be aware of.

### Warning Alert

**Purpose**: Draw attention to warning information

**Characteristics**:

- Prominent but less severe than critical
- Warning color treatment
- Important cautionary content
- Not used for warning feedback

**Use Cases**:

- Feature deprecation notices
- Policy changes
- Service limitations
- Compatibility warnings

**Important Note**: Never use callouts as warning feedback elements. They are for highlighting warning information that users should be aware of, not for form validation or interaction feedback.

### Informative or Tip

**Purpose**: Provide helpful information or tips to users

**Characteristics**:

- Friendly, approachable visual treatment
- Lower urgency than alerts
- Educational content
- Positive user experience enhancement

**Use Cases**:

- Feature tips and tricks
- Best practice recommendations
- Educational content
- Helpful suggestions
- Process improvements

## Usage Guidelines

### When to Use Callouts

**Ideal Scenarios**:

- Highlighting system-wide announcements
- Providing contextual tips and guidance
- Communicating important policy changes
- Sharing feature updates or improvements
- Educational content delivery

### When Not to Use Callouts

**Avoid for**:

- Form validation errors (use field-level feedback)
- Success messages (use snackbars or inline feedback)
- Regular content that doesn't need emphasis
- Frequent notifications (consider less intrusive alternatives)

### Content Guidelines

**Message Writing**:

- Keep content concise and scannable
- Use clear, jargon-free language
- Focus on user impact and required actions
- Prioritize the most important information

**Length Recommendations**:

- Title: 1-5 words maximum
- Description: 1-2 sentences ideal
- Avoid overwhelming users with lengthy text

## Visual Design

### Color Usage

**Critical Alerts**:

- High contrast colors
- Error or danger color palette
- Strong visual prominence

**Warning Alerts**:

- Warning color palette
- Moderate visual prominence
- Clear but not overwhelming

**Informative/Tips**:

- Neutral or positive color palette
- Gentle visual treatment
- Approachable appearance

### Icon Selection

**Critical/Warning Icons**:

- Alert symbols
- Warning triangles
- Exclamation marks
- Error indicators

**Informative Icons**:

- Information symbols
- Light bulb (for tips)
- Question mark (for help)
- Positive indicators

## Accessibility

### Screen Reader Support

**Implementation Requirements**:

- Proper ARIA labels and roles
- Clear message hierarchy
- Icon alternative text
- Context communication

### Visual Accessibility

**Requirements**:

- Sufficient color contrast
- Don't rely solely on color for meaning
- Clear typography hierarchy
- Adequate spacing and sizing

### Keyboard Navigation

**Support Needs**:

- Focusable interactive elements
- Logical tab order
- Dismiss functionality via keyboard
- Action accessibility

## Responsive Behavior

### Mobile Considerations

**Layout Adaptations**:

- Responsive text sizing
- Touch-friendly interactive elements
- Appropriate spacing for mobile viewports
- Content prioritization

### Desktop Optimizations

**Enhanced Features**:

- Hover states for interactive elements
- More detailed content when space allows
- Enhanced typography treatment

## Placement Guidelines

### Page-Level Callouts

**Positioning**:

- Top of content area
- After navigation elements
- Before main content begins
- Consistent placement across pages

### Section-Level Callouts

**Integration**:

- Within relevant content sections
- Adjacent to related information
- Contextually appropriate placement

### Inline Callouts

**Usage**:

- Within content flow
- Breaking up long content sections
- Highlighting specific information

## Best Practices

### Content Strategy

**Prioritization**:

- Limit number of callouts per page
- Prioritize by user impact
- Avoid callout fatigue
- Regular content review and updates

### User Experience

**Interaction Design**:

- Provide clear next steps when needed
- Allow dismissal of non-critical callouts
- Respect user preferences
- Monitor effectiveness and adjust

### Maintenance

**Content Management**:

- Regular review of active callouts
- Remove outdated information
- Update content as needed
- Track user engagement and response

## Technical Implementation

### Development Considerations

**Component Structure**:

- Flexible content areas
- Responsive design support
- Accessibility compliance
- Performance optimization

**State Management**:

- Dismissal state persistence
- User preference handling
- Content update mechanisms

For detailed implementation guidelines and code examples, refer to the technical documentation and accessibility standards.
