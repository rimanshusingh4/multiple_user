import dotenv from "dotenv"
import dbConnect  from "../config/dbConnect.js";
import express from "express"

const app = express();

app.use(express.json());
dotenv.config({
    path: '/.env'
})

dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 4004, ()=>{
        console.log(`🛞 Server Running on Port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("💥💥 databse Connection Failed",err)
})