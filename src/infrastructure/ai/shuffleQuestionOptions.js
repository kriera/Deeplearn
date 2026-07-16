/**
 * shuffleQuestionOptions — Baraja las opciones de una pregunta de quiz.
 *
 * LLMOps (Módulo 7): guardrail en código. El prompt pide distribuir
 * correct_index entre 0-3, pero el modelo no siempre obedece reglas
 * posicionales (detectado por los evals de contenido). Barajar tras el
 * parseo garantiza la distribución y elimina el sesgo de posición sin
 * depender del cumplimiento del modelo.
 */

export function shuffleQuestionOptions(question, rand = Math.random) {
  const options = question?.options
  const index = question?.correct_index ?? question?.correctIndex
  if (
    !Array.isArray(options) ||
    options.length < 2 ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= options.length
  ) {
    return question
  }

  // Fisher-Yates sobre el orden de los índices
  const order = options.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }

  const updated = {
    ...question,
    options: order.map((i) => options[i]),
  }
  if ('correct_index' in question) updated.correct_index = order.indexOf(index)
  if ('correctIndex' in question) updated.correctIndex = order.indexOf(index)
  return updated
}
