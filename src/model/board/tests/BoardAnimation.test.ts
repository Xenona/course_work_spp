import { expect, test } from 'bun:test'
import { BoardGroup } from '../BoardGroup'
import { generateRandomId } from '../BoardObject'
import { createBoardAndGroup } from './Board.test'
import { Board } from '../Board'

test('Can create animation', () => {
  const board = new Board()
  const id = generateRandomId()

  board.update({
    type: 'addObject',
    kind: 'animation',
    id,
  })

  const group = board.objects.get(id)
  expect(group).toBeTruthy()
  expect(group).toBeInstanceOf(BoardGroup)

  expect(group?.name).toStartWith('Animation ')
})

test('Can add member', () => {
  const { board, groupId } = createBoardAndGroup()

  const id = generateRandomId()

  board.update({
    type: 'addObject',
    id,
    kind: 'group',
  })

  board.update({
    type: 'addMember',
    id: groupId,
    memberId: id,
  })

  expect(board.objects.get(id)?.parent).toBe(groupId)
  expect((board.objects.get(groupId) as BoardGroup).objects).toContain(id)
})
