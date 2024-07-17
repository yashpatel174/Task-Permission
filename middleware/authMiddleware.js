import JWT from "jsonwebtoken";
import userSchema from "../model/userModel.js"
import groupSchema from "../model/groupModel.js"

const authMiddleware = async (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
        const decoded = JWT.verify(token, 'secretKey');
        const user = await userSchema.findById(decoded._id).populate('group');

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({
            error: 'Please authenticate.',
            error:error.message
        });
    }

}



const checkPermission = (permission) => {

    return async (req, res, next) => {
        const user = req.user;
        const userPermissions = user.permissions;
        const groupPermissions = user.group ? user.group.permissions : [];

        if (userPermissions.includes(permission) || groupPermissions.includes(permission)) {
            next();
        } else {
            res.status(403).send({ message: 'Permission denied' });
        }
    };

}


export {authMiddleware, checkPermission}