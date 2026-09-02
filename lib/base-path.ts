// Kept as a plain string (not read from next.config.ts) so it can be
// imported by both server/client components and the Next config itself
// without pulling in the config module's side effects.
export const basePath = "/annas-home";

export function withBasePath(path: string) {
  return `${basePath}${path}`;
}
