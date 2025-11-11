import type { BoardUpdate } from '@/model/board/Update'

export class UpdateDispatcher extends EventTarget {
  update(update: BoardUpdate) {
    this.dispatchEvent(new CustomEvent('update', { detail: update }))

    if (
      update.type == 'addMember' ||
      update.type == 'addObject' ||
      update.type == 'deleteObject'
    ) {
      this.dispatchEvent(new CustomEvent('treeUpdate', { detail: update }))
    }
  }
}
