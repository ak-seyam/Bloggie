# Contribution

## Naming conventions

### File and folders naming

Files folders will follow `kebab-case`

### branch naming

branches are separated into 4 categories

- main (holds the stable releases)
- dev \[nightly\] (holds releases after being accepted from PRs)
- feat-\[feature-name\]
- fix-\[Issue-number\]

### paths in .env

each path should end with a forward slash

## Folders structure

The project will contain

- models (The classes mapped to database documents/collections)
- controller (Does high level operations with data, i.e. auth and application details)
- service (does the routing, including any middleware)
- tests
  - unit
  - integration
- app.ts (the main file)
