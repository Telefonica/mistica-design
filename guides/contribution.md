# Contribution guide

Welcome to the Mística Design System contribution guide for external teams.

As an external team, you have the opportunity to contribute to the Mística Design System by sharing your ideas and expertise.
Whether you are a designer, developer, or product manager, your contributions can help us improve the system and make it more useful for a wider range of users.

This guide is designed to help you understand how you can contribute to Mística, what kind of contributions we are looking for, and how to make sure your contributions are consistent with our way of working.

We encourage you to read this guide carefully and get in touch with us if you have any questions or feedback.

> [!NOTE]
> Adding a new icon follows its own end-to-end process across several repositories and Figma libraries. If your contribution is an icon, follow the [Icons contribution guide](icons-contribution.md).

## Index

- [Workflow overview](#workflow-overview)
- [Proposal](#proposals)
- [Creation of an issue based on the proposal](#issues)
- [Updating or creating the specs needed](#specifications)
- [Changes in the design repository](#changes-in-the-design-repository)
- [Development and final review](#from-design-to-development)
- [Updating libraries](#updating-libraries)

## Contribution journey

![Contribution journey](../.github/resources/guides/contribution/contribution_journey.svg)

## Workflow overview

Every change in Mística follows the same ordered sequence. Except where noted, each step must be completed before the next one starts.

1. **Proposal.** Submit your idea as a [discussion](https://github.com/Telefonica/mistica-design/discussions) and wait for it to be approved.
2. **Issue.** An issue is created from the approved proposal and an assignee is defined.
3. **Specs first.** Update or create the Figma specs and get them merged. Specs are the single source of truth, so nothing downstream starts until they are merged.
4. **Design repository PR _(only if needed)_.** If the change also requires a change in this repository — for example a skin or a token change — open that pull request only after the specs are merged, and get it merged before the development that depends on it. This step is skipped when no skin or token change is involved.
5. **Development.** Implement the merged specs in the code libraries.
6. **Update libraries.** Once development is done, reflect the change in the Mística Mobile and Desktop Figma libraries and get those updates reviewed and merged.

The following sections describe each step in detail.

## Proposals

Before submitting a proposal, we encourage you to review:

- Our existing components and guidelines to ensure that your proposal aligns with our design principles and
- There's no other discussion already covering the same topic. You can find all of our design guidelines and documentation on [Telefónica's brand factory](https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/get-started/what-is-mistica).
- It's not covered by the existing [Component specs](https://www.figma.com/files/1125734703130062955/project/27955986/Component-Specs?fuid=1111936175780412673)
- The technical viability to include the proposal in your product (A validated PRD, or confirmation that backend can serve this information)

To submit a proposal, create a [new discussion in the Mística Design GitHub repository](https://github.com/Telefonica/mistica-design/discussions).

Your proposal should meet the following criteria:

| Approval Criteria | Description                                                                                                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Global            | The proposal should be applicable to a broad range of use cases and scenarios, rather than being specific to a particular product or project. This ensures that the component is useful to a wider range of users and teams. |
| Purpose           | The purpose of the proposed change needs to be well-explained. What the component is designed to solve, the benefits it provides, and any potential drawbacks or limitations.                                                |
| Figma link        | You should provide a Figma link with examples of how the component could be used in different contexts. This helps us visualize the proposed change and understand its potential impact on the overall design system.        |

Other information could help to validate the proposal earlier:

- Research data.
- Examples of current usage.
- Examples of where the proposal could solve a problem more efficiently.

The discussion is an opportunity to gather feedback from the Mística Design System team and the community.
We will review your proposal and provide feedback to help you refine and improve it. We may also ask for additional information or clarification.

## Issues

When a proposal is approved an issue will be create from the discussion. The issues can either be assigned to the design core team or any external team, depending on different factors, like workload, complexity, impact. The definition of the assignee will be discussed between the design core team and the teams involved in the proposal.

### Issues assigned to Design core

If design core has been defined as the asignee for updating the specs based on the proposal you can track the progress from:

- [Our milestones](https://github.com/Telefonica/mistica-design/milestones)
- [Our releases project view](https://github.com/orgs/Telefonica/projects/20/views/2)

### Issues assigned to an external team

If your team has been defined as the asignee for updating the specs based in your proposal:

1. A new branch will be created to allow your team to work on and the link will be shared in the issue.
2. The team can proceed to update the specifications.

---

For any other teams expecting a feature you can check the design and development status from [our project view](https://github.com/orgs/Telefonica/projects/20/views/5).

## Specifications

Specs files are the single source of true for development teams to update Mística libraries. There are two possible scenarios when working with specs.

### Modifying existing components

1. A new branch in an existing Figma file will be created.
2. Add the component `Dev Status` from the Mistica resources library around the new update areas of the documentation. This will make easier for reviewers and developers to find the new changes they need focus on and to everyone reading the specs to understand what's already available in the component implementation.
3. When they are considered finished, request the approval adding at least 2 members of the design core team as reviewers of that branch<sup>(1)</sup>.
4. Design core will review the file and provide feedback when needed.
5. When considered ready, a reviewer will merge the branch.
6. As soon as something is merged it is considered ready for development.

### New components

1. A new Figma file is created with the prefix `Draft`
2. A new branch will be created in that file
3. When they are considered finished, request the approval adding at least 2 members of the design core team as reviewers of that branch<sup>(1)</sup>.
4. Design core will review the file and provide feedback when needed.
5. When considered ready, a reviewer will merge the branch.
6. As soon as something is merged it is considered ready for development.

---

(1) To learn more about requesting branch reviews, read the [Figma documentation](https://www.figma.com/best-practices/branching-in-figma/best-practices-when-using-branches/#requesting-a-review-on-a-branch).

## Changes in the design repository

Some changes need a pull request in the `mistica-design` repository in addition to the specs. The most common cases are skin and token changes: adding, renaming or removing a token, or adding or modifying a skin.

This pull request has a strict place in the sequence:

1. It is opened **only after** the related specs are merged.
2. It must be **merged before** the development that depends on it starts, so the code libraries can rely on the updated tokens and skins.

When no skin or token change is involved, this step is skipped and you move straight to development.

For the rules that apply to these changes, see:

- [Token releases](token-releases.md) — how token and skin changes map to semantic versioning.
- [Tokens workflow](tokens-workflow.md) — the workflow for updating tokens.

## From design to development

Depending of the team that will develop the specifications update there are two different paths.

### Mística team

If our team will be the responsible of the development, the design core team will create the ticket and the ticket link will be linked into the issue body.

### External teams

If an external team is the responsible os the task, some rules should be followed to ensure the best workflow possible:

1. Read the CONTRIBUTING files in the repository the PR will be created.
   - [Web](https://github.com/Telefonica/mistica-web/blob/master/CONTRIBUTING.md)
2. Include reviewers from the Mística development team and design core team.
3. Include the link of the approved specs in the PR description.

> [!NOTE]
> When you add a new component or change its properties, the [Code Connect](https://github.com/Telefonica/mistica-web) definition must be added or updated so the Figma component stays mapped to its code counterpart. You can check the existing Code Connect definitions in [mistica-web](https://github.com/Telefonica/mistica-web).

## Updating libraries

Once development is done, the change has to be reflected in the Mística Figma libraries so designers consume the same result that has been shipped. This affects the **Mistica Mobile** and **Mistica Desktop** libraries.

> [!NOTE]
> If the change involved a token update, you will first need the **Mistica Skins** library published, since tokens are published through that library. The component libraries may depend on those tokens to be updated, so the Skins library has to be published before Icons, Mobile and Desktop. See the publishing order in the [Figma release process](figma-releases.md).

For each affected library:

1. Apply the changes in the library on a new branch.
2. Request a review from the design core team.
3. Merge the branch once it is approved.

A library whose components are not affected by the change does not need to be updated. The release and publishing of these libraries is a separate process, described in the [Figma release process](figma-releases.md).

Thank you for your interest in contributing to the Mística Design System.
We appreciate your efforts to help us improve our system and create better user experiences for everyone.
