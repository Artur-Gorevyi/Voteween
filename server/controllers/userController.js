const userController = require('express').Router()
const User = require("../models/User")
const Post = require("../models/Post")
const bcrypt = require("bcrypt")
const verifyToken = require("../middlewares/verifyToken")


