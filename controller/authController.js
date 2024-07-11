import userSchema from "../model/user.js"
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";


// register user
const registerController = async (req, res) => {

    const {userName, password, role, admin, user} = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRegister = userSchema({userName, password:hashedPassword, role, admin, user});
        await userRegister.save();

        if(!userRegister) {
            res.status(400).send({
                success: false,
                message: "User not created.",
                error: eroror.message
            })
        }

        res.status(201).send({
            success: true,
            message: `User created successfully as ${userRegister.userName}`,
            user: userRegister.userName
        })

    }   catch (error) {
            res.status(500).send({
            success: false,
            message: "Failed to create user",
            error: error.message
        })
    }
    
}

// Login user with authentication
const loginController = async (req, res) => {
    const {userName, password} = req.body;
    
    try {
        const user = await userSchema.findOne({userName})
        
        if(!userName) {
            res.status(404).send({message: "Username is not exist, Please register."})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            res.status(400).send({message: "Invalid credentials."})
        }

        const token = JWT.sign({id: user._id, role: user.role, admin: user.admin, user: user.user}, process.env.SECRET_KEY, {expiresIn: process.env.EXPIRE})

        res.status(200).send({
            success: true,
            message: `${user.userName} logged in successfully`,
            token
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to login user",
            error: error.message
        })
    }
    }
        

export {registerController, loginController};