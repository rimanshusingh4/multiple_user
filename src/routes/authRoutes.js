const express = require('express')
const router = express.Router()
const {adminRegister, userRegister, login} = require('../controllers/authController.js');
const { check } = require('express-validator');


router.post("/adminRegister",
    check("email")
    .isEmail()
    .withMessage('Enter Valid Email')
    .normalizeEmail(),
    check("fullname")
    .not()
    .isEmpty()
    .withMessage("Enter Your Full Name"),
    check("password")
    .not()
    .isEmpty()
    .withMessage("Enter Your Password"),
    adminRegister);

router.post("/register",
    check("email")
    .isEmail()
    .withMessage('Enter Valid Email')
    .normalizeEmail(),
    check("fullname")
    .not()
    .isEmpty()
    .withMessage("Enter Your Full Name"),
    check("password")
    .not()
    .isEmpty()
    .withMessage("Enter Your Password"),
    userRegister);

router.post("/login",
    check("email")
    .isEmail()
    .withMessage('Enter Valid Email')
    .normalizeEmail(),
    check("password")
    .not()
    .isEmpty()
    .withMessage("Enter Your Password"),
    login);

module.exports = router;