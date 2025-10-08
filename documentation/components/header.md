# Header

A header serves to highlight relevant content or as a guide for the user, either giving greater emphasis to content within the context of a page or as additional information to the content that will then be presented to the user.

## Types

We have two different types of headers:

- **Header**
- **Main Section Header**

## Usage

### When to use

- Use a header to highlight relevant content to the user
- For more conversational content we recommend using the Main Section Header component instead

### When not to use

- Avoid the combination of large navigation bars and header in native app environments

## Header Component

### Anatomy

The Header component contains the following elements:

1. **Tag** (Optional) - Used to display content states
2. **Pre-title** (Optional) - The pre title provides the necessary context to understand the title
3. **Title** (Optional) - The title provides the main message that we want to communicate to users
4. **Description** (Optional) - Additional descriptive text
5. **Slot** (Optional) - Custom content area
6. **Breadcrumbs** (Optional) - Only available on desktop

### Content Strategy

#### Language Type

When designing a header, we must ask ourselves two questions: what do we want to communicate and how do we want to do it?

The modularity of elements allows us to use these headers to help users quickly understand information and display the main actions of a screen.

The type of language we use will range from a more functional language to a more conversational one, which establishes a dialogue with the user.

#### Structure Types

**Functional**: We can build functional headers in which the elements are arranged in a structured way, allowing the user to identify them quickly and independently.

**Conversational**: We can design more organic content using conversational language, where the user is provided with all of the information of the message in the same sentence.

### Slots

Slots inside the component allow the customization of the component content. Their main function is to offer flexibility and scalability for a component to be adapted to the specific requirements of each product.

#### Slot Positions

The header component supports three different slot positions:

- **Default** - Standard positioning within the header
- **Bleed** - Content extends to the edges
- **Side by Side** - Only available on desktop, allows horizontal content arrangement

## Main Section Header

### Main Section Usage

On desktop we lack the Navigation Bar component, and therefore we use the Large version in the main tabs of our product's app. The main tab header transfers the composition and visual weight of the app's Large Navigation Bars to the main sections of desktop site.

### Main Section Anatomy

The Main Section Header contains:

1. **Title** - The title provides the main message that we want to communicate to users
2. **Description** (Optional) - The description amplifies the information
3. **Action** (Optional) - This is an interaction element. It allows users to take immediate action and decisions based on contextualized information

## Accessibility

- Ensure proper heading hierarchy is maintained
- Use semantic HTML elements for screen reader compatibility
- Provide clear and descriptive titles
- Include appropriate ARIA labels when necessary

## Implementation

Header components should be implemented with proper semantic structure and responsive behavior across different screen sizes and devices.

## Related Components

- [Breadcrumbs](./breadcrumbs.md)
- [Navigation Bars](./navigation-bars.md) (when available)
- [Cards](./cards.md)
- [Buttons](./buttons.md)
