import { generateRandomId } from '@/model/board/BoardObject'
import type { UiController } from '../controller/UiController'
import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseTool } from './UiBaseTool'

export class UiImageTool extends UiBaseTool {
  input: HTMLInputElement
  cordsX: number = 0
  cordsY: number = 0

  constructor(controller: UiController) {
    super(controller)

    this.input = document.createElement('input')
    this.input.type = 'file'
    this.input.accept = 'image/png, image/jpeg'
    this.input.addEventListener('change', async (e) => {
      if (!this.input.files?.[0]) return

      const res = await fetch('/assets/upload', {
        body: this.input.files[0],
        method: 'POST',
      })
      const { fileName } = await res.json()

      const img = new Image()
      img.addEventListener('load', () => {
        // console.log('Loaded')
        this.emitImage(fileName, img)
      })
      img.src = `/assets/get/${fileName}`
      console.log(fileName)
    })
  }

  mouseDown(e: BoardMouseEvent) {
    if (!e.isLeftDown) return
    this.cordsX = e.boardX
    this.cordsY = e.boardY
    this.input.click()
    // const id = generateRandomId()
    // this.controller.updateDispatcher.update({
    //   type: 'addObject',
    //   kind: 'image',
    //   id,
    // })
    // this.controller.updateDispatcher.update(
    //   this.controller.stroke.generateUpdate(id)
    // )

    // this.controller.updateDispatcher.update({
    //   type: 'addPoint',
    //   id,
    //   pointX: e.boardX,
    //   pointY: e.boardY,
    // })

    // this.currentDrawing = id
  }

  emitImage(fileName: string, image: HTMLImageElement) {
    const id = generateRandomId()
    this.controller.updateDispatcher.update({
      type: 'addObject',
      kind: 'image',
      id,
    })

    this.controller.updateDispatcher.update({
      id,
      type: 'setImage',
      src: fileName,
      width: image.naturalWidth / 3,
      height: image.naturalHeight / 3,
    })

    this.controller.updateDispatcher.update({
      type: 'move',
      id,
      deltaX: this.cordsX,
      deltaY: this.cordsY,
    })

    this.controller.selection.addSelected(id)
    this.controller.tool.enableSelected()
  }

  activate(): void {
    this.controller.selection.deselect()
    super.activate()
  }

  get name(): string {
    return 'image'
  }
}
