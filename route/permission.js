import express from 'express'
import {verifyToken} from '../middleware/auth.js'

const router = express.Router()

router.post('/toggle', verifyToken, async (req, res) => {
    
    const { userId, action, grant } = req.body;

    try {
        
        const user = await userSchema.findById(userId);
        if(!user) return res.status(404).send({message: "User not found"})

        if(!user.permission) {
            user.permission = new Map();
        }

        user.permission.set(action, grant);
        await user.save();

        res.status(200).send({message: `Permission ${grant ? 'granted' : 'denied'} for ${action}`});

    } catch (error) {
        
        res.status(500).send({
            success: false,
            message: "Failed to toggle permission",
            error: error.message
        })

    }

})



router.post("/CRUD", (req, res, next) => {

try {

    const superAdminRole = req.params.role("superadmin")
    const adminRole = req.params.role("admin")
    const userRole = req.params.role("user")


    const adminId = req.params._id
    


} catch (error) {
    
}

})

export default router;
