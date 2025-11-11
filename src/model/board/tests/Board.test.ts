import { expect, test } from 'bun:test'
import { Board } from '../Board'
import { generateRandomId } from '../BoardObject'
import type { BoardUpdate } from '../Update'

test('Can create board', () => {
  const board = new Board()
  expect(board).toBeTruthy()
})

export function createBoardAndGroup(): { board: Board; groupId: string } {
  const board = new Board()
  const id = generateRandomId()

  board.update({
    type: 'addObject',
    kind: 'group',
    id: id,
  })

  return {
    board,
    groupId: id,
  }
}

test('Can add object', () => {
  const { board, groupId } = createBoardAndGroup()
  expect(board).toBeTruthy()
  expect(board.objects.has(groupId)).toBeTruthy()
})

test('Can remove object', () => {
  const { board, groupId } = createBoardAndGroup()
  board.update({
    type: 'deleteObject',
    id: groupId,
  })

  expect(board.objects.has(groupId)).toBeFalsy()
})

test('Invalid update is ignored', () => {
  const { board, groupId } = createBoardAndGroup()

  expect(
    board.update({ type: 'invalid', id: groupId } as any as BoardUpdate)
  ).toBeFalsy()
})
