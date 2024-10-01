const authRoutes = require('./routes/authRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const dotenv = require("dotenv")
const dbConnect = require("./config/dbConnect.js")
const express = require("express")
const app = express();
const cors = require('cors')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

//config path of dotenv
dotenv.config({
    path: '/.env'
})

//middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173/',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials: true,
    })
)

//calling database and starting server
dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 4004, ()=>{
        console.log(`🛞 Server Running on Port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("💥💥 databse Connection Failed",err)
})

//defining routes
app.use("/api/auth", authRoutes)
app.use("/api", userRoutes)