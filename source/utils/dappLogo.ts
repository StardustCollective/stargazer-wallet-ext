export const MAX_LOGO_LENGTH = 2048;

// Favicons are page-controlled: keep them only as bounded strings.
export const sanitizeLogo = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length <= MAX_LOGO_LENGTH ? value : undefined;
