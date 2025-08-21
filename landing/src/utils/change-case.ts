export function paramCase(str: string) {
  return str
    .toLowerCase()
    .trim() // Trim whitespace at both ends to avoid leading/trailing hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove any non-alphanumeric characters except hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
}