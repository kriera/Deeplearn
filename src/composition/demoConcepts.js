/**
 * demoConcepts — Registro de los conceptos disponibles en el modo demo (ADR-005).
 *
 * Cada entrada carga su contenido con import dinámico, de modo que el bundle solo
 * descarga el concepto que el usuario elige (code-splitting, DT-007). El primero es
 * el concepto por defecto para mantener compatibilidad con el flujo demo original.
 */

export const DEMO_CONCEPTS = [
  {
    id: 'fotosintesis',
    label: 'La fotosíntesis',
    load: () => import('./demoData.js'),
  },
  {
    id: 'astronomia',
    label: 'La astronomía',
    load: () => import('./demoDataAstronomia.js'),
  },
]

export const DEFAULT_DEMO_CONCEPT = DEMO_CONCEPTS[0].id

export function findDemoConcept(conceptId = DEFAULT_DEMO_CONCEPT) {
  return DEMO_CONCEPTS.find((c) => c.id === conceptId) ?? DEMO_CONCEPTS[0]
}
