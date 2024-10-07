const Project = require('../models/projectModel.js');
const { uploadOnCloudinary } = require('../config/uploadOnCloudinary.js'); // Ensure this function exists

const addProject = async (req, res) => {
    const { title, description } = req.body;
    // Check if required fields are missing
    if (!title?.trim() || !description?.trim()) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Check if thumbnail is uploaded
    const thumbnailFile = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailFile) {
        return res.status(400).json({ message: "Thumbnail is required" });
    }
    try {
        // Upload thumbnail to Cloudinary
        const thumbnail = await uploadOnCloudinary(thumbnailFile);
        if (!thumbnail) {
            return res.status(400).json({ message: "Thumbnail upload failed" });
       }
        // Create the project in the database
        const project = await Project.create({
            title,
            description,
            thumbnail: {
                url: thumbnail.url,
                public_id: thumbnail.public_id
            },
            owner: req.user?._id, // Ensure `req.user` is populated by auth middleware
        });
        // Fetch the newly uploaded project
        const projectUploaded = await Project.findById(project._id);
        if (!projectUploaded) {
            return res.status(500).json({ message: "Project upload failed, please try again" });
        }
        // Return success response
        return res.status(200).json({ project: projectUploaded, message: "Project uploaded successfully" });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    addProject,
};
