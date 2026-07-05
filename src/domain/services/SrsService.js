/**
 * SrsService — Servicio de dominio para el algoritmo SM-2 de repaso espaciado.
 *
 * Clean Architecture (Módulo 2): Servicio de dominio puro, sin dependencias externas.
 * SRP (Módulo 1): Única responsabilidad: gestionar el scheduling de tarjetas SRS.
 * TDD (Módulo 6): Tests escritos antes de la implementación.
 */

const MIN_EASE = 1.3
const MAX_EASE = 3.0
const MS_PER_DAY = 86400000

const SrsService = {
  createCard({ id, concept, levelLabel, front, back }) {
    return Object.freeze({
      id,
      concept,
      levelLabel,
      front,
      back,
      interval: 1,
      ease: 2.5,
      nextReview: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      lastReviewed: null,
      reviews: 0,
      remembered: 0,
      forgotten: 0,
    })
  },

  remember(card) {
    const newEase = Math.min(MAX_EASE, (card.ease || 2.5) + 0.1)
    const newInterval = Math.max(1, (card.interval || 1) * newEase)
    return Object.freeze({
      ...card,
      ease: +newEase.toFixed(2),
      interval: +newInterval.toFixed(2),
      nextReview: new Date(Date.now() + newInterval * MS_PER_DAY).toISOString(),
      lastReviewed: new Date().toISOString(),
      reviews: (card.reviews || 0) + 1,
      remembered: (card.remembered || 0) + 1,
    })
  },

  forget(card) {
    const newEase = Math.max(MIN_EASE, (card.ease || 2.5) - 0.2)
    return Object.freeze({
      ...card,
      ease: +newEase.toFixed(2),
      interval: 1,
      nextReview: new Date(Date.now() + MS_PER_DAY).toISOString(),
      lastReviewed: new Date().toISOString(),
      reviews: (card.reviews || 0) + 1,
      forgotten: (card.forgotten || 0) + 1,
    })
  },

  getDueCards(cards) {
    const now = Date.now()
    return cards.filter((c) => new Date(c.nextReview).getTime() <= now)
  },
}

export { SrsService }
