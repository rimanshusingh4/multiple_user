const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const projectSchema = new mongoose.Schema({
    file: {
        type: String, //cloudinary url
        required: true
    },
    thumbnail: {
        type: String, //cloudinary url
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('Project', projectSchema)