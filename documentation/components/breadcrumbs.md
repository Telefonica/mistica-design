# Breadcrumbs Component

_Navigation hierarchy display_

## Overview

Breadcrumbs are a navigational element to help users understand where they are in a website and understand content structure and hierarchy. They provide a secondary navigation method and improve user orientation within complex site structures.

## Purpose

Breadcrumbs serve as a **secondary navigation aid** that:

- **Shows current location**: Helps users understand their position in the site hierarchy
- **Provides navigation path**: Displays the route taken to reach the current page
- **Enables quick navigation**: Allows users to jump back to higher-level pages
- **Improves user experience**: Reduces confusion and provides context

## When to Use

Use the Breadcrumbs component when you need to:

- **Help users navigate**: Between multiple pages in a website with hierarchical structure
- **Show page hierarchy**: In websites with multiple levels of content organization
- **Provide context**: When users might arrive at deep pages through search or direct links
- **Supplement primary navigation**: As a secondary wayfinding tool

### Implementation Requirements

- **Appear on all pages**: Must be present on all pages other than the front page
- **Clickable links**: All elements in the breadcrumb path should be clickable links
- **Current page indicator**: The current page should appear as plain text (not a link)
- **Secondary navigation**: Use only as a secondary means of navigation, not primary

## When Not to Use

- **Linear processes**: Don't use Breadcrumbs to show steps in a process (use progress indicators instead)
- **Flat site structure**: Not necessary for simple, single-level websites
- **Mobile apps**: Generally not recommended for mobile app navigation
- **Single-page applications**: May not be appropriate for SPA navigation patterns

## Layout and Placement

### Positioning

**Recommended placement**: The most common and effective place for breadcrumbs is:

- **Before main content**: Positioned just before the primary page content
- **Below header**: Preferably just below the main site header/navigation
- **Above page title**: Often placed above the main page heading

### Visual Hierarchy

- **Subtle appearance**: Should not compete with primary navigation
- **Clear but secondary**: Visible enough to be useful, but not dominant
- **Consistent placement**: Same position across all pages

## Anatomy

Breadcrumbs consist of several key elements:

### 1. Root Item

- **Purpose**: Usually represents the homepage or main section
- **Content**: Often "Home" or the site/section name
- **Behavior**: Always clickable and leads to the top level

### 2. Separator

- **Visual element**: Items are separated using a forward slash (/) or similar indicator
- **Alternatives**: Arrows (>) or other directional indicators
- **Consistency**: Use the same separator throughout the site

### 3. Hierarchical Levels

- **Intermediate pages**: Show the navigation hierarchical order in the path
- **Logical structure**: Should reflect the actual site architecture
- **All clickable**: Each level should be a functional link

### 4. Current Location

- **Final item**: Current page the user is on
- **Visual treatment**: Last item is not a link, often in different styling
- **Clear indication**: Should be visually distinct from clickable items

## Structure Examples

### Basic Website Structure

```
Home > Products > Mobile Phones > iPhone 15
```

### E-commerce Site

```
Home > Electronics > Smartphones > Apple > iPhone 15 Pro
```

### Corporate Website

```
Home > About Us > Our Team > Leadership > CEO Profile
```

### Documentation Site

```
Home > Documentation > Components > Navigation > Breadcrumbs
```

## Accessibility

### Screen Reader Support

- **Landmark role**: Use `nav` element or `role="navigation"`
- **Aria labels**: Provide `aria-label="Breadcrumb"` for context
- **List structure**: Use proper list markup (`ul`, `li`) for semantic structure
- **Current page**: Use `aria-current="page"` for the current location

### Keyboard Navigation

- **Tab navigation**: All links should be accessible via Tab key
- **Enter activation**: Links should activate with Enter key
- **Skip navigation**: Consider skip links for users with assistive technology

### Visual Accessibility

- **Color contrast**: Ensure sufficient contrast for all text
- **Text alternatives**: Don't rely solely on visual separators
- **Focus indicators**: Provide clear focus states for keyboard users

## Implementation Guidelines

### Technical Requirements

- **Semantic HTML**: Use proper navigation markup
- **Responsive design**: Adapt appropriately to different screen sizes
- **Performance**: Efficient rendering and updating
- **SEO friendly**: Support search engine understanding of site structure

### Responsive Behavior

#### Desktop

- Full breadcrumb path displayed
- All items visible and clickable
- Standard spacing and typography

#### Tablet

- May need to truncate very long paths
- Maintain usability and readability
- Consider shorter labels if necessary

#### Mobile

- **Show last few levels only**: Display current page and 1-2 parent levels
- **Truncation strategy**: Use ellipsis (...) for hidden levels
- **Back button integration**: Consider relationship with browser/app back button

### Content Guidelines

#### Label Writing

- **Clear and concise**: Use descriptive but brief labels
- **Consistent terminology**: Match navigation and page titles
- **User-friendly language**: Avoid technical jargon when possible
- **Scannable**: Easy to read and understand quickly

#### Length Management

- **Reasonable depth**: Avoid overly long breadcrumb trails
- **Smart truncation**: Show most relevant levels
- **Expandable options**: Consider "show more" functionality for deep hierarchies

## Best Practices

### Do's

- Start with the highest level (usually "Home")
- Make all intermediate levels clickable
- Keep current page as non-clickable text
- Use consistent visual styling
- Place in the same location on every page
- Test with real content and deep page structures

### Don'ts

- Don't use for step-by-step processes
- Don't make the current page clickable
- Don't use as primary navigation
- Don't include every single page level if it creates excessive length
- Don't forget about mobile users and responsive behavior

## Integration with Other Components

### Navigation Systems

- **Primary navigation**: Complements main menu without replacing it
- **Footer navigation**: Works alongside footer links and sitemaps
- **In-page navigation**: Coordinates with table of contents and anchor links

### Page Headers

- **Page titles**: Often appears above or near main page headings
- **Hero sections**: Integrates well with page hero areas
- **Content headers**: Provides context for main content areas

---

_Part of the Mística Design System component library_
