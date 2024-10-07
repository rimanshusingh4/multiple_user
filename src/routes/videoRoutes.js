const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/authMiddleware.js');
const addProject  = require('../controllers/projectController.js');

// Use addProject as the callback after verifyToken middleware
router.post("/add",verifyToken, addProject);

module.exports = router;
