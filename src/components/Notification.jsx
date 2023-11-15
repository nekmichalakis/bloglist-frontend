import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../reducers/notificationReducer'

const Notification = () => {
    const message = useSelector(state => state.notification.message)
    const errorMessage = useSelector(state => state.notification.errorMessage)

    const dispatch = useDispatch()

    if (message || errorMessage) {
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
    }

    return (
        <div style={message ? { color: 'green' } : { color: 'red' }} className='notification'>
            {message ? message : errorMessage}
        </div>
    )
}

export default Notification