import { UpdateDispatcher } from '@/dispatcher/Dispatcher'
import { Board } from '../model/board/Board'
import { generateRandomId } from '../model/board/BoardObject'
import type { BoardUpdate } from '../model/board/Update'
import { Renderer } from '../renderer/Renderer'
import { UiController } from './controller/UiController'
import { UiBrushTool } from './tool/UiBrushTool'
import { UiMoveTool } from './tool/UiMoveTool'
import { RootUI } from './ui/RootUI'
import 'material-icons/iconfont/material-icons.css'
import { BoardDispatcher } from '@/dispatcher/BoardDispatcher'
import { WebsocketDispatcher } from '@/dispatcher/WebsocketDispatcher'
import { UiSelectionTool } from './tool/UiSelectionTool'
import { SelectionUpdater } from './features/SelectionUpdater'

const board = new Board()

const dispatcher = new UpdateDispatcher()
new BoardDispatcher(board, dispatcher)
new WebsocketDispatcher('/ws', dispatcher)

const uiController = new UiController(board, dispatcher)
uiController.tool.addTool(new UiSelectionTool(uiController))
uiController.tool.addMoveTool(new UiMoveTool(uiController))
uiController.tool.addTool(new UiBrushTool(uiController))
uiController.tool.selectTool(uiController.tool.tools[0])

new SelectionUpdater(uiController)

const root = new RootUI(uiController)
root.attach(document.body)

const renderer = root.addRenderer((canvas) => {
  return new Renderer(canvas, board)
})
renderer.start()

uiController.pos.addEventListener('change', () => {
  renderer.setPosition([uiController.pos.x, uiController.pos.y])
})
