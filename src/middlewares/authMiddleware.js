const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const verifyToken = async (req, res, next) => {
    let token;

    // Get the token from cookies or Authorization header
    const authHeader = req.cookies?.authcookie || req.header("Authorization")?.replace("Bearer ", "");
    if (authHeader) {
        token = authHeader; // Set the token
    } else {
        return res.status(401).json({
            message: "No Authorization token provided"
        });
    }

    try {
        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the decoded token's user ID
        const user = await User.findById(decodedToken?.id).select("-password -token");
        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        // Attach the user to the request object
        console.log("User from verifyJson Token", user)
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: "Token is not valid" });
    }
};

// Route handler to get the current user
const getCurrentUser = async (req, res) => {
    console.log('User from get current user',req.user)
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized access, no user found"
        });
    }

    return res.status(200).json({
        data: req.user,
        message: "User fetched successfully"
    });
};

module.exports = { verifyToken, getCurrentUser };
