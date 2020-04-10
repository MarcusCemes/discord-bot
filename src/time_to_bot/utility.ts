/** A naive implementation to remove complex mentions from messages
 * in order to assist Natural Language algorithms.
 */
function removeMentions(text: string): string {
  if (typeof text !== "string") return text;

  let cleanText: string = text;
  let index: number;
  while ((index = cleanText.indexOf("<@")) !== -1) {
    const end = cleanText.indexOf(">", index);
    cleanText = cleanText.slice(0, index) + cleanText.slice(end + 1);
  }

  return cleanText;
}
