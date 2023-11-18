import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        users: []
    },
    reducers: {
        setCurrentUser(state, action) {
            return {...state, currentUser: action.payload}
        },
        removeCurrentUser(state, action) {
            return {...state, currentUser: null}
        },
        setUsers(state, action) {
            return {...state, users: action.payload}
        }
    }
})

export const { setCurrentUser, removeCurrentUser, setUsers } = userSlice.actions

export const initializeUsers = () => {
    return async (dispatch) => {
        const users = await userService.getUsers()
        dispatch(setUsers(users))
    }
}

export default userSlice.reducer