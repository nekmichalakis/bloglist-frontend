import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const UserBlogs = () => {
    const id  = useParams().id
    const user = useSelector(state => state.user.users.find(u => u.id === id))

    if(!user) {
        return null
    }

    return (
        <div>
            <h2>{user.username}</h2>
            <h4>added blogs</h4>
            <ul>
                {user.blogs.map(b => 
                    <li key={b.id}>{b.title}</li>
                )}
            </ul>
        </div>
    )
}

export default UserBlogs