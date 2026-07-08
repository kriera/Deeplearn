import { describe, expect, it } from 'vitest'
import { AiProviderFactory } from '../../infrastructure/ai/AiProviderFactory.js'

describe('AiProviderFactory', () => {
  it('creates an Anthropic provider', () => {
    const provider = AiProviderFactory.create('anthropic', { apiKey: 'sk-test' })
    expect(provider.name).toBe('anthropic')
    expect(typeof provider.generateExplanation).toBe('function')
  })

  it('creates an Ollama provider', () => {
    const provider = AiProviderFactory.create('ollama', {
      baseUrl: 'http://localhost:11434',
      model: 'llama3.2',
    })
    expect(provider.name).toBe('ollama')
  })

  it('creates an Ollama Cloud provider', () => {
    const provider = AiProviderFactory.create('ollama-cloud', {
      apiKey: 'oc-test',
      model: 'gemma3:12b',
    })
    expect(provider.name).toBe('ollama-cloud')
  })

  it('creates an LM Studio provider', () => {
    const provider = AiProviderFactory.create('lmstudio', {
      baseUrl: 'http://localhost:1234',
      model: 'local-model',
    })
    expect(provider.name).toBe('lmstudio')
  })

  it('throws for unknown provider', () => {
    expect(() => AiProviderFactory.create('unknown')).toThrow('Unknown provider')
  })

  it('each provider implements all required methods', () => {
    const configs = [
      { name: 'anthropic', config: { apiKey: 'sk-test' } },
      { name: 'ollama', config: { baseUrl: 'http://localhost:11434', model: 'llama3.2' } },
      { name: 'ollama-cloud', config: { apiKey: 'oc-test', model: 'gemma3:12b' } },
      { name: 'lmstudio', config: { baseUrl: 'http://localhost:1234', model: 'local-model' } },
    ]

    for (const { name, config } of configs) {
      const provider = AiProviderFactory.create(name, config)
      expect(typeof provider.generateExplanation).toBe('function')
      expect(typeof provider.generateQuiz).toBe('function')
      expect(typeof provider.generateReExplanation).toBe('function')
      expect(typeof provider.generateSRSCards).toBe('function')
    }
  })
})
