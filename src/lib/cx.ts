/** Join truthy class name fragments into a single string. */
export const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");
