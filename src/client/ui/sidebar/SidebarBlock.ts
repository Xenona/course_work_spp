import type { UiController } from '../../controller/UiController'

export class SidebarBlock {
  protected _root: HTMLDivElement
  protected controller: UiController

  constructor(controller: UiController, title: string) {
    this.controller = controller
    this._root = document.createElement('div')
    this._root.classList.add('sideBarBlock')

    const titleEl = document.createElement('h1')
    titleEl.textContent = title
    this._root.append(titleEl)
  }

  get root() {
    return this._root
  }
}
