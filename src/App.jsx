import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'
import { useSelector, useDispatch } from 'react-redux'
import { setMessage, setErrorMessage } from './reducers/notificationReducer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const message = useSelector(state => state.notification.message)
  const errorMessage = useSelector(state => state.notification.errorMessage)

  const dispatch = useDispatch()

  const blogFormRef = useRef()

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
        dispatch(setMessage(''))
        :
        dispatch(setErrorMessage(''))
    }, 5000)
  }

  const handleLogin = async (event) => {
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
      dispatch(setMessage(`${user.username} logged in`))
    }
    catch (error) {
      dispatch(setErrorMessage(error.response.data.error))
    }
  }

  const handleLogout = () => {
    dispatch(setMessage(`${user.username} logged out`))
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      let returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = { id: returnedBlog.user, username: user.username }
      setBlogs(blogs.concat(returnedBlog))
      dispatch(setMessage(`new blog ${returnedBlog.title} created by ${returnedBlog.author}`))
    }
    catch (error) {
      dispatch(setErrorMessage(error.response.data.error))
    }
  }

  const addLike = async (blogObject) => {
    try {
      let returnedBlog = await blogService.update(blogObject.id, blogObject)
      returnedBlog.user = { id: returnedBlog.user, username: user.username }
      setBlogs(blogs.map(b => (b.id !== returnedBlog.id) ? b : returnedBlog))
      dispatch(setMessage(`blog ${returnedBlog.title} liked by ${user.username}`))
    }
    catch (error) {
      dispatch(setErrorMessage(error.response.data.error))
    }
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      dispatch(setMessage(`blog ${id} removed by ${user.username}`))
    }
    catch (error) {
      console.log('in catch')
      dispatch(setErrorMessage(error.response.data.error))
    }
  }

  const loginForm = () => (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text' value={username} name='Username' id='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password' value={password} name='Password' id='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit' id='login-button'>login</button>
      </form>
    </div>
  )

  return (
    <div>
      <h2>{user ? 'blogs' : 'log in'}</h2>
      <div style={message ? { color: 'green' } : { color: 'red' }} className='notification'>
        {message ? message : errorMessage}
      </div>
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
        <Toggleable buttonLabel='create new blog' ref={blogFormRef}>
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