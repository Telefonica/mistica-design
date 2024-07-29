Every time a token or group of tokens are added, modified or removed a new release in the mistica-design repo will be created following semantic versioning scheme.

- Major:
  - An existing token has been renamed or removed
  - a token `type` has been changed
  - A skin has been removed or renamed to a non previous existing skin name
- Minor:
  - A new token has been created
  - A new skin has been added
- Fix: the `value` or `description` of an existing token has changed (without a `type` change)

### Release description

Each release will include a list of the tokens that have been changed

### Example

The current version is `1.2.0`

- A token named `tableBackground` is needed and has been added --> The version changes from `1.2.0` to `1.3.0`
- The token of `beyondBlue` in o2new has an incorrect value and has been updated --> The version changes from `1.2.0` to `1.2.1`
- A new skin named blau-new has been added --> The version changes from `1.2.0` to `1.3.0`
- The token `neutralMedium` is no longer needed and has been removed --> The version changes from `1.2.0` to `2.0.0`
- The token brand has changed his `type` from `color` to `linear-gradient` and updated its value --> The version changes from `1.2.0` to `2.0.0`
