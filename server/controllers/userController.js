const userController = require('express').Router()
const User = require("../models/User")
const Post = require("../models/Post")
const bcrypt = require("bcrypt")
const verifyToken = require("../middlewares/verifyToken")


// get suggested user
userController.get('/find/suggestedUsers', verifyToken, async(req, res) => {
    try {
        const currentUser = await User.findById(req.user.id)
        const users = await User.find({}).select('-password')
        // if we dont follow this user and if user isnt current user
        let suggestedUsers = users.filter((user) => {
            return (
                !currentUser.followings.includes(user._id)
                && user._id.toString() !== currentUser._id.toString()
            )
        })

        if(suggestedUsers.length > 5){
            suggestedUsers = suggestedUsers.slice(0, 5)
        }

        return res.status(200).json(suggestedUsers)
    } catch (err) {
        return res.status(500).json(err.message)
    }
})

// get friends
userController.get('/find/friends', verifyToken, async(req, res) => {
    try {
        const currentUser = await User.findById(req.user.id)
        const friends = await Promise.all(currentUser.followings.map((friedId) => {
            return User.findById(friendId).select('-password')
        }))

        return res.status(200).json(friends)
    } catch (err) {
        return res.status(500).json(err.message)
    }
})

// get one
userController.get('/find/:userId', verifyToken, async(req, res) => {
    try {
        const user = await User.findById(req.params.userId)

        if(!user){
            return res.status(500).json({msg: "No such user, wrond id"})
        }

        const {password, ...others} = user._doc

        return res.status(200).json(others)

    } catch (err) {
        return res.status(500).json(err.message)
    }
})

// get all
userController.get('/findAll', async(req, res) => {
    try {
        const users = await User.find({})

        const formattedUsers = users.map((user) => {
            return {username: user.username, email: user.email, _id: user._id, createdAt: user.createdAt}
        })

        return res.status(200).json(formattedUsers)

    } catch (err) {
        return res.status(500).json(err.message)
    }
})

// update
userController.put('/updateUser/:userId', verifyToken, async(req, res) => {
    
    if(req.params.userId === req.user.id){

        try {
            if(req.body.password){
                req.body.password = await bcrypt.hash(req.body.password, 10)
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {$set: req.body}, {new: true})
            return res.status(200).json(updatedUser)
    
        } catch (err) {
            return res.status(500).json(err.message)
        }
    }
    else {
        return res.status(403).json({msg: "You can change ony your own profile"})
    }
})

// delete
userController.delete('/deleteUser/:userId', verifyToken, async(req, res) => {
    if(req.params.userId === req.user.id){
        try {
            await User.findByIdAndDelete(req.user.id)
            return res.status(200).json({msg: "Successfully deleted user"})
        } catch (err) {
            return res.status(500).json(err.message)
        }
    } else {
        return res.status(403).json({msg: "You can delete only your own profile"})
    }
})

// follow/unfollow
userController.put('/toggleFollow/:otherUserId', verifyToken, async(req, res) => {
    try {
        const currentUserId = req.user.id
        const otherUserId = req.params.otherUserId

        if(currentUserId === otherUserId){
            throw new Error("You cannot follow yourself")
        }

        const currentUser = await User.findById(currentUserId)
        const otherUser = await User.findById(otherUserId)

        if(!currentUser.followings.includes(otherUserId)){
            currentUser.followings.push(otherUserId)
            otherUser.followers.push(currentUserId)

            await User.findByIdAndUpdate(currentUserId, {$set: currentUser}, {new: true})
            await User.findByIdAndUpdate(otherUserId, {$set: otherUser}, {new: true})
            
            return res.status(200).json({msg: "You have successfully followed the user"})
        } else {
            currentUser.followings = currentUser.followings.map((id) => id !== otherUserId)
            otherUser.followers = otherUser.followers.map((id)  => id !== currentUserId)
        
            await User.findByIdAndUpdate(currentUserId, {$set: currentUser}, {new: true})
            await User.findByIdAndUpdate(otherUserId, {$set: otherUser}, {new: true})

            return res.status(200).json({msg: "You have succesfully ufolowed the user"})
        }
    } catch (err) {
        return res.status(500).json(err.message)
    }
})

// bookmark
userController.put('/bookmark/:postId', verifyToken, async(req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate("user", "-password")
        if(!post){
            return res.status(500).json({msg: "No such post"})
        } else {
            if(post.user.bookmarkedPosts.some((post) => post._id === req.params.postId)){
                await User.findByIdAndUpdate(req.user.id, {$pull: {'bookmarkedPosts': post}})
                return res.status(200).json({msg: "Successfully bookmarked the post"})
            }
        }
    } catch (err){
        return res.status(500).json(err.message)
    }
})

module.exports = userController