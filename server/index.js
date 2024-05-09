const commentController = require('./controllers/commentController')
const uploadController = require('./controllers/uploadController')
const authController = require('./controllers/authController')
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()

// connect DB
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('DB is connected'))
    .catch((err) => console.log('DB error', err))

app.use('/images', express.static('public/images'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', authController)
app.use('/user', userController)
app.use('/post', postController)
app.use('/comment', commentController)
app.use('/upload', uploadController)

// connect app
app.listen(process.env.PORT, () => console.log('Server is connected'))