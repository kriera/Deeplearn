/**
 * LocalStorageCardRepository — Implementación del almacenamiento de tarjetas SRS.
 *
 * Repository Pattern (Módulo 1): Abstracción sobre la fuente de datos.
 */

export class LocalStorageCardRepository {
  constructor(key = 'deeplearn_cards') {
    this._key = key
  }

  async findAll() {
    try {
      const raw = localStorage.getItem(this._key)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  async save(card) {
    const cards = await this.findAll()
    const idx = cards.findIndex((c) => c.id === card.id)
    if (idx >= 0) cards[idx] = card
    else cards.push(card)
    localStorage.setItem(this._key, JSON.stringify(cards))
    return card
  }

  async update(id, partial) {
    const cards = await this.findAll()
    const idx = cards.findIndex((c) => c.id === id)
    if (idx >= 0) {
      cards[idx] = { ...cards[idx], ...partial }
      localStorage.setItem(this._key, JSON.stringify(cards))
      return cards[idx]
    }
    return null
  }

  async delete(id) {
    const cards = (await this.findAll()).filter((c) => c.id !== id)
    localStorage.setItem(this._key, JSON.stringify(cards))
  }
}
