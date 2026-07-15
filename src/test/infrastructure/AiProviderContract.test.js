/**
 * Contrato del puerto AiProvider — suite compartida (LSP, Módulo 1).
 *
 * Cada adaptador debe ser sustituible: mismos métodos, mismos shapes de
 * retorno y mismos errores etiquetados, sea cual sea su transporte.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { OllamaProvider } from '../../infrastructure/ai/providers/OllamaProvider.js'
import { OllamaCloudProvider } from '../../infrastructure/ai/providers/OllamaCloudProvider.js'
import { LmStudioProvider } from '../../infrastructure/ai/providers/LmStudioProvider.js'
import { AnthropicProvider } from '../../infrastructure/ai/providers/AnthropicProvider.js'

const PORT_METHODS = [
  'generateExplanation',
  'generateQuiz',
  'generateReExplanation',
  'generateSRSCards',
]

const CASES = [
  {
    label: 'OllamaProvider',
    make: () => new OllamaProvider({ baseUrl: 'http://localhost:11434', model: 'test-model' }),
    reply: (content) => ({ message: { content }, prompt_eval_count: 10, eval_count: 20 }),
    endpoint: 'http://localhost:11434/api/chat',
    maxTokensOf: (body) => body.options.num_predict,
    budgets: { explanation: 8000, quiz: 12000 },
    errorLabel: 'Ollama',
  },
  {
    label: 'OllamaCloudProvider',
    make: () => new OllamaCloudProvider({ apiKey: 'test-key', model: 'test-model' }),
    reply: (content) => ({ message: { content }, prompt_eval_count: 10, eval_count: 20 }),
    endpoint: 'https://api.ollama.com/api/chat',
    maxTokensOf: (body) => body.options.num_predict,
    budgets: { explanation: 1200, quiz: 2400 },
    errorLabel: 'Ollama Cloud',
  },
  {
    label: 'LmStudioProvider',
    make: () => new LmStudioProvider({ baseUrl: 'http://localhost:1234', model: 'test-model' }),
    reply: (content) => ({
      choices: [{ message: { content } }],
      usage: { prompt_tokens: 10, completion_tokens: 20 },
    }),
    endpoint: 'http://localhost:1234/v1/chat/completions',
    maxTokensOf: (body) => body.max_tokens,
    budgets: { explanation: 1200, quiz: 2400 },
    errorLabel: 'LM Studio',
  },
  {
    label: 'AnthropicProvider',
    make: () => new AnthropicProvider({ apiKey: 'test-key', model: 'test-model' }),
    reply: (content) => ({
      content: [{ text: content }],
      usage: { input_tokens: 10, output_tokens: 20 },
    }),
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokensOf: (body) => body.max_tokens,
    budgets: { explanation: 1200, quiz: 2400 },
    errorLabel: 'Anthropic API',
  },
]

for (const c of CASES) {
  describe(`Contrato AiProvider — ${c.label}`, () => {
    let fetchMock
    let provider

    beforeEach(() => {
      fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)
      provider = c.make()
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    const respondWith = (content) =>
      fetchMock.mockResolvedValue({ ok: true, json: async () => c.reply(content) })

    it('implementa los 4 métodos del puerto', () => {
      for (const method of PORT_METHODS) {
        expect(typeof provider[method]).toBe('function')
      }
    })

    it('genera una explicación parseando el JSON del modelo', async () => {
      respondWith('{"explanation":"La gravedad atrae."}')

      const result = await provider.generateExplanation('gravedad', 1)

      expect(result).toEqual({ explanation: 'La gravedad atrae.' })
      const [url, init] = fetchMock.mock.calls[0]
      expect(url).toBe(c.endpoint)
      expect(c.maxTokensOf(JSON.parse(init.body))).toBe(c.budgets.explanation)
    })

    it('genera un quiz con su presupuesto de tokens', async () => {
      respondWith('{"questions":[]}')

      const result = await provider.generateQuiz('gravedad', 1, 'Una explicación.')

      expect(result).toEqual({ questions: [] })
      const [, init] = fetchMock.mock.calls[0]
      expect(c.maxTokensOf(JSON.parse(init.body))).toBe(c.budgets.quiz)
    })

    it('lanza un error etiquetado con el status HTTP', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 503 })

      await expect(provider.generateExplanation('gravedad', 1)).rejects.toThrow(
        `${c.errorLabel} error: 503`,
      )
    })

    it('tolera una respuesta con contenido vacío', async () => {
      respondWith('')

      const result = await provider.generateExplanation('gravedad', 1)

      expect(result).toEqual({})
    })

    it('extrae el JSON aunque venga envuelto en code fences', async () => {
      respondWith('```json\n{"explanation":"con fences"}\n```')

      const result = await provider.generateExplanation('gravedad', 1)

      expect(result).toEqual({ explanation: 'con fences' })
    })
  })
}

describe('OllamaProvider — thinking mode', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('usa message.thinking cuando el modelo deja content vacío', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: { content: '', thinking: '{"explanation":"desde thinking"}' },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)
    const provider = new OllamaProvider({ model: 'gpt-oss:120b-cloud' })

    const result = await provider.generateExplanation('gravedad', 1)

    expect(result).toEqual({ explanation: 'desde thinking' })
  })
})
