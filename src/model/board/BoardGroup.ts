import { BoardDrawing } from './BoardDrawing'
import { BoardObject } from './BoardObject'

export type BoardGroupUpdate = {
  type: 'addMember'
  id: string
  kind: 'drawing'
}

export class BoardGroup extends BoardObject {
  objects: string[] = []

  constructor(id: string) {
    super(id)
  }
}
