# Figma Release Process

This document describes the steps required to perform a Figma release for Mistica libraries. It includes how to handle milestones, changelog generation, library publishing order, and internal communication templates.

## Release Steps Overview

1. Add milestone tags
2. Close the milestone
3. Generate and update the changelog
4. Publish Figma libraries (in order)
   - Skins
   - Icons
   - Mistica Mobile
   - Mistica Desktop
5. Post communication in the general thread

## 1. Add Milestone Tags

Before closing a milestone, ensure that:

Each issue or pull request included in the release has the correct milestone assigned.

The milestone name follows the semantic versioning pattern (x.x.x), e.g., 3.2.1.

> [!WARNING] 
> If a milestone name doesn’t follow this pattern (e.g., “Experimental update” or “Q3 Release”), the changelog generation action will fail.

## 2. Close the Milestone

Once all related issues are tagged:

1. Go to the milestone page in GitHub.
2. Double-check that the name follows the x.x.x pattern.
3. Close the milestone.

Closing the milestone automatically triggers the changelog generation workflow.

## 3. Update the Changelog Entry

After the milestone is closed, a changelog entry will be created automatically.

If you need to make more changes after the milestone was closed you can do it manually:

1. Obtain the milestone ID from the milestone’s URL (for https://github.com/Telefonica/mistica-design/milestone/91, 91 is the ID of the milestone).
2. Manually update the changelog entry:
   - Include the milestone ID
   - Add the release number (x.x.x)
   - Review and adjust descriptions if needed

<img width="1433" height="323" alt="Screenshot 2025-10-07 at 09 28 57" src="https://github.com/user-attachments/assets/aa67d0a3-36f2-42b7-b612-030d840fb22e" />

> [!WARNING] 
> If a milestone without a semantic version name was closed:
> The changelog action will fail. You’ll need to manually remove its folder from the changelog-versions
> directory before retrying.

## 4. Publish Figma Libraries

## 4.1 Figma branch pruning

Before make a release double check all branches in Figma that are included in the release are merged

## 4.2 Libraries publishing

Publish libraries in the following order to avoid dependency issues:

1. Skins
2. Icons
3. Mistica Mobile
4. Mistica Desktop

Ensure that all libraries use the same release version (x.x.x) and that Figma components link correctly after publishing.

In each library you should create a branch updates from x.x.x that includes the updated changes from the previous updated library (fo example in Mobile a branch updates from 19.0.0 will be created to update skins)

### 4.3 Publish data

When publishing, include information about the release in the publish text area so users can easily check the changelog for the version they are updating to.

Template:

```
Release x.x.x

https://github.com/Telefonica/mistica-design/blob/production/changelog-versions/x.x.x.md
```

## 5. Create Communication in the General Thread

Once all libraries are published, prepare a release announcement in the general thread.

The content depends on whether it’s a minor or major release.

### Minor Release

Template:

```
Release {Release number}

Some changes included in the release:

- {List of relevant changes}

If you want to know more details about the changes, we leave you as always the link to the changelog:
{Changelog link}
```

### Major release

Template:

```
Release {Release number} ({Quarter number})

We have included the following features in this release:

- {List of components or new features}

As usual, you can check out the list of all changes in our changelog or subscribe to our newsletter.

{Changelog link}
{Newsletter link}

```
