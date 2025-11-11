import type { UiController } from '../controller/UiController'

export class SelectionUpdater {
  controller: UiController
  strokeSaved: boolean
  updating: boolean

  constructor(controller: UiController) {
    this.controller = controller
    this.strokeSaved = false
    this.updating = false

    this.controller.selection.addEventListener(
      'change',
      this.onSelectionChange.bind(this)
    )

    this.controller.stroke.addEventListener(
      'change',
      this.onStrokeChange.bind(this)
    )
  }

  private onSelectionChange() {
    this.updating = true

    if (this.strokeSaved) {
      this.controller.stroke.restore()
      this.strokeSaved = false
    }

    if (this.controller.selection.selectedId) {
      const obj = this.controller.board.objects.get(
        this.controller.selection.selectedId
      )
      if (obj?.stroke) {
        this.strokeSaved = true
        this.controller.stroke.save()

        this.controller.stroke.color = obj.stroke.color
        this.controller.stroke.size = obj.stroke.size
      }
    }

    this.updating = false
  }

  private onStrokeChange() {
    if (this.updating) return
    if (this.controller.selection.selectedId) {
      this.controller.updateDispatcher.update(
        this.controller.stroke.generateUpdate(
          this.controller.selection.selectedId
        )
      )
    }
  }
}
