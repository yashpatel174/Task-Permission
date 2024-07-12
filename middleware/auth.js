import JWT from 'jsonwebtoken';
import userSchema from "../model/user.js"

const verifyToken = async (req, res, next) => {

    const token = req.header('Authorization');

    if(!token) return res.status(400).send({message: "Access denied."})

        try {
            
            const verified = JWT.verify(token, process.env.SECRET_KEY)
            req.user = verified
            next();

        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Invalid token.",
                error: error.message
            })
        }
}

const checkPermission = (action) => {

    return async (req, res, next) => {

        const user = await userSchema.findById(req.params.id).populate("admin").populate("user")

        if(req.user.role == "superAdmin") return next();

        if(user.permission && user.permission.get(action)) return next();

        const isAdmin = user.admin.some(admin => admin._id.toString() == req.user.id)
        const isUser = user.user.some(user => user._id.toString() == req.user.id)

        if(!isAdmin || !isUser) return next();

        return res.status(400).send({message: "You are not provided the permission."})

        }
    
}


export {verifyToken, checkPermission}