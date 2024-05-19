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
    firstImg: {
        type: String,
        required: true
    },
    secondImg: {
        type: String,
        required: true
    },
    likes: {
        type: Map,
        of: Number,
        default: {}
    }
}, {timestamps: true})

module.exports = mongoose.model("Post", PostSchema)