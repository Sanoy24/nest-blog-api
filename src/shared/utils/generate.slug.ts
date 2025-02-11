import slugify from 'slugify';
/**
 * Generates a URL-friendly slug from a given string.
 *
 * This function takes a string as input, truncates it to the first 50 characters,
 * and then uses the `slugify` library to generate a slug.  The slug is customized
 * with specific options for character replacement, removal, and case conversion.
 *
 * @param content The input string to generate the slug from.
 * @returns The generated slug string.
 *
 * @example
 * ```typescript
 * const title = "This is a Blog Post Title!";
 * const slug = generateSlug(title);
 * console.log(slug); // Output: This-is-a-Blog-Post-Title!
 *
 * const longText = "This is a very long string that will be truncated to 50 characters for slug generation.";
 * const longSlug = generateSlug(longText);
 * console.log(longSlug); // Output: This-is-a-very-long-string-that-will-be-truncat
 * ```
 */
export function generateSlug(content: string): string {
  const sliced = content.slice(0, 50); // Truncate to 50 characters
  const slug = slugify(sliced, {
    replacement: '-', // Replace spaces with hyphens
    remove: /[*+~.()'"!:@]/g, // Remove specified special characters
    lower: false, // Do not convert to lowercase
    strict: false, // Do not strip special characters except replacement
    locale: 'vi', // Use Vietnamese locale for proper character handling
    trim: true, // Trim leading/trailing hyphens
  });
  return slug;
}
