import type { UiController } from '@/client/controller/UiController'
import { ObjectBlock } from './ObjectBlock'
import { BoardShape } from '@/model/board/objects/BoardShape'
import { createCheckbox } from '../../utils'

export class ShapeBlock extends ObjectBlock {
  filledCheckbox: HTMLInputElement

  constructor(controller: UiController) {
    super(controller, 'Shape')

    const [filledCheckbox, filledLabel] = createCheckbox('Filled')
    this.filledCheckbox = filledCheckbox
    this.filledCheckbox.addEventListener('input', () => {
      this.sendUpdates({
        type: 'setShape',
        id: '',
        filled: this.filledCheckbox.checked,
      })
    })

    this._root.append(filledCheckbox, filledLabel)
  }

  get targetObject() {
    return BoardShape
  }

  updateObjects(objects: BoardShape[]) {
    super.updateObjects(objects)

    const fObj = objects[0]
    console.log(fObj)
    if (!fObj || !(fObj instanceof BoardShape)) return

    this.filledCheckbox.checked = fObj.filled
  }
}
