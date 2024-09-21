import mongoose from "mongoose";
import dbName from "./constant.js";

const dbConnect = async ()=>{
    try {
        const connect = await mongoose.connect(`${process.env.URI}/${dbName}`)
        console.log("🎉🎉 Database connected successfully")
    } catch (error) {
        console.log(error)
    }
}
export default dbConnect