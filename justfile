# List the available commands by group.
[group('porcelain')]
default:
    @just --list

# Install project dependencies.
[group('dev')]
install:
    pnpm install

# Start the default Chrome development session.
[group('dev')]
dev: dev-chrome

# Start the extension in Firefox.
[group('dev')]
dev-firefox:
    pnpm dev:firefox

# Start the extension in Chrome.
[group('dev')]
dev-chrome:
    pnpm dev:chrome

# Apply all fixes, then validate and build everything.
[group('porcelain')]
all: fmt lint-fix check build

# Format source files in place.
[group('mutating')]
fmt:
    pnpm fmt

# Check formatting without changing files.
[group('non-mutating')]
fmt-check:
    pnpm fmt:check

# Report lint errors without changing files.
[group('non-mutating')]
lint:
    pnpm lint

# Fix automatically repairable lint errors.
[group('mutating')]
lint-fix:
    pnpm lint:fix

# Build and archive both browser targets.
[group('non-mutating')]
build: build-firefox build-chrome build-firefox-zip build-chrome-zip

# Build the Firefox extension.
[group('non-mutating')]
build-firefox:
    pnpm build:firefox

# Build the Chrome extension.
[group('non-mutating')]
build-chrome:
    pnpm build:chrome

# Report type errors without changing files.
[group('non-mutating')]
typecheck:
    pnpm typecheck

# Run every read-only source validation.
[group('porcelain')]
check: fmt-check lint typecheck

# Archive the Firefox build.
[group('non-mutating')]
build-firefox-zip:
    pnpm zip:firefox

# Archive the Chrome build.
[group('non-mutating')]
build-chrome-zip:
    pnpm zip:chrome
