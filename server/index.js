const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const app = express()

// connect DB
mongoose
    .connect('mongodb+srv://admin:admin@cluster0.znghj9j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB is connected'))
    .catch((err) => console.log('DB error', err))

// connect app
app.listen(process.env.PORT, () => console.log('Server is connected'))