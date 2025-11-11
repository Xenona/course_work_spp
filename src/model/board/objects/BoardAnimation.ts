import { BoardGroup } from '../BoardGroup'
import type { BoardAnimationUpdate, BoardUpdate } from '../Update'

export class BoardAnimation extends BoardGroup {
  speed = 1
  frameShift = 0
  trajectoryMode = false

  get name() {
    return 'Animation ' + this.id.slice(0, 8)
  }

  update(update: BoardUpdate): boolean {
    if (update.type == 'setAnimation') return this.handleSetAnimation(update)

    return super.update(update)
  }

  private handleSetAnimation(update: BoardAnimationUpdate) {
    if (update.speed !== undefined) this.speed = update.speed
    if (update.frameShift !== undefined) this.frameShift += update.frameShift
    if (update.trajectoryMode !== undefined) this.trajectoryMode = update.trajectoryMode

    return true
  }
}
