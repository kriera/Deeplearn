/**
 * Composition Root — punto único de cableado de dependencias.
 *
 * Clean Architecture (Módulo 2): la configuración y la construcción de
 * adaptadores viven en el borde de la aplicación, nunca en la UI.
 * DIP (Módulo 1): los hooks consumen las abstracciones ya construidas.
 *
 * DeepLearn es local-first (ADR-005): por defecto usa Ollama en la máquina
 * del usuario; todo es configurable por entorno sin tocar código.
 */

import { LocalStorageSessionRepository } from '../infrastructure/storage/repositories/LocalStorageSessionRepository.js'
import { LocalStorageCardRepository } from '../infrastructure/storage/repositories/LocalStorageCardRepository.js'
import { AiProviderFactory } from '../infrastructure/ai/AiProviderFactory.js'

const appConfig = Object.freeze({
  aiProvider: import.meta.env.VITE_AI_PROVIDER || 'ollama',
  aiBaseUrl: import.meta.env.VITE_AI_BASE_URL || 'http://localhost:11434',
  aiModel: import.meta.env.VITE_AI_MODEL || 'gpt-oss:120b-cloud',
})

const sessionRepository = new LocalStorageSessionRepository()
const cardRepository = new LocalStorageCardRepository()
const aiProvider = AiProviderFactory.create(appConfig.aiProvider, {
  baseUrl: appConfig.aiBaseUrl,
  model: appConfig.aiModel,
})

export { appConfig, sessionRepository, cardRepository, aiProvider }
