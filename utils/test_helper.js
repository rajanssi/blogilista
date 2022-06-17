const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Janes Blog',
    author: 'Jane',
    url: 'www.google.fi',
    likes: 12
  },
  {
    title: 'Jons Blog',
    author: 'Jon',
    url: 'www.wikipedia.fi',
    likes: 5
  },
]

const initialUsers = [
  {
    username: 'jim44',
    password: 'passu123',
    name: 'James Jackson'
  },
  {
    username: 'mary55',
    password: 'passu321',
    name: 'Mary James'
  },
]


const newBlog = {
  title: 'Blog of Destiny',
  author: 'Steven',
  url: 'www.helsinki.fi',
  likes: 2
}

const newBlog2 = {
  title: 'Jimbos blog',
  author: 'Jimmy',
  url: 'www.blog.fi',
  likes: 22
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const newUser = {
  username: 'wayne123',
  name: 'Wayne Jackson',
  password: 'passu123'
}

module.exports = {
  initialBlogs, newBlog, newBlog2, blogsInDb, newUser, initialUsers, 
}