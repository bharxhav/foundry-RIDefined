import * as v from "valibot";

declare const validOrigin: unique symbol;

/** An exact HTTPS origin accepted by `parseOrigins`. */
export type ValidOrigin = string & { readonly [validOrigin]: true };

export function includesOrigin(
  origins: readonly ValidOrigin[],
  origin: string,
): boolean {
  return origins.some((candidate) => candidate === origin);
}

const OriginSchema = v.pipe(
  v.string(),
  v.trim(),
  v.url(),
  v.transform((input) => new URL(input)),
  v.check(
    (url) =>
      url.protocol === "https:" &&
      url.port === "" &&
      url.username === "" &&
      url.password === "" &&
      url.pathname === "/" &&
      url.search === "" &&
      url.hash === "",
  ),
  v.transform((url) => url.origin as ValidOrigin),
);

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

  return [
    ...new Set(
      inputs.flatMap((input) => {
        const result = v.safeParse(OriginSchema, input);
        return result.success ? [result.output] : [];
      }),
    ),
  ];
}
