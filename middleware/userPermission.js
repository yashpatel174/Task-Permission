// import User from '../model/user.js'

// // Check Sub-user permission

// const checkUserPermission = (requiredPermission) => {
    
//     return async (req, res, next) => {

//     try {
        
//         const user = await User.findById(req.user.id).populate('subUsers')

//         if(!user) return res.status(404).send({message: "User not found"})


//         // check if the user has permissions

//         if(user.permissions.includes(requiredPermission) || user.role === 'admin') {

//             const targetUser = await User.findById(req.user._id)
            
//             if(user.subUsers.includes(targetUser._id)) {
//                 return next();
//             } else {
//                 res.send({ message: "Target user is not a sub-user."})
//             }

//         } else {
//             return res.status(403).send({ message: "Forbidden"})
//         }

//     } catch (error) {
        
//         res.status(500).send({
//             success: false,
//             message: "Failed to check sub-user permission",
//             error: error.message
//         })

//     }
// }

// }



// export {checkUserPermission}