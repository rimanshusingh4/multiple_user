const express = require('express')
const {verifyToken,getCurrentUser} = require('../middlewares/authMiddleware.js');
const { logoutUser } = require('../controllers/authController.js');

const router = express.Router();

router.get("/current-user",verifyToken,getCurrentUser, (req,res)=>{
})
router.post("/logout",verifyToken, logoutUser,(req,res)=>{
    console.log('Received cookies:', req.cookies); // Check all received cookies
    console.log('Request Headers:', req.headers); 
})
module.exports= router