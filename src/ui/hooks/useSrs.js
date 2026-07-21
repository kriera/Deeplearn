import { useState, useEffect, useCallback } from 'react'
import { SrsService } from '../../domain/services/SrsService.js'
import { GenerateSrsCards } from '../../application/use-cases/GenerateSrsCards.js'
import { cardRepository as cardRepo, aiProvider } from '../../composition/container.js'
import { findDemoConcept } from '../../composition/demoConcepts.js'

export function useSrs() {
  const [cards, setCards] = useState([])

  const loadCards = useCallback(async () => {
    const all = await cardRepo.findAll()
    setCards(all)
  }, [])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  const dueCards = SrsService.getDueCards(cards)

  const rememberCard = useCallback(async (card) => {
    const updated = SrsService.remember(card)
    await cardRepo.update(card.id, updated)
    setCards((prev) => prev.map((c) => (c.id === card.id ? updated : c)))
  }, [])

  const forgetCard = useCallback(async (card) => {
    const updated = SrsService.forget(card)
    await cardRepo.update(card.id, updated)
    setCards((prev) => prev.map((c) => (c.id === card.id ? updated : c)))
  }, [])

  const generateForLevel = useCallback(
    async (session, levelNumber) => {
      const created = await GenerateSrsCards.execute(session, levelNumber, aiProvider, cardRepo)
      await loadCards()
      return created
    },
    [loadCards],
  )

  // Modo demo (ADR-005): siembra tarjetas de ejemplo pre-generadas para poder
  // probar el repaso espaciado sin Ollama. El concepto se resuelve en el registro
  // y su contenido se trae con import dinámico (code-splitting).
  const seedDemoCards = useCallback(
    async (conceptId) => {
      const { DEMO_CARDS } = await findDemoConcept(conceptId).load()
      for (const card of DEMO_CARDS) await cardRepo.save(card)
      await loadCards()
    },
    [loadCards],
  )

  return { cards, dueCards, rememberCard, forgetCard, generateForLevel, seedDemoCards, loadCards }
}
