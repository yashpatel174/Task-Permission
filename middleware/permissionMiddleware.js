

const permissionMiddleware = (requiredPermission) => {

    return (req, res, next) => {

        if(req.user.permissions.includes(requiredPermission) || req.user.role === "admin") {
            return next()
        } else {
            res.status(400).send({message:"You are not permissted for this operation."})
        }

    }

}

export default permissionMiddleware;