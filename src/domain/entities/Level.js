/**
 * Level — Value Object inmutable que representa un nivel de aprendizaje.
 *
 * Clean Architecture (Módulo 2): Entidad de dominio pura, sin dependencias externas.
 * SRP (Módulo 1): Única responsabilidad: modelar un nivel de aprendizaje.
 */

// `label` es un identificador interno (se persiste dentro de las sesiones en
// localStorage); la UI muestra los nombres en castellano vía levelLabel(number).
// El resto del contrato va en español: se interpola en los prompts y el
// contenido generado debe salir siempre en castellano.
const LEVEL_CONTRACTS = [
  {
    level: 1,
    label: 'Elemental',
    audience: 'un niño de 6 años con curiosidad y sin conocimientos previos',
    rules: [
      'Usa SOLO palabras cotidianas que entendería un niño de 6 años.',
      'NADA de vocabulario técnico o específico del dominio.',
      'Usa exactamente una analogía corta de la vida diaria (juguetes, comida, animales, juegos).',
      'Frases cortas. Máximo 15 palabras por frase.',
      'Explica únicamente la idea central. No trates subtemas.',
    ],
    quizRules:
      'Las preguntas DEBEN usar las mismas palabras cotidianas de la explicación. Evalúa SOLO la analogía y la idea central. Nada de vocabulario técnico.',
  },
  {
    level: 2,
    label: 'Basic',
    audience: 'un estudiante de secundaria de 14 años con curiosidad y cultura general',
    rules: [
      'Introduce como máximo 3 términos técnicos. Define cada término en lenguaje llano la primera vez que lo uses.',
      'NO des por sabido nada de los niveles 3, 4 o 5.',
      'Usa un ejemplo concreto del mundo real (distinto de la analogía del nivel 1).',
      'Conecta el concepto con algo que el estudiante ya conozca del colegio.',
      'Puedes usar frases algo más largas que en el nivel 1, pero mantenlas claras.',
    ],
    quizRules:
      'Las preguntas deben evaluar SOLO los 3 términos definidos y el ejemplo introducido. No preguntes nada que la explicación no haya cubierto. Usa las mismas definiciones llanas.',
  },
  {
    level: 3,
    label: 'Medium',
    audience: 'un estudiante de primer año de carrera que ha cursado un semestre de la materia',
    rules: [
      'Usa el vocabulario académico estándar del campo. NO hace falta que definas los términos habituales del dominio.',
      'Introduce el mecanismo o proceso formal que hay detrás del concepto.',
      'Incluye una comparación o contraste con un concepto relacionado.',
      'NO des por supuestos conocimientos de posgrado ni profesionales.',
    ],
    quizRules:
      'Las preguntas evalúan el mecanismo formal, el vocabulario académico empleado y la comparación introducida. Nada más allá de la explicación.',
  },
  {
    level: 4,
    label: 'Advanced',
    audience: 'un profesional en ejercicio o un estudiante de último curso del campo',
    rules: [
      'Da por supuesto un dominio pleno del campo. Usa vocabulario técnico con libertad.',
      'Cubre casos límite, matices y limitaciones conocidas del concepto.',
      'Haz referencia al modelo, marco teórico o teoría subyacente.',
      'Incluye una implicación profesional real o un modo de fallo.',
    ],
    quizRules:
      'Las preguntas evalúan los casos límite, las limitaciones, los fundamentos teóricos y las implicaciones profesionales tratadas. Nada más allá de la explicación.',
  },
  {
    level: 5,
    label: 'Expert',
    audience: 'un investigador o profesional senior en la frontera del campo',
    rules: [
      'Da por supuesto el dominio de todos los niveles anteriores.',
      'Trata preguntas de investigación abiertas, debates sin resolver o fronteras activas.',
      'Cubre los compromisos entre enfoques o interpretaciones que compiten entre sí.',
      'Haz referencia al estado del arte y a lo que sigue sin resolver.',
    ],
    quizRules:
      'Las preguntas indagan en las cuestiones abiertas, los compromisos, las interpretaciones y los temas de frontera mencionados. Nada más allá de la explicación.',
  },
]

function validateLevelNumber(number) {
  if (!Number.isInteger(number) || number < 1 || number > 5) {
    throw new Error('Level must be between 1 and 5')
  }
}

const Level = {
  create(number) {
    validateLevelNumber(number)
    const contract = LEVEL_CONTRACTS[number - 1]
    return Object.freeze({
      number: contract.level,
      label: contract.label,
      audience: contract.audience,
      rules: [...contract.rules],
      quizRules: contract.quizRules,
    })
  },

  equals(a, b) {
    return a.number === b.number
  },
}

export { Level, LEVEL_CONTRACTS }
