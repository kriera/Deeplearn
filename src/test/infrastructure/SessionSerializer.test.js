import { describe, expect, it } from 'vitest'
import { SessionSerializer } from '../../infrastructure/storage/serializers/SessionSerializer.js'

describe('SessionSerializer', () => {
  const serializer = new SessionSerializer()

  it('serializes a session to JSON string', () => {
    const session = { id: 's1', concept: 'Test', levels: [] }
    const json = serializer.serialize(session)
    expect(typeof json).toBe('string')
    expect(json).toContain('"id":"s1"')
  })

  it('deserializes a JSON string to object', () => {
    const json = '{"id":"s1","concept":"Test"}'
    const session = serializer.deserialize(json)
    expect(session.id).toBe('s1')
    expect(session.concept).toBe('Test')
  })

  it('returns null for invalid JSON', () => {
    const result = serializer.deserialize('not-json')
    expect(result).toBeNull()
  })

  it('returns null for empty input', () => {
    expect(serializer.deserialize('')).toBeNull()
    expect(serializer.deserialize(null)).toBeNull()
  })
})
