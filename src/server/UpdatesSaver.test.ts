import { beforeAll, beforeEach, expect, test } from 'bun:test'
import cassandra from 'cassandra-driver'
import { UpdatesSaver } from './UpdatesSaver'

let client: cassandra.Client

beforeAll(async () => {
  client = new cassandra.Client({
    contactPoints: [process.env.SCYLLA_ENDPOINT ?? ''],
    localDataCenter: 'datacenter1',
    keyspace: 'test',
  })
  await client.connect()
})

test('Can create UpdatesSaver', () => {
  const manager = new UpdatesSaver(client)
})

test('Can check list is empty', async () => {
  await client.execute('TRUNCATE board_list')

  const manager = new UpdatesSaver(client)
  const r = await manager.getUpdates(Bun.randomUUIDv7())

  expect(r.length).toBe(0)
})

test('Can create new board list is empty', async () => {
  const manager = new UpdatesSaver(client)

  const id = Bun.randomUUIDv7();
  await manager.saveUpdate(id, Buffer.from([1, 2, 3]))
  await manager.saveUpdate(id, Buffer.from([4, 5, 6]))

  const r = await manager.getUpdates(id)
  expect(r.length).toBe(2)

  expect([...r[0].values()]).toEqual([1, 2, 3])
  expect([...r[1].values()]).toEqual([4, 5, 6])
})
