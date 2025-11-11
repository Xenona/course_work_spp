import { expect, test } from 'bun:test'
import { BoardGroup } from '../BoardGroup'
import { generateRandomId } from '../BoardObject'
import { createBoardAndGroup } from './Board.test'
import { Board } from '../Board'
import { BoardDrawing } from '../BoardDrawing'

export function createBoardAndDrawing(): { board: Board; drawing: BoardDrawing } {
  const board = new Board()
  const id = generateRandomId()

  board.update({
    type: 'addObject',
    kind: 'drawing',
    id,
  })

  const drawing = board.objects.get(id) as BoardDrawing
  expect(drawing).toBeTruthy()
  expect(drawing).toBeInstanceOf(BoardDrawing)

  return { board, drawing }
}

function addPoints(drawing: BoardDrawing) {
  for (const point of [
    [-1, -1],
    [3, 3],
    [0, 5],
  ])
    drawing.update({
      type: 'addPoint',
      id: drawing.id,
      point: [point[0], point[1]],
    })
}

test('Can create drawing', () => {
  const { drawing } = createBoardAndDrawing()
  expect(drawing.name).toStartWith('Drawing ')
})

test('Can add member', () => {
  const { drawing } = createBoardAndDrawing()
  addPoints(drawing)

  expect(drawing.points).toBeArray()
  expect(drawing.points).toContainValue([-1, -1])
})

test('Return correct bounding point', () => {
  const { drawing } = createBoardAndDrawing()
  addPoints(drawing)

  const box = drawing.getBoundingRect()

  expect(box.cx).toBe(1)
  expect(box.cy).toBe(2)
  expect(box.w).toBe(4 + drawing.stroke.size)
  expect(box.h).toBe(6 + drawing.stroke.size)
})
