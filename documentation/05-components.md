# Mística - Components

_Mística Digital Design System - Part 5: Components_

## Overview

Mística provides a comprehensive library of UI components designed to create consistent and accessible user experiences across all Telefónica digital products. Components are built using the design tokens and principles defined in the system.

**📁 Detailed component documentation is now organized in the [components folder](./components/).**

## Component Categories

### Atoms

Basic building blocks that cannot be broken down further:

- **[Buttons](./components/buttons.md)** - Action triggers and interactive elements
- **Icons** - Visual symbols and indicators
- **Labels** - Text descriptions and identifiers
- **Text elements** - Typography components

### Molecules

Simple combinations of atoms that function together:

- **Search boxes** - Input field combined with search functionality
- **Form fields with labels** - Complete form input components
- **[Avatar with badge](./components/avatar.md)** - User representation with notifications

### Organisms

Complex combinations of atoms and molecules:

- **Headers** - Page and section headers with navigation
- **Forms** - Complete form layouts and interactions
- **Card layouts** - Content containers with multiple elements
- **Navigation menus** - Site and app navigation systems

## Core Components

### Interactive Components

- **[Accordion](./components/accordion.md)** - Expandable content sections for organizing information
- **[Avatar](./components/avatar.md)** - Visual representation of users and entities
- **[Badge](./components/badge.md)** - Information and notification indicators
- **[Breadcrumbs](./components/breadcrumbs.md)** - Navigation hierarchy display
- **[Buttons](./components/buttons.md)** - Action triggers and interactions

### Layout Components

- **Cards** - Content containers and layouts
- **Forms** - Input collection and validation
- **Headers** - Page structure and navigation
- **Navigation** - Site and app navigation systems

_For detailed documentation of each component, visit the individual component pages linked above._

### Accordion

Accordions are interactive components that allow users to show and hide content sections, helping to organize information in a compact and scannable format.

#### Key Features

- **Expandable sections**: Click to reveal/hide content
- **Flexible content**: Supports various content types in slots
- **Multiple compositions**: Different layout patterns available
- **Accessibility**: Full keyboard navigation and screen reader support

### Avatar

Avatar is a visual representation of a user or entity profile in the interface. It supports images, text as initials, and icons.

#### Typology

The avatar definition is split into 4 types:

1. **Image**: Thumbnail image of a user for humanizing touch
2. **Initials**: Two-character placeholder based on user name
3. **Icon**: Icons displayed instead of images or initials
4. **Inverse**: For use on colored backgrounds

#### Fallback System

If there is an error loading the Avatar Image, the component uses fallbacks:

1. If there's a name prop, generates initials
2. If there's no name prop, uses a default icon avatar

#### Sizes

By default, Avatar is available in Large size but can be resized as needed.

**Recommended standard sizes:** 24px, 32px, 40px, 56px, 64px

#### Avatar with Badge

Each Avatar type supports a badge (non-numeric or numeric) on the top-right corner, usually used when new information is available, for reminders and notifications.

### Badge

Interactive component that indicates new information associated with any component in the app.

#### What is a Badge?

A badge is an element used to indicate that there is new information associated with any component in the app. It is **not** used to indicate new features in the app.

**Examples:**

- **New feature**: A new area showing available plans
- **New information**: A new plan added to that area

#### Badge Types

##### Non-numeric Badge

**Definition**: Displayed to indicate new non-urgent and impersonal information.

**Used for:**

- Non-urgent and impersonal use cases
- Information available for a group of users, not individual users

**Behavior:**

- Should not send push notifications
- Should not count in app launcher badge
- Disappears when new information is viewed
- Guides user to new information like breadcrumbs

**Anatomy:**

- Has no numbers
- Placed on right or upper right side of element

##### Numeric Badge

**Definition**: Indicates new personal and urgent information - conversations and personal communications.

**Used for:**

- More urgent and personal use cases
- Personal communications for individual users
- Maximum of 2 digits (1-9, +9 for more than 9)

**Behavior:**

- Should send push notifications
- Should count in app launcher badge
- Number decreases as items are viewed
- Guides user to new information destination

### Breadcrumbs

Navigational element to help users understand where they are in a website and content structure hierarchy.

#### When to Use

- Help users navigate between multiple pages
- Must appear on all pages except front page
- All elements should be clickable links except current page
- Use only as secondary navigation

#### When Not to Use

- Don't use to show steps in a process

#### Layout

- Appears before main content, preferably below header
- Starts from highest level (homepage)
- Ends with current screen as final item

#### Anatomy

1. **Root item**: Usually the homepage
2. **Separator**: Forward slash (/) between items
3. **Levels**: Hierarchical navigation order
4. **Location**: Current page (not a link)

### Buttons

Buttons let users perform actions and make choices immediately with simple interaction.

#### Anatomy

All button types have the following elements:

1. **Label**: Text describing the action
2. **Container**: Button background and borders
3. **Icon**: Optional leading or trailing icons
4. **Loading spinner**: Shown during processing
5. **Loading label**: Text shown during loading state

#### Icon Placement

- **Leading icons**: Appear before the label
- **Trailing icons**: Appear after the label

#### Size Variants

##### Standard Size

Default button size for most use cases.

##### Small Variant

Used for:

- **Spatial needs**: In compact components
- **Screen prominence**: Creating page hierarchy and focus

#### Button States

A button can present the following states:

- **Normal**: Default state
- **Pressed/Selected/Active**: User interaction state (varies by platform)
- **Hover**: Desktop interaction state
- **Loading**: Processing state with spinner
- **Focus**: Accessibility state determined by system
- **Disabled**: Non-interactive state

#### Loading State

When processing an action, buttons show:

- Loading spinner
- Optional loading label text
- Disabled interaction during processing

## Extended Components

Extended components are built using Mística atoms and styles to meet very specific needs of a team. Due to their characteristics, they are stored in their own separate library (extended library), not in the core library.

### When to Create Extended Components

- Not on the Mística roadmap or will never be
- Unique product experience that doesn't fit core components
- Specific business or product requirements

### Benefits of Extended Components

Even custom components can benefit from Mística:

- **Design tokens**: Use Mística design tokens for consistency
- **Primitives**: Leverage low-level UI components for building

## Primitives

Low-level, highly-flexible components meant to be reused for building higher specificity components or atomic constructions.

### Text Primitive

Predefined font-size, line-height, and font-weight with the ability to define custom properties for desktop and mobile devices.

### Boxed Primitive

For creating containers that work in inverse contexts or as inverse containers.

### Circle Primitive

For creating circular containers with customizable background-color, background-image, icons, or other content.

### Image and Video Primitives

For including media content with high level configuration of size, aspect-ratio, border-radius, and other properties.

#### Image Support

- **Formats**: PNG and JPG
- **Optimization**: Web optimized
- **Resolution**: 2.5x - 3x recommended for Retina displays

#### Video Support

- **Format**: MP4 videos without sound
- **Duration**: Recommended maximum 10 seconds
- **Looping**: Can work in a loop

#### Aspect Ratios

- **Standard ratios recommended**: 16:9, 4:3, 1:1
- **Custom ratios**: Allowed when needed

---

_This document is part of the Mística Digital Design System documentation series. Continue with Part 6: Themes and Accessibility for information about theming and accessibility features._
