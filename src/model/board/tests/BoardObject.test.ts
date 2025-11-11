import { expect, test } from 'bun:test'
import { BoardObject } from '../BoardObject'

test('Can create object', () => {
  const obj = new BoardObject('id')

  expect(obj.id).toBe('id')
  expect(obj.name).toBe('Object id')
})

test('Bounding box is 0', () => {
  const obj = new BoardObject('id')

  const bb = obj.getBoundingRect()
  expect(bb.cx).toBe(0)
  expect(bb.cy).toBe(0)
  expect(bb.w).toBe(0)
  expect(bb.h).toBe(0)
})