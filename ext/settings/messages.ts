import * as v from "valibot";

import type { Settings } from "./settings";

/**
 * The wire contract between our surfaces.
 *
 * Two messages travel in opposite directions:
 *
 *   settings window / options page  --save-settings-->  background
 *   background  --settings-changed-->  content scripts
 *
 * Guards check the exact key count as well as the discriminant, so a message
 * carrying unexpected extra fields is rejected rather than partially trusted.
 */

export interface SaveSettingsMessage {
  type: "save-settings";
  settings: Settings;
}

export type SaveSettingsResponse =
  | { success: true; settings: Settings }
  | { success: false; error: string };

export interface SettingsChangedMessage {
  type: "settings-changed";
}

export const SETTINGS_CHANGED: SettingsChangedMessage = {
  type: "settings-changed",
};

const SaveSettingsMessageSchema = v.strictObject({
  type: v.literal("save-settings"),
  settings: v.unknown(),
});

const SettingsChangedMessageSchema = v.strictObject({
  type: v.literal("settings-changed"),
});

export function isSaveSettingsMessage(
  value: unknown,
): value is SaveSettingsMessage {
  return v.safeParse(SaveSettingsMessageSchema, value).success;
}

export function isSettingsChangedMessage(
  value: unknown,
): value is SettingsChangedMessage {
  return v.safeParse(SettingsChangedMessageSchema, value).success;
}
