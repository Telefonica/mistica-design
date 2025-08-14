# A guide to make breaking changes in Figma

## Definition of a breaking change

A **breaking change** is any modification to a component, property, or style in Figma that:

- Changes a property in a way that alters its expected behavior or output.
- Modifies default values in a way that impacts existing designs.
- Forces designers to update their files to maintain consistency or avoid errors.

In short: if the change will **cause existing designs to break, look different, or require manual updates**, it’s considered a breaking change.

## Deprecate components and properties

When deprecating, always indicate **what** is being deprecated, **when** it will be removed, and **what to use instead**.

### Steps

1. **Identify** the component, property or property value to be deprecated and specify the target release for removal.
2. **Update the description** of the component or property with deprecation details.
3. **Track the change** by adding it to a central issue that lists all deprecated components and properties targeted for removal in the next release.

### Semantics

#### Deprecate an entire component

- **Suffix the name** with: "[Deprecated]" to the name of the component

**Example:**

A component name could be: "Highlighted Card [D] [Deprecated]" where "Highlighted Card [D]" is the name of the component

#### Deprecate a property within a component

A property in Figma can be of the following types:

- Boolean property
- Instance swap property
- Text property
- Variant property

> [!NOTE]  
> Only the variant property can have property values that can be deprecated, the rest of the properties need to be marked as deprecated in their property name

Add to the property:

- **Prefix the property name** with: "❗"
- **Suffix the property name** with: "[Deprecated]"

**Example:**

So a property name or value could be: "❗ Video [Deprecated]", where "Video "is the name of the property

### Update the description

In the component description the following schema will be included:

Breaking changes for x.x.x

❗ Property `{property.name}` will be deprecated in `{release.number}`, use `{property.recommended}` property instead

Where:

- `{property.name}`: Is the name of the deprecated property, or property value
- `{release.number}`: is the release where the property will be removed
- `{property.recommended}`: is the property that we recommend the user to use instead (if any)

Or if its the entire component

Breaking changes for x.x.x

❗ Component `{component.name}` will be deprecated in `{release.number}`, use `{component.recommended}` property instead

Where:

- `{component.name}`: Is the name of the component
- `{release.number}`: is the release where the property will be removed
- `{component.recommended}`: is the property that we recommend the user to use instead (if any)

### Tracking the Changes

When a component, property, or property value has been flagged as deprecated, an issue must be created in the GitHub repository to schedule its removal in the upcoming release.

The issue should be named as follows:

Remove deprecated elements in `{release.number}`

Where `{release.number}` is the release in which the element will be removed.

**Example:**

https://github.com/Telefonica/mistica-design/issues/2283
