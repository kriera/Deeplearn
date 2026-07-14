/**
 * language — Detección de idioma del concepto y directiva de idioma de salida.
 *
 * Prompt Engineering (Módulo 5): el idioma de la respuesta se exige de forma
 * explícita en el prompt; la heurística solo decide qué directiva aplicar.
 * DRY (Módulo 1): única implementación compartida por todos los prompts.
 */

export function detectLanguage(concept) {
  const sample = concept.toLowerCase()
  // Match articles at start of string OR surrounded by spaces
  const spanishMarkers = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡']
  const spanishWords = [
    ' el ',
    ' la ',
    ' los ',
    ' las ',
    ' es ',
    ' una ',
    ' que ',
    ' por ',
    ' del ',
  ]
  const startsWithArticle = /^(el|la|los|las|un|una|unos|unas)\s/i.test(concept.trim())
  const hasSpanishChar = spanishMarkers.some((m) => sample.includes(m))
  const hasSpanishWord = spanishWords.some((w) => sample.includes(w))
  return hasSpanishChar || hasSpanishWord || startsWithArticle ? 'es' : 'en'
}

export function outputLanguageDirective(lang) {
  return lang === 'es'
    ? 'IMPORTANTE: escribe TODO el contenido generado (explicaciones, preguntas, opciones y aclaraciones) íntegramente en español.'
    : 'IMPORTANT: write ALL generated content (explanations, questions, options, and clarifications) entirely in English.'
}
