const Project = require('../models/projectModel.js');
const { uploadOnCloudinary, deleteOnCloudinary } = require('../config/uploadOnCloudinary.js');
const mongoose = require ("mongoose")


const getAllProjects = async(req, res)=>{
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    const pipeline = [];

    if (query) {
        pipeline.push({
            $search: {
                index: "search-projects",
                text: {
                    query: query,
                    path: ["title", "description"] // Search only on title and description
                }
            }
        });
    }
    // console.log("first" , userId);
    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({message: "Invalid userId" });
        }

        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        });
    }
    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }


    const projectAggregate = Project.aggregate(pipeline);
    // console.log("projectAggregate is: ",projectAggregate)
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    try {
        const project = await Project.aggregatePaginate(projectAggregate, options);
        // console.log("Project details:", project);
        return res.status(200).json({
            data: project
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ message: "An error occurred while fetching projects" });
    }

}

const addProject = async (req, res) => {

    const { title, description } = req.body;

    // Check if required fields are missing
    if (!title?.trim() || !description?.trim()) {
        return res.status(400).json({ message: "Title is required" });
    }
    console.log("title is: ", title);
    console.log("description is: ", description);

    // Check if thumbnail is uploaded
    const thumbnailFile = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailFile) {
        return res.status(400).json({ message: "Thumbnail is required" });
    }

    // check if project file is uploaded successfully.
    const projectFile = req.files?.file?.[0]?.path; // Assuming 'file' is the key for the project file
    if (!projectFile) {
        return res.status(400).json({ message: "Project file is required" });
    }
    // console.log("thumbnailFile is: ", thumbnailFile);
    // console.log("projectFile is: ", projectFile);
    try {
        // Upload thumbnail to Cloudinary
        const thumbnail = await uploadOnCloudinary(thumbnailFile);
        if (!thumbnail) {
            return res.status(400).json({ message: "Thumbnail upload failed" });
        }

        const file = await uploadOnCloudinary(projectFile);
        if (!file) {
            return res.status(400).json({ message: "File upload failed" });
        }

        // Create the project in the database
        const size = Math.round((file.bytes / 1048576))
        const project = await Project.create({
            title,
            description,
            thumbnail: thumbnail.url,
            file: {
                url: file.url,
                public_id: file.public_id,
                size: size,
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

const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Validate the id
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        // Find the project by ID
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Return the project if found
        return res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


const getProjectByAdminId = async (req, res) => {
    try {
        const { adminId } = req.params;  // adminId from route parameters
        // console.log("adminId is: ", adminId);

        const projects = await Project.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(adminId), // Match the `owner` field with adminId
                },
            },
        ]);

        if (!projects || projects.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No projects found for this admin.",
                projects: [],
            });
        }
        return res.status(200).json({
            docs: projects,
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};





const deleteProject = async (req, res) => {
    const { projectId } = req.params;  // Access projectId from req.params

    if (!mongoose.isValidObjectId(projectId)) {
        console.log("Project ID is not valid");
        return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user?._id.toString()) {
        return res.status(403).json({ message: "You are not the owner, so you cannot delete this project" });
    }

    const projectDelete = await Project.findByIdAndDelete(project._id);
    if (!projectDelete) {
        return res.status(500).json({ message: "Failed to delete, try again." });
    }

    await deleteOnCloudinary(project.thumbnail.public_id);
    await deleteOnCloudinary(project.file.public_id, "file");

    return res.status(200).json({ message: "Project deleted successfully" });
};




module.exports = {
    addProject,
    getAllProjects,
    getProjectById,
    getProjectByAdminId,
    deleteProject,
};
