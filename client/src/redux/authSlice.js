import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user: null,
    token: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action){
            localStorage.clear()
            state.user = action.payload.others
            state.token = action.payload.token
        },
        register(state, action){
            localStorage.clear()
            state.user = action.payload.others
            state.token = action.payload.token
        },
        logout(state){
            state.user = null
            state.token = null
            localStorage.clear()
        },
        handleFollow(state, action){
            if(state.user.followings.includes(action.payload)){
                state.user.followings = state.user.followings.filter((id) => id !== action.payload)
            } else {
                console.log(action.payload)
               state.user.followings.push(action.payload)
            }
        },
        likePost(state, action){
            if(state.user.likedPosts.some(post => post._id === action.payload._id)){
                state.user.likedPosts = state.user.likedPosts.filter((post) => post._id !== action.payload._id)
            } else {
                state.user.likedPosts.push(action.payload)
            }
        },
        updateUser(state, action){
            state.user = action.payload
        }
    }
})

export const {login, register, logout, handleFollow, likePost, updateUser} = authSlice.actions

export default authSlice.reducer