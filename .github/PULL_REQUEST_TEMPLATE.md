name: Pull Request
description: Submit a pull request to contribute changes
title: ""
labels: []
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Thank you for contributing to the Ilse DeLange Records Archive! 
        Please provide information about your changes to help with the review process.

  - type: checkboxes
    id: checklist
    attributes:
      label: Pre-submission Checklist
      description: Please confirm you have completed the following
      options:
        - label: I have read the [Contributing Guidelines](https://github.com/ilsedelangerecords/ilsedelangerecords_web/blob/main/CONTRIBUTING.md)
          required: true
        - label: I have tested my changes locally
          required: true
        - label: I have followed the project's coding standards
          required: true
        - label: I have updated documentation if necessary
          required: false

  - type: dropdown
    id: change-type
    attributes:
      label: Type of Change
      description: What type of change does this PR introduce?
      multiple: true
      options:
        - Bug fix (non-breaking change that fixes an issue)
        - New feature (non-breaking change that adds functionality)
        - Breaking change (fix or feature that would cause existing functionality to not work as expected)
        - Content update (adding or correcting album/artist/lyrics information)
        - Documentation update
        - Performance improvement
        - Code refactoring
        - Dependency update
        - Other
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: Description
      description: Provide a clear and concise description of your changes
      placeholder: |
        Describe what this PR does:
        - What problem does it solve?
        - What functionality does it add?
        - What content does it update?
    validations:
      required: true

  - type: textarea
    id: changes
    attributes:
      label: Changes Made
      description: List the specific changes made in this PR
      placeholder: |
        - Added new album "Album Name" with complete tracklist
        - Fixed broken image links on artist page
        - Improved mobile responsiveness of navigation
        - Updated dependencies to latest versions

  - type: input
    id: related-issues
    attributes:
      label: Related Issues
      description: Link any related issues (use "Fixes #123" or "Closes #123" to auto-close)
      placeholder: "Fixes #123, Related to #456"

  - type: dropdown
    id: testing
    attributes:
      label: Testing
      description: How have you tested these changes?
      multiple: true
      options:
        - Manual testing on desktop
        - Manual testing on mobile
        - Automated tests pass
        - Cross-browser testing
        - Content validation
        - Performance testing
        - Accessibility testing
        - Not applicable
    validations:
      required: true

  - type: textarea
    id: testing-details
    attributes:
      label: Testing Details
      description: Provide details about your testing process
      placeholder: |
        - Browsers tested: Chrome, Firefox, Safari
        - Devices tested: Desktop, iPhone, Android
        - Specific test cases or scenarios
        - Any issues found and resolved

  - type: checkboxes
    id: content-changes
    attributes:
      label: Content Changes (if applicable)
      description: If this PR includes content changes, please confirm
      options:
        - label: All information has been verified through reliable sources
        - label: Sources/references are provided for new content
        - label: Images are high quality and properly licensed
        - label: Content follows the project's style guidelines

  - type: textarea
    id: sources
    attributes:
      label: Sources/References (for content changes)
      description: Provide sources for any new or corrected content
      placeholder: |
        - Official website: https://...
        - Discogs: https://...
        - Album liner notes
        - Official press releases

  - type: dropdown
    id: breaking-changes
    attributes:
      label: Breaking Changes
      description: Does this PR introduce any breaking changes?
      options:
        - No breaking changes
        - Minor breaking changes (with migration path)
        - Major breaking changes (requires significant updates)
    validations:
      required: true

  - type: textarea
    id: breaking-details
    attributes:
      label: Breaking Changes Details
      description: If there are breaking changes, describe them and provide migration instructions
      placeholder: |
        - What functionality is affected?
        - How can users/developers adapt to the changes?
        - Are there any deprecation warnings?

  - type: textarea
    id: additional-notes
    attributes:
      label: Additional Notes
      description: Any additional information for reviewers
      placeholder: |
        - Special considerations for review
        - Known limitations or trade-offs
        - Future improvements planned
        - Questions for maintainers

  - type: checkboxes
    id: final-checklist
    attributes:
      label: Final Checklist
      description: Please confirm before submitting
      options:
        - label: My code follows the project's style guidelines
        - label: I have performed a self-review of my own code
        - label: I have commented my code, particularly in hard-to-understand areas
        - label: My changes generate no new warnings or errors
        - label: I have added tests that prove my fix is effective or that my feature works
        - label: New and existing unit tests pass locally with my changes

