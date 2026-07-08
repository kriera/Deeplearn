/**
 * AiProviderFactory — Factory Pattern para crear proveedores de IA.
 *
 * Factory Pattern (Módulo 1): Crear objetos sin especificar su clase exacta.
 * OCP (Módulo 1): Abierto para extensión (nuevo provider = nuevo archivo), cerrado para modificación.
 * Hexagonal Architecture (Módulo 2): Adaptadores que implementan el puerto AiProvider.
 */

import { AnthropicProvider } from './providers/AnthropicProvider.js'
import { OllamaProvider } from './providers/OllamaProvider.js'
import { OllamaCloudProvider } from './providers/OllamaCloudProvider.js'
import { LmStudioProvider } from './providers/LmStudioProvider.js'

const REGISTRY = {
  anthropic: AnthropicProvider,
  ollama: OllamaProvider,
  'ollama-cloud': OllamaCloudProvider,
  lmstudio: LmStudioProvider,
}

const AiProviderFactory = {
  create(type, config) {
    const ProviderClass = REGISTRY[type]
    if (!ProviderClass) {
      throw new Error(`Unknown provider: ${type}`)
    }
    return new ProviderClass(config)
  },
}

export { AiProviderFactory }
