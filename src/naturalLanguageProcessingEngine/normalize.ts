/**
 * NLP text normalization and voice input cleaning.
 *
 * Pure functions — no side effects, no app state.
 */

// ─── Phonetic normalization ─────────────────────────────────────────────

/**
 * Phonetic normalization for Indian food search (Hinglish/Marathi/Hindi).
 *
 * Reduces both query AND stored keywords to a canonical form so
 * variations match without storing every permutation:
 *   ladoo/laado/lado/laadu/laddu/ladu → ladu
 *   bhaji/baji → baji
 *   dal/daal/dhal → dal
 */
export function normalizeForSearch(text: string): string {
  return text
    // Vowel doubling → single vowel
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/ii/g, 'i')
    .replace(/uu/g, 'u')
    // Double consonants → single
    .replace(/dd/g, 'd')
    .replace(/tt/g, 't')
    .replace(/nn/g, 'n')
    .replace(/ll/g, 'l')
    // Aspirated consonants → base
    .replace(/bh/g, 'b')
    .replace(/dh/g, 'd')
    .replace(/gh/g, 'g')
    .replace(/jh/g, 'j')
    .replace(/kh/g, 'k')
    .replace(/th/g, 't')
    // sh→s (shev↔sev, sheera↔seera, shengdana↔sengdana)
    .replace(/sh/g, 's')
    // ph→f (phulka↔fulka)
    .replace(/ph/g, 'f');
}

// ─── Voice text cleaning ────────────────────────────────────────────────

/**
 * Clean raw voice/speech text:
 *  - Strip apostrophes & contraction suffixes ("don't" → "don")
 *  - Remove filler words the mic may inject
 *  - Normalize whitespace
 */
export function cleanVoiceText(text: string): string {
  return text
    // "don't" → "don", "won't" → "won", "can't" → "can"
    .replace(/[''\u2019]t\b/gi, '')
    // Remove stray apostrophes: "don'" → "don"
    .replace(/[''\u2019]/g, '')
    // Remove common filler words the mic may inject
    .replace(/\b(um|uh|hmm|like|please|okay|ok|i want|i need|add|give me|put)\b/gi, '')
    // Collapse extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}
