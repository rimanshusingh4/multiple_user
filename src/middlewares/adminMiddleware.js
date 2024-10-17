// isAdmin middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied, admin only" });
    }
    next();
};

module.exports = { isAdmin };
