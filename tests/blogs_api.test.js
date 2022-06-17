const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)

  await api
    .post('/api/users')
    .send({ username: 'jimbo', password: 'passu123', name: 'jim johnson' })

  const response = await api
    .post('/api/login')
    .send({ username: 'jimbo', password: 'passu123' })
  token = response.body.token
})

test('correct number of blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog identification is named correctly', async () => {
  const response = await api.get('/api/blogs')

  const id = response.body.map(r => r.id)
  expect(id).toBeDefined()
})

test('valid blog cant be added without a token', async () => {
  const newBlog = helper.newBlog
  await api.post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('valid blog can be added with token', async () => {
  const newBlog = helper.newBlog
  await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

test('if likes is not set then set it to 0', async () => {
  const newBlog = helper.newBlog
  delete newBlog.likes

  await api.post('/api/blogs').send(newBlog)
  const response = await api.get('/api/blogs')
  response.body.forEach(r => expect(r.likes).toBeDefined())
})

test('blog without title or url will response with 400', async () => {
  const newBlog = helper.newBlog
  delete newBlog.title

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog cannot be deleted without valid token', async () => {
  const newBlog = helper.newBlog2
  await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(200)

  const blogs = await helper.blogsInDb()
  await api
    .delete(`/api/blogs/${blogs[2].id}`)
    .expect(401)

})

test('blog can be deleted with token', async () => {
  const newBlog = helper.newBlog2
  await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(200)

  const blogs = await helper.blogsInDb()
  await api
    .delete(`/api/blogs/${blogs[2].id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

describe('when username or password are inputted incorrectly', () => {

  test('user without username cant be created', async () => {
    const newUser = helper.newUser
    delete newUser.username

    await api.post('/api/users').send(newUser).expect(400)
  })

  test('user with too short password cant be created', async () => {
    const newUser = helper.newUser
    const error = '{"error":"password too short"}'
    newUser.password = 'pa'

    const response = await api.post('/api/users').send(newUser).expect(400)

    expect(response.text).toEqual(error)
  })

  test('username must be unique', async () => {
    const newUser = helper.initialUsers[0]

    await api.post('/api/users').send(newUser).expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
