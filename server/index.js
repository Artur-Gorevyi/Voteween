const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const app = express()

// connect DB
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('DB is connected'))
    .catch((err) => console.log('DB error', err))

// connect app
app.listen(process.env.PORT, () => console.log('Server is connected'))