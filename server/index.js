const express = require('express')
const mongoose = require('mongoose')
const authController = require('./controllers/authController')
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const dotenv = require('dotenv').config()
const app = express()

// connect DB
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('DB is connected'))
    .catch((err) => console.log('DB error', err))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', authController)
app.use('/user', userController)
app.use('/post', postController)

// connect app
app.listen(process.env.PORT, () => console.log('Server is connected'))