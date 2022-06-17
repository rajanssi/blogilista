const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, obj) => acc + obj.likes, 0)
}

const favoriteBlog = (blogs) => {
  const blog = blogs.filter(blog => blog.likes === Math.max(...blogs.map(blog => blog.likes)))
  return blog[0]
} 

const mostBlogs = (blogs) => {
  blogs = _.countBy(blogs, 'author')
  const mostBlogs = {
    author: Object.keys(blogs).reduce((a, b) => blogs[a] > blogs[b] ? a : b),
    blogs: Object.values(blogs).reduce((a, b) => blogs[a] > blogs[b] ? a : b),
  }
  return mostBlogs
}

const mostLikes = (blogs) => {
  const favAuthor= {
    author: '',
    likes: 0
  }
  _.uniq(blogs.map(blog => blog.author)).forEach(author => {
    let sum = 0
    blogs.forEach(blog => {
      if (blog.author===author){ 
        sum += blog.likes 
      }
    })
    if (sum > favAuthor.likes){
      favAuthor.likes = sum
      favAuthor.author = author
    }
  })
  
  return favAuthor
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
