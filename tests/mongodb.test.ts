import clientPromise from '@/lib/mongodb'
import { User, UserRole } from '@/lib/types'

test('insert user into MongoDB collection', async () => {
  const client = await clientPromise
  const db = client.db('client')

  const userData: User = {
    id: '123',
    email: 'foo@bar.com',
    name: 'foo',
    role: UserRole.user,
    image: '',
    conversations: [],
  }

  const newUser: any = {
    _id: userData.id,
    ...userData,
  }

  const result = await db.collection('users').insertOne(newUser)
  const insertedId = result.insertedId

  expect(insertedId).toEqual(newUser._id)
})
