import casandra from 'cassandra-driver'
import type { BoardInMenu } from '../Api'

export class BoardManager {
  client: casandra.Client

  constructor(client: casandra.Client) {
    this.client = client
  }

  async getBoards(inclPrivate:boolean=true): Promise<BoardInMenu[]> {
    const b = await this.client.execute('SELECT * FROM board_list')

    let res = []
    for (const e of b.rows) {
      const s = (await this.client.execute('SELECT * FROM settings WHERE settings_id=?', [e.setting])).rows[0]
      res.push({
        uuid: e.boardid.toString(),
        name: e.name,
        private: s.private,
        setting: s.settings_id
      })
    }
    console.log("COOCOCOCO", inclPrivate)
    return res.filter((e) =>{
      console.log(e.private, inclPrivate)
      return !e.private || inclPrivate

    } )
  }

  async createBoard(name: string): Promise<BoardInMenu> {
    const uuid_board = Bun.randomUUIDv7()
    const uuid_settings  = Bun.randomUUIDv7()

    await this.client.execute(
      'INSERT INTO settings(settings_id, theme, private, description)'
      + 'VALUES (?, ?, ?, ?)',
      [uuid_settings, false, false, "My first drawing =)"]
    )

    await this.client.execute(
      'INSERT INTO board_list(boardid, name, setting) VALUES (?, ?, ?)',
      [uuid_board, name, uuid_settings]
    )

    return {
      uuid: uuid_board,
      name,
    }
  }
}
