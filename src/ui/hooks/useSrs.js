import { useState, useEffect, useCallback } from 'react'
import { SrsService } from '../../domain/services/SrsService.js'
import { cardRepository as cardRepo } from '../../composition/container.js'

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

  const addCards = useCallback(
    async (newCards) => {
      for (const card of newCards) {
        await cardRepo.save(card)
      }
      await loadCards()
    },
    [loadCards],
  )

  return { cards, dueCards, rememberCard, forgetCard, addCards, loadCards }
}
