const mongoose = require('mongoose')

const { Schema } = mongoose

const postSchema = new Schema({
    title: {
        type: String,
        minlength: 4,
        maxlength: 100,
        required: true
    },
    summary: {
        type: String,
        minlength: 15,
        maxlength: 300,
        required: true
    },
    content: {
        type: String,
        minlength: 20,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    coverImage:String

},  {timestamps:true}
);

module.exports = mongoose.model("Post",postSchema)