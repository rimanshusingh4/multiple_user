const express = require('express')
const router = express.Router()
const {verifyToken, getCurrentUser} = require('../middlewares/authMiddleware.js');
const {isAdmin} = require('../middlewares/adminMiddleware.js')
const {addProject, getAllProjects, deleteProject, getProjectById}  = require('../controllers/projectController.js');
const multer = require('multer');
const upload = multer({ dest: './public/temp' }); // Set your upload destination

const uploadFields = upload.fields([
    { name: 'thumbnail', maxCount: 1 }, // Expect a 'thumbnail' field with max 1 file
    { name: 'file', maxCount: 1 } // Expect a 'file' field with max 1 file
]);
// Use addProject as the callback after verifyToken middleware

router.get("/", getAllProjects);
router.post("/add", verifyToken,isAdmin, uploadFields, addProject);
router.get('/:adminId', getProjectById);  
router.delete("/delete/:projectId", verifyToken, isAdmin, deleteProject);

module.exports = router;
