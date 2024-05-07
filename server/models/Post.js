const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    desc: {
        type: String,
        required: true,
        min: 8
    },
    photo: {
        type: String,
        default: ""
    },
    likes: {
        type: [String],
        default: []
    },
}, {timestamps: true})

module.exports = mongoose.model("Post", PostSchema)