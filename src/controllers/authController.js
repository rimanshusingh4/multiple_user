const User = require('../models/userModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const adminRegister = async (req, res)=>{
    try {
        const {fullname, email ,password, role} = req.body;
        const existedUser = await User.findOne({email})
        if (existedUser) {
            return res
            .status(500)
            .json({
                message: "Email already Register."
            })
        }
        const hashedPassword = await bcrypt.hash(password,10)
    
        const newUser = new User({fullname, email, password : hashedPassword, role: "admin"})
        await newUser.save();
        return res
        .status(201)
        .json({
                message: `Admin Register`
        })
    } catch (error) {
        return res
        .status(500)
        .json({
            message: "User not Created, Try Again."
        })
        console.log("Error from Controller",error)
    }
}

const userRegister = async (req, res)=>{
    try {
        const {fullname, email ,password} = req.body;
        const existedUser = await User.findOne({email})
        if (existedUser) {
            return res
            .status(500)
            .json({
                message: "Email already Register."
            })
        }
        const hashedPassword = await bcrypt.hash(password,10)
    
        const newUser = new User({fullname, email, password : hashedPassword, role: "user"})
        await newUser.save();
        return res
        .status(201)
        .json({
                message: `User Register`
        })
    } catch (error) {
        return res
        .status(500)
        .json({
            message: "User not Created, Try Again."
        })
    }
}

const login = async (req, res)=>{
    try {
        const {email, password } = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json(
                {
                    message: `User with email ${email} not Found`
                }
            )
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json(
                {
                    message: `Wrong Password`
                }
            )
        }
        
        const token = jwt.sign({
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        });
        const result = await User.updateOne(
            { _id: user._id },             // Filter condition
            { $set: { token: token } } // Update only the token field
        );
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
        // console.log(user)
        res
        .cookie('authcookie',token,{maxAge:3600,httpOnly:true}) 
        .status(200).json({
            message:  `${user.role} Login`, 
        })

    } catch (error) {
        res.status(500).json(
            {
                message: `User not Found`
            }
        )
        console.log("Error from Login Controller", error)
    }
}

// const getCurrentUser = async(req, res) => {
//     console.log(req.user)
//     return res
//     .status(200)
//     .json({
//         data:req.user,
//         message: "User fetched successfully"
//     })
// }

const logoutUser = async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                token: "" // Unsetting a field requires setting its value to an empty string
            }
        },
        {
            new: true // This option returns the updated document
        }
    );
    console.log("From Logout",req.user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("authcookie", options)
    .json({message: "User logged Out"})
}



module.exports = {
    adminRegister,
    userRegister,
    login,
    logoutUser
}