/**
 * Level — Value Object inmutable que representa un nivel de aprendizaje.
 *
 * Clean Architecture (Módulo 2): Entidad de dominio pura, sin dependencias externas.
 * SRP (Módulo 1): Única responsabilidad: modelar un nivel de aprendizaje.
 */

const LEVEL_CONTRACTS = [
  {
    level: 1,
    label: 'Elemental',
    audience: 'a curious 6-year-old child with no prior knowledge',
    rules: [
      'Use ONLY everyday words a 6-year-old would know.',
      'NO domain-specific vocabulary whatsoever.',
      'Use exactly one short analogy from everyday life (toys, food, animals, play).',
      'Keep sentences short. Maximum 15 words per sentence.',
      'Explain the single core idea only. Do not cover subtopics.',
    ],
    quizRules:
      'Questions MUST use the same everyday words from the explanation. Test the analogy and the single core idea ONLY. No domain vocabulary.',
  },
  {
    level: 2,
    label: 'Basic',
    audience: 'a curious 14-year-old high school student with general knowledge',
    rules: [
      'Introduce at most 3 domain-specific terms. Define each term the first time you use it in plain language.',
      'Do NOT assume knowledge from Level 3, 4, or 5.',
      'Use one concrete real-world example (not the Level 1 analogy).',
      'Connect the concept to something the student already knows from school.',
      'You may use slightly longer sentences than Level 1, but keep them clear.',
    ],
    quizRules:
      'Questions must ONLY test the 3 defined terms and the example introduced. Do not test anything beyond what the explanation covered. Use the same plain definitions.',
  },
  {
    level: 3,
    label: 'Medium',
    audience: 'a college freshman who has completed one semester of the relevant subject',
    rules: [
      'Use standard academic vocabulary for the field. You do NOT need to define common domain terms.',
      'Introduce the formal mechanism or process behind the concept.',
      'Include one comparison/contrast with a related concept.',
      'Do NOT assume graduate-level or professional knowledge.',
    ],
    quizRules:
      'Questions test the formal mechanism, the academic vocabulary used, and the comparison introduced. Nothing beyond the explanation.',
  },
  {
    level: 4,
    label: 'Advanced',
    audience: 'a working professional or senior undergraduate in the relevant field',
    rules: [
      'Assume full domain fluency. Use technical vocabulary freely.',
      'Cover edge cases, nuances, and known limitations of the concept.',
      'Reference the underlying model, framework, or theory.',
      'Include a real-world professional implication or failure mode.',
    ],
    quizRules:
      'Questions test the edge cases, limitations, theoretical underpinnings, and professional implications discussed. Nothing beyond the explanation.',
  },
  {
    level: 5,
    label: 'Expert',
    audience: 'a researcher or senior practitioner at the cutting edge of the field',
    rules: [
      'Assume mastery of all prior levels.',
      'Discuss open research questions, unresolved debates, or active frontiers.',
      'Cover tradeoffs between competing approaches or interpretations.',
      'Reference the state of the art and what remains unsolved.',
    ],
    quizRules:
      'Questions probe open questions, tradeoffs, interpretations, and frontier topics mentioned. Nothing beyond the explanation.',
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
