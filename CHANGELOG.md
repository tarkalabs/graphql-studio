# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2020-10-08

### Known Bugs

- When a table can only every be fully expanded or fully collapsed it should appear as a leaf node. But it does not.

### Added

- Initial CHANGELOG, All changes as additions and removals as well as known bugs will be tracked in the changelog.
- Changelog versioning will be updated 

### Removed

- Expanding/Collapsing is now the same action, it is now just 'interactable'

### Changed

- Leaf nodes in diagram now cannot be interacted with. Therefore they expand/collapse whenever their nearest sibling is expanded/collapsed