/**
 * Concatena clases CSS condicionalmente.
 * Versión minimalista de `clsx`. Si más adelante necesitamos
 * el comportamiento avanzado de tailwind-merge, lo cambiamos.
 */
export function cn(
  ...inputs: Array<string | undefined | null | false>
): string {
  return inputs.filter(Boolean).join(" ");
}
