import type { UiController } from '@/client/controller/UiController'
import { SidebarBlock } from '../SidebarBlock'
import { BoardObject } from '@/model/board/BoardObject'
import type { BoardUpdate } from '@/model/board/Update'
import './ObjectBlock.css'

export class ObjectBlock extends SidebarBlock {
  constructor(controller: UiController, objName: string) {
    super(controller, objName)
  }

  get targetObject() {
    return BoardObject
  }

  updateObjects(objects: BoardObject[]) {}

  sendUpdates(upd: BoardUpdate) {
    for (const obj of this.controller.selection.objects) {
      this.controller.updateDispatcher.update({ ...upd, id: obj.id })
    }
  }
}
