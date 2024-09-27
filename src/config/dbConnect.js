const mongoose = require("mongoose")
const dbName = require("./constant.js")

const dbConnect = async ()=>{
    try {
        const connect = await mongoose.connect(`${process.env.URI}/${dbName}`)
        console.log("🎉🎉 Database connected successfully")
    } catch (error) {
        console.log(error)
    }
}
module.exports = dbConnect