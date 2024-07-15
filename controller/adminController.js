// import User from '../model/user.js';


// // Permissions to users
// const grantAdmin = async (req, res, next) => {

//     try {

//         const {userId, permission} = req.body;
//         const user = await User.findById(userId);

//         if(!user) return res.status(404).send({message: "User not found"})

//         user.permissions.push(permission);
//         await user.save();
            
//         res.status(200).send({message: "Permission granted successfully."});
        
//     } catch (error) {
//         res.status(500).send({message: "Error while providing permissions."})
//     }

// }



// const revokeAdmin = async (req, res, next) => {

// try {

//     const {userId, permission} = req.body;
//     const user = await user.findById(userId);

//     if(!user) return res.status(404).send({message: "User not found"})

//         user.permissions = user.permissions.filter((perm) => perm !== permission);

//     await user.save();

//     res.status(200).send(user)

// } catch (error) {
//     res.status(500).send({message: "Error while revoking permission."})
// }

// }

// export {grantAdmin, revokeAdmin}
