import {
  Button,
  Code,
  Divider,
  FormGroup,
  Intent,
  Spinner,
  TextArea,
} from "@foundry-ridefined/ui";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { browser } from "wxt/browser";

import "@foundry-ridefined/ui/styles";
import "@/styles.css";

import type { SaveSettingsResponse } from "@/settings/messages";
import { parseOrigins } from "@/settings/origin";
import type { Settings } from "@/settings/settings";
import { getSettings, watchSettings } from "@/settings/storage";

export function SettingsPage() {
  // The page waits for storage before rendering so defaults never flash over
  // persisted settings.
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  // Newline-separated textarea contents; parsed only when saved.
  const [originDraft, setOriginDraft] = useState("");
  // Controls whether Save is actionable.
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * Owned by the toolbar icon, not editable here. Tracked only so saving the
   * origin list preserves it instead of writing back a stale value.
   */
  const [extensionEnabled, setExtensionEnabled] = useState(true);

  // Read by the long-lived storage watcher without resubscribing on every edit.
  const hasOriginDraftRef = useRef(false);

  // Makes normalized storage authoritative and clears local edit state.
  function acceptStoredSettings(settings: Settings) {
    hasOriginDraftRef.current = false;
    setHasUnsavedChanges(false);
    setExtensionEnabled(settings.enabled);
    setOriginDraft(settings.origins.join("\n"));
  }

  // Preserves raw user input until Save; invalid lines are discarded during parsing.
  function updateOriginDraft(draft: string) {
    hasOriginDraftRef.current = true;
    setHasUnsavedChanges(true);
    setOriginDraft(draft);
  }

  // Load the initial storage snapshot. Ignore completion after unmount.
  useEffect(() => {
    let isMounted = true;
    void getSettings().then((settings) => {
      if (!isMounted) return;
      acceptStoredSettings(settings);
      setSettingsLoaded(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Follow external toolbar changes without replacing an origin draft in progress.
  useEffect(
    () =>
      watchSettings((settings) => {
        // Always follow the toolbar toggle: it is the only writer of `enabled`,
        // so there is no edit of ours to protect.
        setExtensionEnabled(settings.enabled);
        // The origin list is ours to edit, so leave work in progress alone.
        if (!hasOriginDraftRef.current) acceptStoredSettings(settings);
      }),
    [],
  );

  // Background serialization makes storage, toolbar state, and open tabs converge.
  async function saveOriginDraft() {
    try {
      const saveResult = (await browser.runtime.sendMessage({
        type: "save-settings",
        settings: {
          enabled: extensionEnabled,
          origins: parseOrigins(originDraft),
        },
      })) as SaveSettingsResponse;

      if (saveResult.success) {
        acceptStoredSettings(saveResult.settings);
      } else {
        window.alert(saveResult.error);
      }
    } catch (cause) {
      window.alert(cause instanceof Error ? cause.message : String(cause));
    }
  }

  if (!settingsLoaded) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[720px] items-center justify-center px-6 py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-4 px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div className="text-md leading-none font-semibold">
          foundry RIDefined settings
        </div>
        <Button
          text="Save"
          size="small"
          intent={Intent.PRIMARY}
          disabled={!hasUnsavedChanges}
          onClick={() => void saveOriginDraft()}
        />
      </div>

      <Divider />

      <FormGroup
        label="Allowed Origins"
        labelFor="origins"
        subLabel="Choose which Foundry deployments the skin may run on."
        helperText={
          <>
            Palantir-hosted, like{" "}
            <Code>https://example.palantirfoundry.com</Code>, or your own
            domain. Invalid entries are ignored. When this is empty the skin
            does nothing.
          </>
        }
      >
        <TextArea
          id="origins"
          value={originDraft}
          rows={5}
          fill
          spellCheck={false}
          onChange={(event) => updateOriginDraft(event.currentTarget.value)}
        />
      </FormGroup>
    </div>
  );
}

// WXT loads this module from settings.html after #root exists.
const rootElement = document.querySelector("#root");
if (rootElement === null) throw new Error("settings: #root is missing");

// Page-level layout utilities live here because settings.html has no React body wrapper.
document.body.classList.add(
  "m-0",
  "bg-[var(--bp-surface-background-color-default-rest)]",
);
createRoot(rootElement).render(<SettingsPage />);
