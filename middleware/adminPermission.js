// import User from '../model/user.js'


// // Check User Permission

// const checkAdminPermission = (requiredPermission) => {

//     return async (req, res, next) => {

//         try {
            
//             const user = await User.findById(req.user.id)

//             if(!user) return res.status(404).send({ message: "User not found."})

//             if(user.permissions.includes(requiredPermission) || user.role === "admin") {
//                 return next();
//             } else return res.status(400).send({message: "Forbidden"})

//         } catch (error) {
//             return res.status(500).json({ error: 'Internal Server Error while cheking sub-user permission.' });
//         }

//     }

// }

// export default checkAdminPermission