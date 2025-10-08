# Mística - Glossary

_Mística Digital Design System - Part 7: Glossary_

## Definition of Key Terms and Concepts

This glossary provides definitions of the key terms and concepts that appear in Mística documentation.

---

### Atom

Element from Mística that in combination with other elements (from Mística or custom) solve needs not covered by the system.

**Examples:** Buttons, icons, labels, input fields

**Usage:** Atoms are the basic building blocks that cannot be broken down further while maintaining their function.

---

### Atomic Constructions

Elements that are built using a combination of atoms or custom elements.

**Examples:** Search boxes (input + button), form fields (label + input + helper text)

**Usage:** Combine atoms to create simple, reusable interface elements.

---

### Design Token

Information associated with a name, at minimum a name/value pair.

In Mística, we use two words to talk about design tokens:

#### Constant

The value that does not change between brands. Constant is equivalent to "token".

**Example:** `color-text-primary` would be the constant.

#### Variable

The value that changes between brands.

**Example:** `#000000` would be the variable. This value can be a hexadecimal color or the name of another variable like `movistarBlue` (that inside stores the hex value).

**Usage:** Design tokens ensure consistency across components while allowing brand customization.

---

### Extended Component

These components are built using Mística atoms and styles to meet very specific needs of a team. Due to their characteristics, they are stored in their own separate library (extended library), not in the core library.

**Purpose:**

- Address specific product or business needs
- Maintain consistency with Mística principles
- Provide solutions not covered by core components

**Examples:** Custom rate tables, specialized form layouts, brand-specific interface elements

---

### Extended Library

This is a separate library created to store the extended components.

**Purpose:**

- Keep core library focused and lightweight
- Allow teams to share specialized components
- Maintain separation between universal and specific solutions

**Organization:** Extended components are organized by team, product, or use case.

---

### Molecule

Simple combinations of atoms that function together as a unit.

**Examples:**

- Search form (input field + search button)
- Navigation item (icon + text + badge)
- Media object (image + text content)

**Characteristics:**

- Relatively simple combinations
- Serve a single purpose
- Reusable across different contexts

---

### Organism

Complex combinations of atoms and molecules that form distinct sections of an interface.

**Examples:**

- Headers with navigation and branding
- Card layouts with multiple content types
- Complex forms with multiple field groups

**Characteristics:**

- More complex and specific
- Often form major sections of pages
- May have unique behaviors or interactions

---

### Primitive

Low-level, highly-flexible components that are meant to be reused for building higher specificity components or atomic constructions.

**Examples:**

- Text primitive (customizable typography)
- Box primitive (flexible containers)
- Circle primitive (circular containers)
- Image/Video primitives (media containers)

**Purpose:**

- Provide foundational building blocks
- Enable custom component creation
- Maintain consistency in low-level implementations

---

### Skin

A brand list of values applied to the theme design tokens.

**Components:**

- Color palettes specific to each brand
- Typography weights and styles
- Border radius values
- Brand-specific visual treatments

**Usage:** Allows multiple brands to share the same component library while maintaining distinct visual identities.

**Examples:** Movistar skin, O2 skin, Vivo skin

---

### Slot

A slot is a flexible space enabled in some components for the inclusion of customized content.

**Purpose:**

- Allow content flexibility within structured components
- Enable customization without breaking component consistency
- Support varied content types within standard layouts

**Examples:**

- Card components with slots for headers, content, and actions
- Accordion components with customizable body content
- Navigation components with flexible menu items

**Implementation:** Slots are defined areas where custom content can be inserted while maintaining the component's overall structure and behavior.

---

### Template

Page-level structures that define the overall layout and organization of content.

**Purpose:**

- Provide consistent page structures
- Define content areas and their relationships
- Ensure responsive behavior across devices

**Examples:**

- Dashboard templates
- Article page templates
- Form page templates

---

### Theme

A collection of design tokens that define how Mística components are displayed.

**Components:**

- Color schemes (light/dark modes)
- Typography definitions
- Spacing and sizing scales
- Component-specific styling rules

**Relationship to Skins:** Themes provide the structure, while skins provide the brand-specific values.

---

### Token

See **Design Token**. In Mística context, "token" and "constant" are equivalent terms.

---

### Variant

Different visual presentations of the same component to provide hierarchy and context.

**Types:**

- **Default**: Standard appearance
- **Inverse**: High contrast version for colored backgrounds
- **Alternative**: Secondary styling for different contexts

**Usage:** Variants help create visual hierarchy and ensure components work well in different contexts while maintaining their core functionality.

---

_This glossary covers the essential terms used throughout the Mística Digital Design System documentation. For additional clarification on any term, refer to the relevant sections in the complete documentation series._
