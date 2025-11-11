export type BaseBoardUpdate<NAME> = { id: string; type: NAME }

export type BoardGroupUpdate = {
  type: 'addMember'
  id: string
  memberId: string
}

export type BoardAddUpdate = {
  type: 'addObject'
  kind: 'drawing' | 'group' | 'animation'
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

export type BoardAddPointUpdate = BaseBoardUpdate<'addPoint'> & {
  pointX: number
  pointY: number
}

export type BoardUpdate =
  | BoardGroupUpdate
  | BoardAddUpdate
  | BoardDeleteUpdate
  | BoardStrokeUpdate
  | BoardAddPointUpdate
