import type { UiController } from '@/client/controller/UiController'
import { ObjectBlock } from './ObjectBlock'
import { BoardShape } from '@/model/board/objects/BoardShape'
import { createCheckbox, createIconButton } from '../../utils'
import { BoardAnimation } from '@/model/board/objects/BoardAnimation'

export class AnimationBlock extends ObjectBlock {
  speedInput: HTMLInputElement
  pauseBtn: HTMLButtonElement
  playBtn: HTMLButtonElement

  savedSpeeds: Map<string, number> = new Map()

  constructor(controller: UiController) {
    super(controller, 'Animation')

    const speedRoot = document.createElement('div')
    speedRoot.classList.add('anim-speed-row')
    const speedLabel = document.createElement('label')
    speedLabel.innerText = 'Speed:'
    speedRoot.append(speedLabel)
    this.speedInput = document.createElement('input')
    this.speedInput.type = 'number'
    this.speedInput.min = '0'
    this.speedInput.max = '1000'
    this.speedInput.step = '25'
    this.speedInput.value = '100'

    this.speedInput.addEventListener('change', () => {
      this.sendUpdates({
        type: 'setAnimation',
        id: '',
        speed: parseInt(this.speedInput.value) / 100,
      })

      this.updateSpeed(parseInt(this.speedInput.value) / 100)
    })
    speedRoot.append(this.speedInput)

    this.pauseBtn = createIconButton('pause')
    this.pauseBtn.addEventListener('click', () => {
      for (const obj of this.controller.selection.objects) {
        if (obj instanceof BoardAnimation) {
          this.savedSpeeds.set(obj.id, obj.speed)
        }
      }

      this.sendUpdates({
        type: 'setAnimation',
        id: '',
        speed: 0,
      })
      this.updateSpeed(0)
    })

    this.playBtn = createIconButton('play_arrow')
    this.playBtn.addEventListener('click', () => {
      let firstSpeed = -1
      for (const id of this.controller.selection.selectedId) {
        this.controller.updateDispatcher.update({
          type: 'setAnimation',
          id,
          speed: this.savedSpeeds.get(id) ?? 1,
        })

        if (firstSpeed < 0) firstSpeed = this.savedSpeeds.get(id) ?? 1
      }
      this.updateSpeed(firstSpeed < 0 ? 1 : firstSpeed)
    })

    speedRoot.append(this.pauseBtn)
    speedRoot.append(this.playBtn)

    const nextBtn = createIconButton('skip_next')
    nextBtn.addEventListener('click', () => {
      this.sendUpdates({
        type: 'setAnimation',
        id: '',
        frameShift: 1,
      })
    })

    const prevBtn = createIconButton('skip_previous')
    prevBtn.addEventListener('click', () => {
      this.sendUpdates({
        type: 'setAnimation',
        id: '',
        frameShift: -1,
      })
    })

    speedRoot.append(prevBtn)
    speedRoot.append(nextBtn)

    this._root.append(speedRoot)
  }

  get targetObject() {
    return BoardAnimation
  }

  updateObjects(objects: BoardShape[]) {
    super.updateObjects(objects)

    const fObj = objects[0]
    if (!fObj || !(fObj instanceof BoardAnimation)) return

    this.updateSpeed(fObj.speed)
  }

  private updateSpeed(speed: number) {
    this.speedInput.value = (speed * 100).toFixed(0)
    if (speed < 0.001) {
      this.playBtn.style.display = 'block'
      this.pauseBtn.style.display = 'none'
    } else {
      this.playBtn.style.display = 'none'
      this.pauseBtn.style.display = 'block'
    }
  }
}
