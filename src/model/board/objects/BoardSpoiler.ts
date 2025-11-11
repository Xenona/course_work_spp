import { BoardShape } from './BoardShape'

export class BoardSpoiler extends BoardShape {
  get name() {
    return 'Spoiler' + this.id.slice(0, 8)
  }
}


