import { UpdateDispatcher } from '@/dispatcher/Dispatcher'
import { Board } from '../model/board/Board'
import { generateRandomId } from '../model/board/BoardObject'
import type { BoardUpdate } from '../model/board/Update'
import { Renderer } from '../renderer/Renderer'
import { UiController } from './controller/UiController'
import { UiBrushTool } from './tool/UiBrushTool'
import { UiPanTool as UiPanTool } from './tool/UiPanTool'
import { RootUI } from './ui/RootUI'
import 'material-icons/iconfont/material-icons.css'
import { BoardDispatcher } from '@/dispatcher/BoardDispatcher'
import { WebsocketDispatcher } from '@/dispatcher/WebsocketDispatcher'
import { UiSelectionTool } from './tool/UiSelectionTool'
import { SelectionUpdater } from './features/SelectionUpdater'
import { UiImageTool } from './tool/UiImageTool'
import { UiMoveTool } from './tool/UiMoveTool'
import { UiShapeTool } from './tool/UiShapeTool'
import { AnimationRenderer } from '../renderer/AnimationRenderer'
import { DrawingRenderer } from '../renderer/DrawingRenderer'
import { GroupRenderer } from '../renderer/GroupRenderer'
import { ShapeRenderer } from '../renderer/ShapeRenderer'
import { ImageRenderer } from '../renderer/ImageRenderer'
import { BoardImage } from '@/model/board/objects/BoardImage'
import { BoardShape } from '@/model/board/objects/BoardShape'
import { BoardGroup } from '@/model/board/BoardGroup'
import { BoardDrawing } from '@/model/board/objects/BoardDrawing'
import { BoardAnimation } from '@/model/board/objects/BoardAnimation'
import { UiSpoilerTool } from './tool/UiSpoilerTool'
import { BoardSpoiler } from '@/model/board/objects/BoardSpoiler'
import { SpoilerRenderer } from '@/renderer/SpoilerRenderer'
import { UiAnchorTool } from './tool/UiAnchorTool'
import { AnchorRenderer } from '@/renderer/AnchorRenderer'
import { BoardAnchor } from '@/model/board/objects/BoardAnchor'
import { UiTextTool } from './tool/UiTextTool'
import { BoardText } from '@/model/board/objects/BoardText'
import { TextRenderer } from '@/renderer/TextRenderer'

const board = new Board()

const dispatcher = new UpdateDispatcher()
new BoardDispatcher(board, dispatcher)
new WebsocketDispatcher(location.href + '/ws', dispatcher)

const uiController = new UiController(board, dispatcher)
uiController.tool.addTool(new UiSelectionTool(uiController), {
  defaultNotSelected: true,
})
uiController.tool.addPanTool(new UiPanTool(uiController))
uiController.tool.addTool(new UiMoveTool(uiController), {
  defaultSelected: true,
})
uiController.tool.addTool(new UiBrushTool(uiController))
uiController.tool.addTool(new UiImageTool(uiController))
uiController.tool.addTool(new UiShapeTool(uiController))
uiController.tool.addTool(new UiSpoilerTool(uiController))
uiController.tool.addTool(new UiAnchorTool(uiController))
uiController.tool.addTool(new UiTextTool(uiController))
uiController.tool.selectTool(uiController.tool.tools[0])

new SelectionUpdater(uiController)

const root = new RootUI(uiController)
root.attach(document.body)

const renderer = root.addRenderer((canvas) => {
  const renderer = new Renderer(canvas, board)
  renderer.registerRenderer(BoardAnimation, AnimationRenderer)
  renderer.registerRenderer(BoardDrawing, DrawingRenderer)
  renderer.registerRenderer(BoardGroup, GroupRenderer)
  renderer.registerRenderer(BoardShape, ShapeRenderer)
  renderer.registerRenderer(BoardImage, ImageRenderer)
  renderer.registerRenderer(BoardSpoiler, SpoilerRenderer)
  renderer.registerRenderer(BoardAnchor, AnchorRenderer)
  renderer.registerRenderer(BoardText, TextRenderer)
  return renderer
})
renderer.start()

uiController.pos.addEventListener('change', () => {
  renderer.setPosition([uiController.pos.x, uiController.pos.y])
})
