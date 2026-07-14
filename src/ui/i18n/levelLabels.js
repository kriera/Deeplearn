/**
 * Etiquetas de nivel para la interfaz (en español).
 *
 * Los contratos pedagógicos viven en el dominio (Level.js); estos nombres
 * son presentación: cómo se muestra cada nivel Feynman al usuario.
 */

const LEVEL_LABELS = Object.freeze({
  1: 'Elemental',
  2: 'Principiante',
  3: 'Intermedio',
  4: 'Avanzado',
  5: 'Experto',
})

export function levelLabel(number) {
  return LEVEL_LABELS[number] ?? `Nivel ${number}`
}
