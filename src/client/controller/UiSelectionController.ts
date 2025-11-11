export class UiSelectionController extends EventTarget {
  selectedId: string[] = []

  constructor() {
    super()
  }

  select(id: string) {
    this.selectedId = [id]
    this.dispatchEvent(new Event('change'))
  }

  deselect() {
    this.selectedId = []
    this.dispatchEvent(new Event('change'))
  }

  addSelected(id: string) {
    if (this.selectedId.includes(id)) return
    this.selectedId.push(id)
    this.dispatchEvent(new Event('change'))
  }

  removeSelected(id: string) {
    if (!this.selectedId.includes(id)) return
    this.selectedId = this.selectedId.filter((e) => e != id)
    this.dispatchEvent(new Event('change'))
  }
}
