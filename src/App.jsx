import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (message || errorMessage) {
    setTimeout(() => {
      message ?
        setMessage(null)
        :
        setErrorMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) =>{
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(`${user.username} logged in`)
    }
    catch (error) {
      setErrorMessage(error.response.data.error)
    }
  }

  const handleLogout = () => {
    setMessage(`${user.username} logged out`)
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const createBlog = async (blogObject) => {
    try {
      let returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = { id: returnedBlog.user, username: user.username }
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`new blog ${returnedBlog.title} created by ${returnedBlog.author}`)
    }
    catch (error) {
      setErrorMessage(error.response.data.error)
    }
  }

  const addLike = async (blogObject) => {
    try {
      let returnedBlog = await blogService.update(blogObject.id, blogObject)
      returnedBlog.user = { id: returnedBlog.user, username: user.username }
      setBlogs(blogs.map(b => (b.id !== returnedBlog.id) ? b : returnedBlog))
      setMessage(`blog ${returnedBlog.title} liked by ${user.username}`)
    }
    catch (error) {
      setErrorMessage(error.response.data.error)
    }
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      setMessage(`blog ${id} removed by ${user.username}`)
    }
    catch (error) {
      console.log('in catch')
      setErrorMessage(error.response.data.error)
    }
  }

  const loginForm = () => (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text' value={username} name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password' value={password} name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )

  return (
    <div>
      <h2>{user ? 'blogs' : 'log in'}</h2>
      <div style={message ? {color: 'green'} : {color: 'red'}}>
        {message ? message : errorMessage}
      </div>
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
        <Toggleable buttonLabel='create new blog'>
          <BlogForm createBlog={createBlog} />
        </Toggleable>
        {sortedBlogs.map(blog =>
          <Blog key={blog.id} user={user} blog={blog}
            addLike={addLike} removeBlog={removeBlog}
          />
        )}
        </div>
      }
    </div>
  )
}

export default App