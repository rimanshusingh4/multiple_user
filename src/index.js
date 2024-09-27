const authRoutes = require('./routes/authRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const dotenv = require("dotenv")
const dbConnect = require("./config/dbConnect.js")
const express = require("express")
const app = express();
const cors = require('cors')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')


dotenv.config({
    path: '/.env'
})
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 4004, ()=>{
        console.log(`🛞 Server Running on Port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("💥💥 databse Connection Failed",err)
})
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api", userRoutes)