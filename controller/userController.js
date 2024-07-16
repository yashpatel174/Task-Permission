import userSchema from '../model/userModel.js';
import groupSchema from "../model/groupModel.js"

const createGroup = async () => {
    const {groupName} = req.body;

    try {
    
        const group = groupSchema(groupName);
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

    const {groupname} = req.body;

    try {

        // check if the users exist in group
        const usersInGroup = await groupSchema.find(groupname, {members: {$exists: true}});

        const group = await groupSchema.find(groupname)

        if (!group) return res.status(400).send({message: "Group does not exist, so you may create it."})

        if(usersInGroup) {
            return res.status(400).send({message: "Group contains users, cannot delete."})
        } else {
            const deleteGroup = await groupSchema.findOneAndDelete(groupname);
            res.status(200).send({message: "Group deleted successfully."})
        }

    } catch (error) {

        res.status(500).send({
            success: false,
            message: "Error while deleting group.",
            error: error.message
        })
      
    }

}

const addUsers = async (req, res) => {

    const {groupname, username} = req.body;

    try {

        const group = await groupSchema.findOne(groupname);
        const user = await userSchema.findOne(username);

        if(!group || !user) {
            return res.status(404).send({
                success: false,
                message: "Group or user not found."
            })
        }

        group.members.push(user.username);
        user.group.groupname = group.groupname

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

    const {groupname, username} = req.body;

    try {

        const group = await groupSchema.findOne(groupname);
        const user = await userSchema.findOne(username);

        if(!group || !user) {
            return res.status(404).send({
                success: false,
                message: "Group or user not found."
            })
        }

        group.members.pop(user.username);
        user.group.groupname = group.groupname

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

export { createGroup, deleteGroup, addUsers, removeUsers }