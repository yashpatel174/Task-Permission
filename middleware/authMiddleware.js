import userData from '../data/userData.js';

const authMiddleware = (req, res, next) => {

    try {
        const userName = req.headers['name'];

    if(!userName) return res.send({message: "User name is required in headers."})

    const user = userData.find(u => u.name === userName);
    if(!user) return res.status(404).send({message: "User not found."})
        
        req.user = user;
        next();
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to authenticate user",
            error: error.message
        })
    }


}

export default authMiddleware;