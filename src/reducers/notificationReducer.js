import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        message: '',
        errorMessage: ''
    },
    reducers: {
        setMessage(state, action) {
            return {...state, message: action.payload}
        },
        setErrorMessage(state, action) {
            return {...state, errorMessage: action.payload}
        }
    }
})

export const { setMessage, setErrorMessage } = notificationSlice.actions

export default notificationSlice.reducer