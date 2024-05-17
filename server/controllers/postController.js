const { verify } = require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken')
const Post = require('../models/Post')
const User = require('../models/User')
const postController = require('express').Router()
const mongoose = require('mongoose')

// get user posts
postController.get('/find/userposts/:id', async(req, res) => {
    try {
        const currentUser = await User.findById(req.params.id)
        const posts = await Post.find({user: currentUser._id}).populate("user", "-password")

        return res.status(200).json(posts)
    } catch (err) {
        return res.status(500).json(err.message)        
    }
})

// get timeline posts
postController.get('/timeline/posts', verifyToken, async(req, res) => {
    try {
        const currentUser = await User.findById(req.user.id)
        const posts = await Post.find({}).populate("user", "-password")
        const currentUserPosts = await Post.find({user: currentUser._id}).populate("user", "-password")
        const friendsPosts = posts.filter((post) => {
            return currentUser.followings.includes(post.user._id)
        })
        
        let timelinePosts = currentUserPosts.concat(...friendsPosts)

        if(timelinePosts.length > 40){
            timelinePosts = timelinePosts.slice(0, 40)
        }

        return res.status(200).json(timelinePosts)
    } catch (err) {
        return res.status(500).json(err.message)        
    }
})

// get one
postController.get('/find/:id', async(req, res) => {
    try {
        let post = await Post.findById(req.params.id).populate("user", "-password")

        if(!post) {
            return res.status(500).json({msg: "No such post with this id"})
        } else{
            return res.status(200).json(post)
        }
    } catch (err) {
        return res.status(500).json(err.message)        
    }
})

// create
postController.post('/', verifyToken, async(req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id)
        const newPost = await Post.create({...req.body, user: userId})
        
        return res.status(201).json(newPost)
    } catch (err) {
        return res.status(500).json(err.message)        
    }
})

// update
postController.put('/:id', verifyToken, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(post.user.toString() === req.user.id.toString()){
            const updatedPost = await Post.findByIdAndUpdate(req.params.id,
            {$set: req.body}, {new: true})
            return res.status(200).json(updatedPost)
        } else{
            return res.status(500).json({msg: "You can change ony your own posts"})
        }
    } catch (err) {
        return res.status(500).json(err.message)        
    }
})

// delete
postController.delete('/:id', verifyToken, async(req, res) => {
    try {
        
        const post = await Post.findById(req.params.id).populate("user", "-password")
        if(!post){
            return res.status(500).json({msg: "No such post"})
        } else if(post.user._id.toString() !== req.user.id.toString()){
            return res.status(403).json({msg: "You can delete only your own posts"})
        } else {
            await Post.findByIdAndDelete(req.params.id)
            return res.status(200).json({msg: "Post is successfully deleted"})
        }
    } catch (err) {
        return res.status(500).json(err.message)        
    }
})

// like
postController.put('/like/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if (!post) {
            return res.status(404).json({ msg: 'No such post' });
        } else {
            if (post.likes.includes(user._id)) {
                await Post.findByIdAndUpdate(post._id, { $pull: { 'likes': user._id } });
                await User.findByIdAndUpdate(user._id, { $pull: { 'likedPosts': post._id } });
                return res.status(200).json({msg: "Successfully Disliked this post"});
            } else {
                await Post.findByIdAndUpdate(post._id, { $addToSet: { 'likes': user._id } });
                await User.findByIdAndUpdate(user._id, { $addToSet: { 'likedPosts': post._id } });
                return res.status(200).json({msg: "Successfully Liked this post"});
            }
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
});


module.exports = postController
