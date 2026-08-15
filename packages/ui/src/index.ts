/**
 * Shared design-system access.
 *
 * This package is deliberately small: the single door to Blueprint plus the
 * design tokens.
 *
 * It holds no product components and touches no browser extension APIs. Pull the
 * visual layer in separately via "@foundry-ridefined/ui/styles" so stylesheet
 * side effects stay explicit at the entrypoint.
 */

export { Colors, tokens } from "./tokens";

// Blueprint, reachable only through this package. See blueprint.ts.
export * from "./blueprint";
