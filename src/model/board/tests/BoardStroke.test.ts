import { expect, test } from 'bun:test'
import { Board } from '../Board'
import { generateRandomId } from '../BoardObject'
import type { BoardUpdate } from '../Update'
import { createBoardAndDrawing } from './BoardDrawing.test'

test('Deafult valid', () => {
  const { drawing } = createBoardAndDrawing()
  expect(drawing.stroke.size).toBePositive()
})

test('Update applies', () => {
  const { board, drawing } = createBoardAndDrawing()
  board.update({
    type: 'setStroke',
    id: drawing.id,
    color: 'red',
    size: 69,
  })

  expect(drawing.stroke.size).toBe(69)
  expect(drawing.stroke.color).toBe('red')
})
