import { beforeAll, beforeEach, expect, test } from 'bun:test'
import cassandra from 'cassandra-driver'
import { BoardManager } from './BoardManager'

let client: cassandra.Client

beforeAll(async () => {
  client = new cassandra.Client({
    contactPoints: [process.env.SCYLLA_ENDPOINT ?? ''],
    localDataCenter: 'datacenter1',
    keyspace: 'test',
  })
  await client.connect()
})

test('Can create BoardManager', () => {
  const manager = new BoardManager(client)
})

test('Can check list is empty', async () => {
  await client.execute('TRUNCATE board_list')

  const manager = new BoardManager(client)
  const r = await manager.getBoards()

  expect(r.length).toBe(0)
})

test('Can create new board list is empty', async () => {
  const manager = new BoardManager(client)

  const b = await manager.createBoard('test name 123')

  const r = await manager.getBoards()
  expect(r.find((e) => e.uuid == b.uuid)).toEqual(b)
})
