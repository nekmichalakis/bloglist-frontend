import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setCurrentUser(state, action) {
            return action.payload
        },
        removeCurrentUser(state, action) {
            return null
        }
    }
})

export const { setCurrentUser, removeCurrentUser } = userSlice.actions

export default userSlice.reducer