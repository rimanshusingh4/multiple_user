const User = require('../models/userModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const adminRegister = async (req, res)=>{
    try {
        const {fullname, email ,password, role} = req.body;
        const existedUser = await User.findOne({email})
        if (existedUser) {
            return res
            .status(501)
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
                message: `Admin Register`,
                ok: true,
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
        // console.log("body",req.body)
        const {fullname, email ,password} = req.body;
        const existedUser = await User.findOne({email})
        if (existedUser) {
            return res
            .status(501)
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
                message: `User Register`,
                ok: true,
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
            return res.status(403).json(
                {
                    message: `Wrong Password`
                }
            )
        }
        
        const token = jwt.sign({
            id: user._id,
            role: user.role,
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
        // res.cookie('authcookie', token, {
        //     maxAge: 3600000, // 1 hour in milliseconds
        //     httpOnly: true, // Prevent JavaScript access to the cookie
        //     secure: process.env.NODE_ENV === 'production', // Only use in HTTPS in production
        //     sameSite: 'Strict', // Prevent CSRF
        //     path: '/' // Make it accessible on all paths
        // });
        // console.log(token)
        res.cookie('authcookie', token, {
            maxAge: 3600000,
            httpOnly: true,
            secure: false, // Change to true in production
            sameSite: 'none', // Change to 'lax' for same-site requests
            path: '/'
        })        
        .status(200)
        .json({
            message: "Login Successful", 
            token: token,
            role: user.role,
            ok: true,
        });
        

    } catch (error) {
        res.status(500).json(
            {
                message: `User not Found`
            }
        )
        console.log("Error from Login Controller", error)
    }
}


const logoutUser = async (req, res) => {
    // Unset the token from the database
    // console.log("User is from logout",req.user)
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                token: "" // Unsetting the token field from the user's document
            }
        },
        {
            new: true // Return the updated document
        }
    );

    console.log("From Logout", req.user._id);

    // Define cookie options for clearing
    const options = {
        httpOnly: true,         // Cookie cannot be accessed by JavaScript
        secure: true,           // Cookie is sent only over HTTPS
        path: '/'               // Ensure the cookie is cleared for the entire domain
    };

    // Clear the auth cookie and respond
    return res
        .status(200)
        .clearCookie("authcookie", options)
        .json({ message: "User logged out successfully" });
};





module.exports = {
    adminRegister,
    userRegister,
    login,
    logoutUser
}