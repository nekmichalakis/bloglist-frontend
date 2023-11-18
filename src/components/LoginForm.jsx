import { useState } from 'react'
import { setMessage, setErrorMessage } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setCurrentUser } from '../reducers/userReducer'
import Notification from './Notification'

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            dispatch(setCurrentUser(user))
            setUsername('')
            setPassword('')
            dispatch(setMessage(`${user.username} logged in`))
        }
        catch (error) {
            dispatch(setErrorMessage(error.response.data.error))
            setUsername('')
            setPassword('')
        }
  }

    return (
        <div>
            <h2>log in</h2>
            <Notification />
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
}

export default LoginForm