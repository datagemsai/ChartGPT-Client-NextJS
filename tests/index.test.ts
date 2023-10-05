import { kv } from '@/lib/kv'
import { Chat } from "@/lib/types"


// This is necessary as `fetch` is a browser API, and Jest runs in Node
// Specifically, 'upstash' for 'vercel/kv' uses `fetch` to make requests
const nodeFetch = require('node-fetch') as typeof fetch
globalThis.fetch = nodeFetch


test('kv store should be able to save and fetch values', async () => {
  await kv.set('foo', 'bar') 
  const value = await kv.get('foo')
  expect(value).toBe('bar')
})

describe('testing kv store', () => {
  test('kv store should be able to save and fetch values', async () => {
    await kv.set('foo', 'bar') 
    const value = await kv.get('foo')
    expect(value).toBe('bar')
  })
  test('test Google Auth sub bug', async () => {
    // Without adding `uid-` prefix, the following test will fail,
    // as `hgetall` will return the uid as a number, and this will not match the string
    // See https://github.com/vercel-labs/ai-chatbot/pull/131
    const payload = {
      id: 'abc123',
      title: 'foo',
      userId: 'uid-123',
      createdAt: Date.now(),
      path: '/chat/abc123',
      dataSourceURL: 'https://foo.bar',
      messages: [
        {
          id: 'abc123',
          content: 'foo',
          role: 'assistant',
        }
      ],
    }
    // There is an issue with mocking next-auth using Jest,
    // so the code for these methods is copied here for the purpose of testing and fixing this bug
    // await saveChat(payload.id, payload.userId, payload)
    await kv.hmset(`chat:${payload.id}`, payload)
    await kv.zadd(`user:chat:uid-${payload.userId}`, {
      score: payload.createdAt,
      member: `chat:${payload.id}`
    })
    // const value = await getChat(payload.id, payload.userId)
    const value = await kv.hgetall<Chat>(`chat:${payload.id}`)
    expect(value).toEqual(payload)
  })
})
