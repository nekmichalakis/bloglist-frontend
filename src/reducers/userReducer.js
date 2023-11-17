import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null
    },
    reducers: {
        setCurrentUser(state, action) {
            return {...state, currentUser: action.payload}
        },
        removeCurrentUser(state, action) {
            return {...state, currentUser: null}
        }
    }
})

export const { setCurrentUser, removeCurrentUser } = userSlice.actions

export default userSlice.reducer