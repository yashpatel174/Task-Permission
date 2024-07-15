// import User from '../model/user.js';


// // Permissions to users
// const grantUser = async (req, res, next) => {

//     try {

//         const {userId, permission} = req.body;
//         const user = await User.findById(userId);

//         if(!user) return res.status(404).send({message: "User not found"})

//         user.permissions.push(permission);
//         await user.save();
            
//         res.status(200).send({message: "Permission granted successfully."});
        
//     } catch (error) {
//         res.status(500).send({message: "Failed to grant permission."})
//     }

// }



// const revokeUser = async (req, res, next) => {

// try {

//     const {userId, permission} = req.body;
//     const user = await user.findById(userId);

//     if(!user) return res.status(404).send({message: "User not found"})

//         user.permissions = user.permissions.filter((perm) => perm !== permission);

//     await user.save();

//     res.status(200).send(user)

// } catch (error) {
//     res.status(500).send({message: "Failed to revoke permission"});
// }

// }

// export {grantUser, revokeUser}


// ===========================================================================================================================



// import userData from "../data/userData.js"

// const grantPermission = (req, res) => {

//     const {userName, permission} = req.body;
//     const user = user.userData.find(user => user.userName = userName)

//     if(user && (req.user.permissions.includes('manage_users' || 'manage_sub_users') || req.user.role === 'admin')) {
//         user.permissions.push(permission);
//         res.status(200).send(user)
//     } else {
//         res.status(400).send({message: "Forbidden while granting permission."})
//     }

// }

// const revokePermission = (req, res) => {

//     const {userName, permission} = req.body;
//     const user = user.userData.find(user => user.userName = userName)

//     if(user && (req.user.permissions.includes('manage_users' || 'manage_sub_users') || req.user.role === 'admin')) {
//         user.permissions = user.permissions.filter((perm) => perm!== permission);
//         res.status(200).send(user)
//     } else {
//         res.status(400).send({message: "Forbidden while revoking permission."})
//     }

// }


// export {grantPermission, revokePermission}



// ===========================================================================================================================

import userData from "../data/userData.js"

const isAdmin = (user) => user.role === "admin"


const isParentUser = (parentName, userName) => {
    const parentUser = userData.find(user => user.name === parentName)
    return parentUser && parentUser.subUsers.includes(userName)
}


const grantPermission = (req, res) => {

    const {name, permission} = req.body;
    const userToGrant = userData.find(user => user.name === name)

    try {
        
    if(!userToGrant) {
        return res.status(404).send({message: "You are failed to grant this permission."})
    }

    if (typeof name !== 'string' || typeof permission !== 'string') {
        return res.status(400).send({ message: "Invalid input types. 'name' and 'permission' should be strings." });
    }

    // admin can grant permission to any user
    if(isAdmin (req.user)) {
        if (!isAdmin (req.user)) {
            if (!userToGrant.permissions.includes(permission)) {
                userToGrant.permissions.push(permission)
            }
            res.status(200).send(userToGrant)
        } else {
            return res.status(400).send(error => {
                message: "You don't have the permission to grant this permission.",
                error.message
            });
        }
    }

    // parent user can grant to their sub users only.
    if (isParentUser(req.user.name, name)) {

        // If the parent user has permission, they are trying to grant
        if (req.user.permissions.includes(permission)) {
            if (!userToGrant.permissions.includes(permission)) {
                userToGrant.permissions.push(permission);
            }
            return res.status(200).send(userToGrant);
        } else {
            res.status(400).send({message: "You don't have the permission to grant this permission."})
        }
    }

} catch (error) {
    res.status(400).send({
        success: false,
        message: "You are not permitted to grant this permission to your child.",
        error: error.message
    })  
}

}




const revokePermission = (req, res) => {

    const {name, permission} = req.body;
    const userToRevoke = userData.find(user => user.name === name)

    if(!userToRevoke) {
        return res.status(404).send({message: "User not found"})
    }

    // Admin can revoke permission from any user
    if (isAdmin(req.user)) {

        userToRevoke.permissions = userToRevoke.permissions.filter(perm => perm !== permission)
        return res.status(200).send({
            message: "Permission revoked successfully"},
            userToRevoke
        )

    }

    // Parent user can revoke permissions from their usb-users only.
    if(isParentUser(req.user.name, userName)) {
        userToRevoke.permissions = userToRevoke.permissions.filter(perm => perm !== permission)
        return res.status(200).send({
            message: "Permission revoked successfully",
            userToRevoke
        })
    }

    return res.status(403).send({
        success: false,
        message: "You don't have permission to revoke this permission.",
        error: error.message
    })

}

export {grantPermission, revokePermission}
