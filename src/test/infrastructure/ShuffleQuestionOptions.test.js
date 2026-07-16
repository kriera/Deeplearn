/**
 * shuffleQuestionOptions — Guardrail de distribución de la respuesta correcta.
 *
 * LLMOps (Módulo 7): los evals detectaron que el modelo no siempre
 * distribuye correct_index; el barajado en código lo garantiza.
 */

import { describe, expect, it } from 'vitest'
import { shuffleQuestionOptions } from '../../infrastructure/ai/shuffleQuestionOptions.js'

const QUESTION = {
  id: 'q1',
  question: '¿Qué es X?',
  options: ['A', 'B', 'C', 'D'],
  correct_index: 1,
  explanation: 'B es la correcta.',
}

/** rand determinista para forzar una permutación concreta en los tests */
function randFrom(values) {
  let i = 0
  return () => values[i++ % values.length]
}

describe('shuffleQuestionOptions', () => {
  it('la respuesta correcta sigue siéndolo tras barajar', () => {
    const shuffled = shuffleQuestionOptions(QUESTION)

    expect(shuffled.options).toHaveLength(4)
    expect([...shuffled.options].sort()).toEqual(['A', 'B', 'C', 'D'])
    expect(shuffled.options[shuffled.correct_index]).toBe('B')
  })

  it('reordena las opciones cuando el rand lo indica', () => {
    // Con rand siempre 0, Fisher-Yates invierte posiciones de forma conocida
    const shuffled = shuffleQuestionOptions(QUESTION, randFrom([0]))

    expect(shuffled.options).not.toEqual(QUESTION.options)
    expect(shuffled.options[shuffled.correct_index]).toBe('B')
  })

  it('actualiza correctIndex camelCase si es el campo presente', () => {
    const camel = { ...QUESTION, correctIndex: 1 }
    delete camel.correct_index

    const shuffled = shuffleQuestionOptions(camel)

    expect(shuffled.options[shuffled.correctIndex]).toBe('B')
    expect(shuffled).not.toHaveProperty('correct_index')
  })

  it('devuelve la pregunta intacta si el índice es inválido o faltan opciones', () => {
    const noIndex = { id: 'q1', options: ['A', 'B'] }
    const badIndex = { ...QUESTION, correct_index: 9 }
    const noOptions = { id: 'q1', correct_index: 0 }

    expect(shuffleQuestionOptions(noIndex)).toBe(noIndex)
    expect(shuffleQuestionOptions(badIndex)).toBe(badIndex)
    expect(shuffleQuestionOptions(noOptions)).toBe(noOptions)
  })
})
