const nlp = require('compromise');

/**
 * Generates an excerpt from the given content.  You can customize this
 * function to use different excerpt generation logic (e.g., slicing,
 * summarizing libraries).
 *
 * @param content The post content.
 * @returns The generated excerpt.
 */

export function generateExcerpt(content: string): string {
  if (!content || typeof content !== 'string') return '';
  const doc = nlp(content);
  const sentences = doc.sentences().out('array'); // Get sentences as an array

  const excerpt = sentences.slice(0, 3).join(' '); // Get first 3 sentences
  return excerpt;
}
