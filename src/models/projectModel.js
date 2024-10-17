const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const projectSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    file: {
        url:{
            type: String,
            required: true
        },
        public_id:{
            type: String,
            required: true
        },
        size:{
            type: Number,
            required: true
        }
    },
    thumbnail: {
        type: String, //cloudinary url
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
})

projectSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Project', projectSchema)