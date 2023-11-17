import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'
import Notification from './components/Notification'
import { useSelector, useDispatch } from 'react-redux'
import { setMessage, setErrorMessage } from './reducers/notificationReducer'
import { setBlogs, appendBlog, deleteBlog, replaceBlog } from './reducers/blogReducer'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

<<<<<<< HEAD
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes) //try to put it in useSelector ?

  const dispatch = useDispatch()
  const blogFormRef = useRef()
=======
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])
>>>>>>> parent of fa1c3ba (end to end testing)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    blogService.getAll().then(res =>
      dispatch(setBlogs(res))
    )
  }, [])

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
      let returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = { id: returnedBlog.user, username: user.username }
      dispatch(appendBlog(returnedBlog))
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
      dispatch(replaceBlog(returnedBlog))
      dispatch(setMessage(`blog ${returnedBlog.title} liked by ${user.username}`))
    }
    catch (error) {
      dispatch(setErrorMessage(error.response.data.error))
    }
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      dispatch(deleteBlog(id))
      dispatch(setMessage(`blog ${id} removed by ${user.username}`))
    }
    catch (error) {
      dispatch(setErrorMessage(error.response.data.error))
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
<<<<<<< HEAD
      <Notification />
=======
      <div style={message ? {color: 'green'} : {color: 'red'}}>
        {message ? message : errorMessage}
      </div>
>>>>>>> parent of fa1c3ba (end to end testing)
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