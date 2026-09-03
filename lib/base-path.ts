// Kept as a plain string (not read from next.config.ts) so it can be
// imported by both server/client components and the Next config itself
// without pulling in the config module's side effects.
// Empty because the site is served from the luminabayarea.com custom
// domain's root; set back to "/annas-home" if it ever moves to the
// default jeffrieszhang.github.io/annas-home/ URL.
export const basePath = "";

export function withBasePath(path: string) {
  return `${basePath}${path}`;
}
