import User from '@/models/User'

const users = [
  new User({
    id: 1,
    username: 'Johnny',
    password: '1234',
  }),
  new User({
    id: 2,
    username: 'Jane',
    password: 'abcd',
  }),
]

export default users
