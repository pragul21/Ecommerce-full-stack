

module.exports = (req, res, next) => {
    if (req.user.isAuth) {
        next();
    } else {
        res.status(400).json({ error: "Only admin is allowed to access this link" })
    }
}