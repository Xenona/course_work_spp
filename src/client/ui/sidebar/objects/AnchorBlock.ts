import type { UiController } from '@/client/controller/UiController'
import { ObjectBlock } from './ObjectBlock'
import { BoardShape } from '@/model/board/objects/BoardShape'
import { createCheckbox } from '../../utils'
import { BoardAnchor } from '@/model/board/objects/BoardAnchor'

export class AnchorBlock extends ObjectBlock {
  constructor(controller: UiController) {
    super(controller, 'Anchor')

    const btnGo = document.createElement('button')
    btnGo.innerText = 'Go to Target'
    btnGo.addEventListener('click', () => {
      const anchor = controller.selection.objects[0] as BoardAnchor
      controller.pos.goto(anchor.target[0], anchor.target[1])
    })

    const btnSet = document.createElement('button')
    btnSet.innerText = 'Set Target'
    btnSet.addEventListener('click', () => {
      this.sendUpdates({
        type: 'setAnchor',
        id: '',
        target: [controller.pos.x, controller.pos.y],
      })
    })

    this._root.append(btnGo, btnSet)
  }

  get targetObject() {
    return BoardAnchor
  }
}
