import JWT from "jsonwebtoken";
import userSchema from "../model/userModel.js"
import groupSchema from "../model/groupModel.js"

const authMiddleware = async (req, res, next) => {

    const token = req.headers['Authorization'];
    if(!token) return res.status(401).send({message: 'Access denied, no token provided.'});

    try {
        
        const decoded = JWT.verify(token, process.env.SECRET_KEY)

        const user = await userSchema.findOne(decoded.username).populate('group')
        if(!user) return res.status(401).send({message: 'Invalid token'});

        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        
        res.status(400).send({
            success: false,
            message: "Unauthorized",
            error: error.message
        })

    }

}



const checkPermission = (permission) => {

    return async (req, res) => {

        const user = req.user;
        const userPermissions = user.permissions;
        const groupPermissions = user.group ? user.group.permissions : [];

        // if (groupPermissions.includes(permission)) {return next(); res.status(201).send({message: "Permission granted to the group."})};
        // if (userPermissions.includes(permission)) {return next(); res.status(201).send({message: "Permission granted to the user."})};
        // if (userPermissions.includes(permission) && !groupPermissions.includes(permission)) {return res.status(500).send({message: "You are not permitted as your group does not have permissions to access."})};

        if (userPermissions.includes(permission) || groupPermissions.includes(permission)) {return next(); res.status(200).send({message: "Permission granted."})} else {
            res.status(403).send({message: "Permission denied"});
        }

    }

}


export {authMiddleware, checkPermission}