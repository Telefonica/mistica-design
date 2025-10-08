# Primitives

_Low-level building blocks for custom components_

## Overview

Primitives are low-level, highly-flexible components meant to be reused for building higher specificity components or atomic constructions. They provide the foundational building blocks that maintain consistency while allowing for customization.

## Available Primitives

### Text Primitive

**Purpose**: Customizable typography component with predefined font-size, line-height, and font-weight properties.

#### Features

- **Responsive typography**: Different properties for desktop and mobile devices
- **Flexible configuration**: Customizable text properties while maintaining system consistency
- **Accessibility**: Built-in support for proper text scaling and readability
- **Performance**: Optimized rendering for text content

#### Use Cases

- Custom text components that don't fit standard presets
- Specialized typography needs in extended components
- Text elements requiring specific responsive behavior
- Complex text layouts requiring fine-tuned control

### Boxed Primitive

**Purpose**: Container component designed for creating versatile layout containers.

#### Features

- **Inverse context support**: Works seamlessly in inverse contexts
- **Inverse container functionality**: Can act as an inverse container itself
- **Flexible padding**: Configurable internal spacing
- **Responsive behavior**: Adapts to different screen sizes

#### Use Cases

- **Custom containers**: Building specialized layout components
- **Inverse contexts**: Creating high-contrast sections
- **Layout foundations**: Base for complex layout patterns
- **Content wrapping**: Consistent container behavior across components

### Circle Primitive

**Purpose**: Circular container component with extensive customization options.

#### Features

- **Flexible backgrounds**: Support for background-color, background-image
- **Icon integration**: Built-in support for icon content
- **Content flexibility**: Can contain text, icons, or other content
- **Size variations**: Configurable dimensions for different use cases

#### Customization Options

- **Background color**: Solid color fills
- **Background image**: Image-based backgrounds
- **Icon content**: Icon-only circular containers
- **Text content**: Text-based circular elements
- **Mixed content**: Combination of different content types

#### Use Cases

- **Avatar components**: Custom avatar implementations
- **Icon containers**: Circular icon backgrounds
- **Status indicators**: Circular status or state displays
- **Logo containers**: Branded circular elements

### Image and Video Primitives

**Purpose**: Media content components with high-level configuration options for size, aspect-ratio, border-radius, and other properties.

#### Image Primitive

##### Supported Formats

- **PNG**: Portable Network Graphics format
- **JPG/JPEG**: Joint Photographic Experts Group format

##### Optimization Requirements

- **Web optimized**: Images should be compressed and optimized for web delivery
- **Retina support**: 2.5x - 3x resolution recommended for high-DPI displays
- **Format selection**: Choose appropriate format based on content type

##### Configuration Options

- **Size control**: Width and height specifications
- **Aspect ratio**: Maintain proportions across different sizes
- **Border radius**: Rounded corners and circular cropping
- **Object fit**: Control how images fill their containers
- **Loading behavior**: Lazy loading and progressive enhancement

#### Video Primitive

##### Supported Formats

- **MP4**: MPEG-4 video format (recommended)
- **Audio restrictions**: Videos without sound only
- **Duration guidelines**: Recommended maximum 10 seconds
- **Loop capability**: Videos can work in continuous loop

##### Configuration Options

- **Autoplay settings**: Controlled autoplay behavior
- **Loop configuration**: Seamless looping options
- **Controls**: Show/hide video controls
- **Poster images**: Fallback images before video loads
- **Loading states**: Progressive loading and fallback handling

#### Aspect Ratios

##### Standard Ratios (Recommended)

- **16:9**: Widescreen video format, modern displays
- **4:3**: Traditional video/photo format
- **1:1**: Square format, social media, avatars

##### Custom Ratios

- **Flexibility**: Custom aspect ratios allowed when needed
- **Consistency**: Maintain consistent ratios within product contexts
- **Responsive**: Ensure ratios work across different screen sizes

## Implementation Guidelines

### Design Token Integration

Primitives are designed to work seamlessly with Mística design tokens:

- **Color tokens**: Use system colors for consistency
- **Spacing tokens**: Apply consistent spacing patterns
- **Typography tokens**: Leverage text system for readable content
- **Border tokens**: Use consistent border-radius values

### Performance Considerations

#### Image Optimization

- **Format selection**: Use WebP when supported, with fallbacks
- **Compression**: Balance quality and file size
- **Lazy loading**: Load images only when needed
- **Progressive enhancement**: Graceful degradation for slower connections

#### Video Optimization

- **Compression**: Optimize for web delivery
- **Preload strategies**: Load videos appropriately based on user interaction
- **Fallback handling**: Provide alternatives when video fails
- **Bandwidth awareness**: Consider data usage implications

### Accessibility

#### Image Accessibility

- **Alternative text**: Provide meaningful alt text for screen readers
- **Decorative images**: Use appropriate ARIA attributes for decorative content
- **High contrast**: Ensure images work in high contrast modes
- **Zoom support**: Images should scale appropriately with browser zoom

#### Video Accessibility

- **Captions**: Provide captions for any audio content (even minimal)
- **Controls**: Ensure video controls are keyboard accessible
- **Motion sensitivity**: Consider reduced motion preferences
- **Focus management**: Proper focus handling for video interactions

## Usage Examples

### Text Primitive Example

```html
<TextPrimitive
  size="large"
  weight="medium"
  mobileSize="medium"
  mobileWeight="regular"
>
  Custom text content
</TextPrimitive>
```

### Boxed Primitive Example

```html
<BoxedPrimitive padding="medium" inverse="{true}" backgroundColor="brand">
  Container content
</BoxedPrimitive>
```

### Circle Primitive Example

```html
<CirclePrimitive size="large" backgroundColor="primary" icon="user" />
```

### Image Primitive Example

```html
<ImagePrimitive
  src="image.jpg"
  alt="Description"
  aspectRatio="16:9"
  borderRadius="medium"
  loading="lazy"
/>
```

### Video Primitive Example

```html
<VideoPrimitive
  src="video.mp4"
  aspectRatio="16:9"
  autoplay="{true}"
  loop="{true}"
  muted="{true}"
  poster="poster.jpg"
/>
```

## Best Practices

### Do's

- **Use design tokens**: Leverage system tokens for consistency
- **Test responsiveness**: Ensure primitives work across screen sizes
- **Optimize media**: Compress and optimize images and videos
- **Provide fallbacks**: Include appropriate fallback content
- **Consider accessibility**: Implement proper accessibility features

### Don'ts

- **Don't ignore performance**: Avoid large, unoptimized media files
- **Don't skip alt text**: Always provide alternative text for images
- **Don't hardcode values**: Use design tokens instead of arbitrary values
- **Don't forget mobile**: Test primitive behavior on mobile devices
- **Don't ignore loading states**: Provide appropriate loading feedback

## Integration with Extended Components

Primitives are designed to be the foundation for extended components:

- **Consistency**: Maintain visual consistency with core Mística components
- **Flexibility**: Allow customization while preserving system integrity
- **Reusability**: Build once, use in multiple extended components
- **Maintainability**: Easier updates when built on solid primitive foundations

---

_Part of the Mística Design System component library_
