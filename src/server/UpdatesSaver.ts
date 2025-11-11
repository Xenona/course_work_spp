import cassandra from 'cassandra-driver'

export class UpdatesSaver {
  client: cassandra.Client

  constructor(client: cassandra.Client) {
    this.client = client
  }

  async saveUpdate(boardId: string, upd: Buffer) {
    await this.client.execute(
      'INSERT INTO board_updates (board, timeid, update_data) VALUES (?, ?, ?)',
      [boardId, Bun.randomUUIDv7(), upd],
      { prepare: true }
    )
  }

  async getUpdates(boardId: string): Promise<Buffer[]> {
    let res = await this.client.execute(
      'SELECT * FROM board_updates WHERE board = ?',
      [boardId],
      { prepare: true, fetchSize: 20*10**7 }
    )

    return res.rows
      .sort((a, b) => (a.timeid < b.timeid ? -1 : 1))
      .map((e) => e.update_data)
  }
}
