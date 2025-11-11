export class UiSelectionController extends EventTarget {
  selectedId: string | null = null

  constructor() {
    super()
  }

  select(id: string) {
    this.selectedId = id
    this.dispatchEvent(new Event('change'))
  }

  deselect() {
    this.selectedId = null
    this.dispatchEvent(new Event('change'))
  }
}
