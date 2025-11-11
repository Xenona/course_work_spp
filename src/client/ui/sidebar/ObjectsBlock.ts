import type { UiController } from '@/client/controller/UiController'
import { SidebarBlock } from './SidebarBlock'
import { BoardGroup } from '@/model/board/BoardGroup'
import './ObjectBlock.css'
import { generateRandomId } from '@/model/board/BoardObject'
import { createIconButton } from '../utils'

class ObjectElement {
  targetId: string
  controller: UiController
  root: HTMLDivElement
  checkbox: HTMLInputElement
  title: HTMLHeadingElement

  constructor(controller: UiController, targetId: string) {
    this.targetId = targetId
    this.controller = controller
    this.root = document.createElement('div')

    this.checkbox = document.createElement('input')
    this.checkbox.type = 'checkbox'
    this.checkbox.addEventListener('change', () => {
      if (this.checkbox.checked) {
        this.controller.selection.addSelected(this.targetId)
      } else {
        this.controller.selection.removeSelected(this.targetId)
      }
    })
    this.root.append(this.checkbox)

    this.title = document.createElement('h1')
    this.title.textContent = '???'
    this.root.append(this.title)

    this.root.classList.add('objectListElement')
  }

  setSelected(selected: boolean) {
    this.checkbox.checked = selected
  }

  setDepth(level = 0) {
    this.root.style.paddingLeft = `${level * 20}px`
  }

  setName(name: string) {
    this.title.textContent = name
  }
}

export class ObjectsBlock extends SidebarBlock {
  objectEls: Map<string, ObjectElement> = new Map()
  objectList: HTMLDivElement

  constructor(controller: UiController) {
    super(controller, 'Objects')

    const buttonCnt = document.createElement('div')
    buttonCnt.classList.add('buttonCnt')
    this._root.append(buttonCnt)

    const groupBtn = createIconButton('border_outer')
    groupBtn.addEventListener('click', () => {
      this.groupObjects('group')
    })
    buttonCnt.append(groupBtn)

    const animBtn = createIconButton('animation')
    animBtn.addEventListener('click', () => {
      this.groupObjects('animation')
    })
    buttonCnt.append(animBtn)

    const deleteBtn = createIconButton('delete')
    deleteBtn.addEventListener('click', () => {
      for (const sel of this.controller.selection.selectedId) {
        this.controller.updateDispatcher.update({
          type: 'deleteObject',
          id: sel,
        })
      }
      this.controller.selection.deselect()
    })
    buttonCnt.append(deleteBtn)

    this.objectList = document.createElement('div')
    this.objectList.classList.add('objectList')
    this._root.append(this.objectList)

    controller.updateDispatcher.addEventListener('treeUpdate', () => {
      this.refreshElements()
    })

    controller.selection.addEventListener('change', () => {
      for (const el of this.objectEls.values()) {
        el.setSelected(
          this.controller.selection.selectedId.includes(el.targetId)
        )
      }
    })
  }

  refreshElements() {
    while (this.objectList.lastChild)
      this.objectList.removeChild(this.objectList.lastChild)

    const recurse = (e: BoardGroup, level = 0) => {
      for (const childId of e.objects) {
        const child = this.controller.board.objects.get(childId)
        if (!child) continue

        if (!this.objectEls.has(child.id)) {
          this.objectEls.set(
            child.id,
            new ObjectElement(this.controller, child.id)
          )
        }

        const el = this.objectEls.get(child.id)!
        el.setDepth(level)
        el.setName(child.name)
        this.objectList.append(el.root)

        if (child instanceof BoardGroup) {
          recurse(child, level + 1)
        }
      }
    }
    recurse(this.controller.board.rootGroup)
  }

  groupObjects(kind: 'animation' | 'group') {
    if (this.controller.selection.selectedId.length == 0) return

    if (this.controller.selection.selectedId.length == 1) {
      const obj = this.controller.board.objects.get(
        this.controller.selection.selectedId[0]
      )
      if (obj instanceof BoardGroup) {
        for (const childId of obj.objects) {
          this.controller.updateDispatcher.update({
            type: 'addMember',
            id: obj.parent ?? 'root',
            memberId: childId,
          })
        }
        this.controller.updateDispatcher.update({
          type: 'deleteObject',
          id: obj.id,
        })
        return
      }
    }

    const id = generateRandomId()

    this.controller.updateDispatcher.update({
      type: 'addObject',
      kind,
      id,
    })
    for (const sel of this.controller.selection.selectedId) {
      this.controller.updateDispatcher.update({
        type: 'addMember',
        id,
        memberId: sel,
      })
    }

    this.controller.selection.deselect()
  }
}
