import { useEffect } from 'react'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Menu from './components/Menu'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import UserList from './components/UserList'
import UserBlogs from './components/UserBlogs'
import { useSelector, useDispatch } from 'react-redux'
import { setMessage } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { removeCurrentUser, setCurrentUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/userReducer'
import { Routes, Route } from 'react-router-dom'


const App = () => {
  const user = useSelector(state => state.user.currentUser)

  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setCurrentUser(user))
      blogService.setToken(user.token)
    }

    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [])

  const handleLogout = () => {
    dispatch(setMessage(`${user.username} logged out`))
    dispatch(removeCurrentUser())
    window.localStorage.removeItem('loggedBlogappUser')
  }

  if (!user) {
      return  <LoginForm />
  }

  return (
    <div>
      <Menu />
      {user.username} logged in
      <button onClick={handleLogout}>logout</button>
      <Notification />
      <h2>blog app</h2>

      <Routes>
        <Route path='/' element={<BlogList />} />
        <Route path='/blogs' element={<BlogList />} />
        <Route path='/blogs/:id' element={<BlogView />} />
        <Route path='/createBlog' element={<BlogForm />} />
        <Route path='/users' element={<UserList />} />
        <Route path='/users/:id' element={<UserBlogs />} />
      </Routes>

    </div>
  )
}

export default App