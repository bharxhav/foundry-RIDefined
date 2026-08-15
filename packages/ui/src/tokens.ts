/**
 * Design tokens.
 *
 * Two ways to reach Blueprint's visual language:
 *
 * - `Colors` gives literal hex values, for the rare case where a computed
 *   colour is needed in JS (canvas, chart libraries, inline SVG fills).
 * - `tokens` gives CSS custom property references, which is what UI code
 *   should normally use, because they follow the light/dark theme at runtime
 *   while hex literals do not.
 */

export { Colors } from "@blueprintjs/colors";

export const tokens = {
  background: {
    default: "var(--bp-surface-background-color-default-rest)",
    hover: "var(--bp-surface-background-color-default-hover)",
    active: "var(--bp-surface-background-color-default-active)",
    primary: "var(--bp-surface-background-color-primary-rest)",
  },
  text: {
    default: "var(--bp-typography-color-default-rest)",
    muted: "var(--bp-typography-color-muted)",
    primary: "var(--bp-typography-color-primary-rest)",
    danger: "var(--bp-typography-color-danger-rest)",
  },
  font: {
    family: "var(--bp-typography-family-default)",
    mono: "var(--bp-typography-family-mono)",
    sizeBody: "var(--bp-typography-size-body-medium)",
    sizeHeading: "var(--bp-typography-size-heading-medium)",
    weightBold: "var(--bp-typography-weight-bold)",
    lineHeight: "var(--bp-typography-line-height-default)",
  },
  border: {
    color: "var(--bp-surface-border-color-default)",
    strong: "var(--bp-surface-border-color-strong)",
    width: "var(--bp-surface-border-width)",
    radius: "var(--bp-surface-border-radius)",
  },
  intent: {
    primary: "var(--bp-intent-primary-rest)",
    success: "var(--bp-intent-success-rest)",
    warning: "var(--bp-intent-warning-rest)",
    danger: "var(--bp-intent-danger-rest)",
  },
  elevation: {
    0: "var(--bp-surface-shadow-0)",
    1: "var(--bp-surface-shadow-1)",
    2: "var(--bp-surface-shadow-2)",
    3: "var(--bp-surface-shadow-3)",
    4: "var(--bp-surface-shadow-4)",
  },
  spacing: "var(--bp-surface-spacing)",
} as const;
