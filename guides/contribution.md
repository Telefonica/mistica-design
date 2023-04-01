# Contribution guide

Welcome to the Mística Design System contribution guide for external teams.

As an external team, you have the opportunity to contribute to the Mística Design System by sharing your ideas and expertise.
Whether you are a designer, developer, or product manager, your contributions can help us improve the system and make it more useful for a wider range of users.

This guide is designed to help you understand how you can contribute to Mística, what kind of contributions we are looking for, and how to make sure your contributions are consistent with our way of working.
We encourage you to read this guide carefully and get in touch with us if you have any questions or feedback.

Together, we can build a better design system that empowers teams to create great products and experiences for everyone.

## Index

- [Proposals](#proposals)
- [Issues](#issues)
- [Specs](#specs)
- Development

## Proposals

Before submitting a proposal, we encourage you to review our existing components and guidelines to ensure that your proposal aligns with our design principles and meets our accessibility standards. You can find all of our design guidelines and documentation on our website.

To submit a proposal, create a [new discussion in the Mística Design GitHub repository](https://github.com/Telefonica/mistica-design/discussions).
Your proposal should meet the following criteria:

| Approval Criteria | Description                                                                                                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Global            | The proposal should be applicable to a broad range of use cases and scenarios, rather than being specific to a particular product or project. This ensures that the component is useful to a wider range of users and teams. |
| Purpose           | The purpose of the proposed change needs to be well-explained. This includes the problem the component is designed to solve, the benefits it provides, and any potential drawbacks or limitations.                           |
| Figma link        | You should provide a Figma link with examples of how the component could be used in different contexts. This helps us visualize the proposed change and understand its potential impact on the overall design system.        |

Other information could help to validate the proposal earlier:

- Research data.
- Examples of current usage
- Examples of where the proposal could solve a problem more efficiently.
- A validated PRD, or confirmation that APIa can serve this information

The discussion is an opportunity to gather feedback from the Mística Design System team and the community.
We will review your proposal and provide feedback to help you refine and improve it. We may also ask for additional information or clarification.

## Issues

When the issue is created a new branch will be created by the core team in figma to allow teams to document the new additions in that file

## Specs

### Modifying existing components

The specs are on a branch:

- When they are considered finished, they are asked to merge them, putting design core as reviewer of that branch
- Design core reviews and if approved it is merged
- As soon as something is merged it is considered ready for PR

### New components

- A new file is created with the prefix `Draft`
- When they are ready, a review is requested
- If approved, their prefix is ​​changed to `Ready` and they are ready for PR
- Once they are ready, the JIRA tickets for iOS, Android and web are created and referenced in the issue that started the task

### From design to development

The PR's open in the web, iOS, or Android repositories should always link to the official specs file, this document should be approved and tagged as ready for development.

Thank you for your interest in contributing to the Mística Design System.
We appreciate your efforts to help us improve our system and create better user experiences for everyone.
