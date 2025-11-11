import type { BoardAddUpdate } from '@/model/board/Update'
import { UiShapeTool } from './UiShapeTool'

export class UiSpoilerTool extends UiShapeTool {
  createObject(id: string) {
    this.controller.updateDispatcher.update({
      type: 'addObject',
      kind: 'spoiler',
      id,
    })
    localStorage.setItem('spoiler', localStorage.getItem('spoiler') + id)
  }

  get name(): string {
    return 'spoiler'
  }

}
