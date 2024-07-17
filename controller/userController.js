import userSchema from '../model/userModel.js';
import groupSchema from "../model/groupModel.js"

const grantPermission = async (req, res) => {

    const { targetId, targetType, permission } = req.body;

    const isAdmin = req.user.role === 'admin';

    try {

        if (targetType === "Group") {

            // verify as an admin
            if(!isAdmin(req.user)) return res.status(403).send({message: "Only admin can access the permissions."})

            const group = await groupSchema.findById(targetId);
                if(!group) return res.status(403).send({message: "Group not found"});

            // grant permission to group
            if(!group.permissions.includes(permission)) {
                group.permissions.push(permission);
            }

            await group.save();
            res.status(200).send({ message: "Permission granted to group.", group})

        } else if (targetType === 'User') {

            // check if the users were granted the permission
            const user = await userSchema.findById(targetId).populate("Group");
            if(!user || !user.group) return res.status(403).send({message: "User is not a part of any group."});

            // Check if user has permission to grant
            if (!user.group.permissions.includes(permission)) return res.send({message: "Group does not have access to the permissions."})

            const userToGrant = await userSchema.findById(targetId)

            if(!userToGrant) return res.send({message: "User not found to grant the permission."});
            res.status(200).send({ message: "Permission granted to user.", user})

            // Grant user to permission
            if (!userToGrant.permissions.includes(permission)) {
                return userToGrant.permissions.push(permission);
            }

            await userToGrant.save();
            res.status(200).send({ message: "Permission granted to user.", user})

        } else {
            res.status(400).send({
                success: false,
                message: "Target type is invalid."
            })
        }

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Invalid request to grant the permission.",
            error: error.message
        })
    }

};

const revokePermission = async (req, res) => {

    const { targetId, targetType, permission } = req.body;

    const isAdmin = req.user.role === 'admin';

    try {

        if (targetType === 'Group') {

            // Check if admion granted permission to this group or not.
            if(!isAdmin(req.user)) return res.status(403).send({message: "Only admin can revoke permissions from the group."})

            const group = await groupSchema.findById(targetId);

            if(!group) res.status(403).send({message: "Group does not exist, so you may create a new group by this name."})

            // revoke permission from group
            group.permissions = group.permissions.filter((perm) => perm !== permission);

            // Remove permissions from users in this group
            const removeUserPermissions = await userSchema.findById(targetId);

            removeUserPermissions.forEach(async (user) => {
                user.permissions = user.permissions.filter((perm) => perm !== permission);
                await user.save();
            })

            await group.save();
            res.status(200).send({ message: "Permission revoked from groupd and sub-users.", group})

        } else if (targetType === "User") {

            // Check if the group have permissions to revoke and grant permissions to their users
            const user = await userSchema.findById(req.user._id).populate('Group');
            if(!user || !user.group) return res.status(403).send({message: "User is not a part of any group."});

            // Check if the user's group has the permissions granted by admin or not
            if(!user.group.permissions.includes(permission)) return res.send({message: "The group to this user does not have any permissions."});

            const userToRevoke = await userSchema.findById(targetId);
            if(!userToRevoke) return res.status(403).send({ message: "User not found to revoke the permissions."})

            // revoke permissions from the user
            userToRevoke.permissions = userToRevoke.permissions.filter((perm) => perm!== permission);

            await userToRevoke.save();
            res.status(200).send({ 
                message: "Permission revoked from user.",
                user: userToRevoke
            })
        } else {
            res.status(400).send({
            success: false,
            message: "Target type is invalid."
            })
        }

    } catch (error) {
        
        res.status(400).send({
            success: false,
            message: "Invalid request to revoke the permission.",
            error: error.message
        })

    }
    

};

const createGroup = async (req, res) => {
    const {groupName} = req.body;

    try {
    
        const group = new groupSchema({groupName});
        await group.save();

        if(!group) res.send({message: "Group not found, Please create it."})

        res.status(200).send({
            success: true,
            message: "Group created successfully",
            group
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while creating group.",
            error: error.message
        })
    }
}

const deleteGroup = async (req, res) => {

    const {groupName} = req.body;

    try {

        const group = await groupSchema.find({groupName})

        if (!group) return res.status(400).send({message: "Group does not exist, so you may create it."})

        const deletedGroup = await groupSchema.findOneAndDelete(groupName);
            res.status(200).send({message: "Group deleted successfully", deletedGroup})

    } catch (error) {

        res.status(500).send({
            success: false,
            message: "Error while deleting group.",
            error: error.message
        })
      
    }

}

const addUsers = async (req, res) => {

    const {groupName, userName} = req.body;

    try {

        const group = await groupSchema.find({groupName});
        const user = await userSchema.find({userName});

        if(!group || !user) {
            return res.status(404).send({
                success: false,
                message: "Group or user not found."
            })
        }

        group?.members?.push(user);
        user.group.groupName = group.groupName

        await group.save();
        await user.save();

        res.send({message: "User added to the group successfully."});

    } catch (error) {
     
        res.status(500).send({
            success: false,
            message: "Error while adding user to group.",
            error: error.message
        })

    }

}

const removeUsers = async (req, res) => {

    const {groupName, userName} = req.body;

    try {

        const group = await groupSchema.findOne(groupName);
        const user = await userSchema.findOne(userName);

        if(!group || !user) {
            return res.status(404).send({
                success: false,
                message: "Group or user not found."
            })
        }

        group.members.pop(user.userName);
        user.group.groupName = group.groupName

        await group.save();
        await user.save();

        res.send({message: "User removed from the group successfully."});
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while removing user from the group.",
            error: error.message
        })
    }
}

export { createGroup, deleteGroup, addUsers, removeUsers, grantPermission, revokePermission }