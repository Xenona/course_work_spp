export type BaseBoardUpdate<NAME> = { id: string; type: NAME }

export type BoardGroupUpdate = {
  type: 'addMember'
  id: string
  memberId: string
}

export type BoardAddUpdate = {
  type: 'addObject'
  kind: 'drawing' | 'group' | 'animation' | 'image' | 'shape'
  id: string
}

export type BoardDeleteUpdate = {
  type: 'deleteObject'
  id: string
}

export type BoardStrokeUpdate = BaseBoardUpdate<'setStroke'> & {
  color?: string
  size?: number
}

export type BoardMoveUpdate = BaseBoardUpdate<'move'> & {
  deltaX: number
  deltaY: number
}

export type BoardAddPointUpdate = BaseBoardUpdate<'addPoint'> & {
  pointX: number
  pointY: number
}

export type BoardSetImageUpdate = BaseBoardUpdate<'setImage'> & {
  src: string
  width: number
  height: number
}

export type BoardShapeUpdate = BaseBoardUpdate<'setShape'> & {
  shape?: 'rect' | 'circle'
  width?: number
  height?: number
  filled?: boolean
}

export type BoardAnimationUpdate = BaseBoardUpdate<'setAnimation'> & {
  speed?: number
  frameShift?: number
  trajectoryMode?: boolean
}

export type BoardUpdate =
  | BoardGroupUpdate
  | BoardAddUpdate
  | BoardDeleteUpdate
  | BoardStrokeUpdate
  | BoardAddPointUpdate
  | BoardSetImageUpdate
  | BoardMoveUpdate
  | BoardShapeUpdate
  | BoardAnimationUpdate
