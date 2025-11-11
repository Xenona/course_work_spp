import { expect, test } from 'bun:test'
import { BoardObject } from '../BoardObject'
import { Board } from '../Board'

test('Can create object', () => {
  const board = new Board()
  const obj = new BoardObject(board, 'id')

  expect(obj.id).toBe('id')
  expect(obj.name).toBe('Object id')
})

test('Bounding box is 0', () => {
  const board = new Board()
  const obj = new BoardObject(board, 'id')

  const bb = obj.getBoundingRect()
  expect(bb.cx).toBe(0)
  expect(bb.cy).toBe(0)
  expect(bb.w).toBe(0)
  expect(bb.h).toBe(0)
})
