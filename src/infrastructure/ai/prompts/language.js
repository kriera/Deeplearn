/**
 * language — Directiva de idioma de salida.
 *
 * DeepLearn es una app monolingüe en castellano (UI, `<html lang="es">`,
 * sugerencias y mensajes de error). El contenido generado debe salir SIEMPRE
 * en español, aunque el usuario escriba el concepto en otro idioma.
 *
 * Prompt Engineering (Módulo 5): el idioma se exige de forma explícita en el
 * prompt, nunca se infiere. Una heurística previa deducía el idioma de la
 * cadena del concepto y caía en inglés por defecto, de modo que conceptos
 * españoles sin tildes ("Oferta y demanda", "Relatividad general") pedían
 * inglés explícitamente al modelo.
 * DRY (Módulo 1): única implementación compartida por todos los prompts.
 */

export const OUTPUT_LANGUAGE = 'es'

export function outputLanguageDirective() {
  return 'IMPORTANTE: escribe TODO el contenido generado (explicaciones, preguntas, opciones y aclaraciones) íntegramente en español, aunque el concepto esté escrito en otro idioma.'
}
