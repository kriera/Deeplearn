import { describe, expect, it } from 'vitest'
import { toUserMessage } from '../../ui/i18n/errorMessages.js'

describe('toUserMessage', () => {
  it('traduce fallos de red a una acción concreta (arrancar Ollama)', () => {
    expect(toUserMessage(new TypeError('Failed to fetch'))).toContain('Ollama')
  })

  it('traduce errores HTTP del provider sin exponer el código', () => {
    const msg = toUserMessage(new Error('Ollama error: 500'))
    expect(msg).not.toContain('500')
    expect(msg).toContain('intentarlo')
  })

  it('traduce errores de parseo JSON', () => {
    expect(toUserMessage(new Error('Unexpected token < in JSON'))).toContain('incompleta')
  })

  it('ofrece un mensaje genérico accionable como último recurso', () => {
    expect(toUserMessage(new Error('boom'))).toContain('Vuelve a intentarlo')
    expect(toUserMessage(undefined)).toContain('Vuelve a intentarlo')
  })
})
