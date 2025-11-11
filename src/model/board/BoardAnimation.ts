import { BoardGroup } from './BoardGroup'

export class BoardAnimation extends BoardGroup {
  get name() {
    return 'Animation ' + this.id.slice(0, 8)
  }
}
