import type { UiController } from '@/client/controller/UiController'
import { ObjectBlock } from './ObjectBlock'
import { BoardText } from '@/model/board/objects/BoardText'
import type { BoardObject } from '@/model/board/BoardObject'

export class TextBlock extends ObjectBlock {
  area: HTMLTextAreaElement

  constructor(controller: UiController) {
    super(controller, 'Text')

    this.area = document.createElement('textarea')
    this.area.addEventListener('input', () => {
      this.sendUpdates({
        type: 'setText',
        id: '',
        text: this.area.value,
      })
    })

    this._root.append(this.area)
  }

  get targetObject() {
    return BoardText
  }

  updateObjects(objects: BoardObject[]): void {
    super.updateObjects(objects)

    const fObj = objects[0]
    if (!fObj || !(fObj instanceof BoardText)) return

    this.area.value = fObj.contents
  }
}
