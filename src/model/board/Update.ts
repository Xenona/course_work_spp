export type BaseBoardUpdate<NAME> = { id: string; type: NAME }

export type BoardAddUpdate = {
  type: 'addObject'
  kind: 'drawing'
  id: string
}

export type BoardStrokeUpdate = BaseBoardUpdate<'setStroke'> & {
  color?: string
  size?: number
}

export type BoardAddPointUpdate = BaseBoardUpdate<'addPoint'> & {
  point: [number, number]
}

export type BoardUpdate =
  | BoardAddUpdate
  | BoardStrokeUpdate
  | BoardAddPointUpdate
