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

// get user likes
postController.get('/find/userlikes/:userId', async(req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
    
        const posts = await Post.find({ _id: { $in: currentUser.likedPosts } }).populate("user", "-password");
    
        res.status(200).json(posts);
      } catch (err) {
        res.status(500).json(err.message);
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

// likes
postController.put('/like/:postId/:photoIndex', verifyToken, async (req, res) => {
    try {
        const photoIndex = parseInt(req.params.photoIndex);
        const postId = req.params.postId
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: 'No such post' });
        }

        const userId = req.user.id;

        if (photoIndex != 0 && photoIndex != 1) {
            return res.status(400).json({ msg: 'Invalid photo index' });
        }

        const likedPhotoIndex = post.likes.get(userId);

        if (likedPhotoIndex != undefined) {
            if (likedPhotoIndex != photoIndex) {
                post.likes.set(userId, photoIndex);
                await post.save();
                return res.status(200).json({ msg: 'Photo like changed successfully', post});
            } else {
                await User.findByIdAndUpdate(userId, { $pull: { 'likedPosts': postId } });

                post.likes.delete(userId);
                await post.save();
                return res.status(200).json({ msg: 'Photo like removed successfully', post});
            }
        } else {
            await User.findByIdAndUpdate(userId, { $addToSet: { 'likedPosts': postId } });

            post.likes.set(userId, photoIndex);
            await post.save();
            return res.status(200).json({ msg: 'Photo liked successfully', post});
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
});


module.exports = postController
