declare const validOrigin: unique symbol;

/** An exact HTTPS origin accepted by `parseOrigins`. */
export type ValidOrigin = string & { readonly [validOrigin]: true };

export function includesOrigin(
  origins: readonly ValidOrigin[],
  origin: string,
): boolean {
  return origins.some((candidate) => candidate === origin);
}

/**
 * Parses newline-separated origins, discarding malformed and duplicate values.
 *
 * `URL` supplies the platform's URL and international-domain canonicalization.
 * A valid entry is HTTPS on the default port with no credentials, path, query,
 * or fragment. Foundry can be hosted on any domain, so hostnames are unrestricted.
 */
export function parseOrigins(value: unknown): ValidOrigin[] {
  const inputs = typeof value === "string" ? value.split("\n") : value;
  if (!Array.isArray(inputs)) return [];

  const origins = new Set<ValidOrigin>();

  for (const input of inputs) {
    if (typeof input !== "string") continue;

    try {
      const url = new URL(input.trim());
      if (
        url.protocol === "https:" &&
        url.port === "" &&
        url.username === "" &&
        url.password === "" &&
        url.pathname === "/" &&
        url.search === "" &&
        url.hash === ""
      ) {
        origins.add(url.origin as ValidOrigin);
      }
    } catch {
      // Invalid entries are not part of the allowlist.
    }
  }

  return [...origins];
}
