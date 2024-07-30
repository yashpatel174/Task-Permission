import groupSchema from "../model/groupSchema.js";
import userSchema from "../model/userSchema.js";
import permissionSchema from "../model/permissionSchema.js";
import groupPermission from "../model/groupPermission.js";
import userPermission from "../model/userPermission.js";
// Create Group
const createGroup = async (req, res) => {
  const { groupName, permission } = req.body;
  if (!groupName) return res.send({ mesasge: "Groupname is required" });

  try {
    const group = groupSchema({ groupName, permission });

    if (!group) return res.send({ message: "Failed creating group." });

    await group.save();

    res.status(200).send({
      success: true,
      message: "Group created successfully.",
      group,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while creating group.",
      error: error.message,
    });
  }
};

const addUsers = async (req, res) => {
  const { groupName, userName } = req.body;

  if (!userName || !groupName) {
    return res
      .status(400)
      .send({ message: "Username and group name are required." });
  }

  try {
    // Find the user and group by their names
    const user = await userSchema.findOne({ userName });
    const group = await groupSchema.findOne({ groupName });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    if (!group) {
      return res.status(404).send({ message: "Group not found." });
    }

    // Add user to group's members array if not already present
    if (!group.members?.includes(user._id.toString())) {
      group.members?.push(user._id.toString());
    }

    // Add group to User's groups array if not already present
    if (!user.group?.includes(group._id.toString())) {
      user.group?.push(group._id.toString());
    }

    await user.save();
    await group.save();

    res.status(200).send({
      success: true,
      message: `${user.userName} added into ${group.groupName} successfully.`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while adding group.",
      error: error.message,
    });
  }
};

const removeUsers = async (req, res) => {
  const { groupName, userName } = req.body;

  try {
    const group = await groupSchema.findOne({ groupName });
    const user = await userSchema.findOne({ userName });

    if (!group || !user) {
      return res.status(404).send({
        success: false,
        message: "Something is missing.",
      });
    }

    if (group.members?.includes(user._id.toString())) {
      group.members?.remove(user._id.toString());
    }

    // Add group to User's groups array if not already present
    if (user.group?.includes(group._id.toString())) {
      user.group?.remove(group._id.toString());
    }

    await group.save();
    await user.save();

    res.send({
      message: `${user.userName} removed from the ${group.groupName} successfully.`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while removing user from the group.",
      error: error.message,
    });
  }
};

// const permissionToGroup = async (req, res) => {
//   const { groupId, moduleId, permissions } = req.body;

//   if (!groupId || !moduleId || !permissions)
//     return res.send({ message: "required fields are necessary." });

//   try {
//     const permission = new permissionSchema({ permissions, moduleId });
//     await permission.save();

//     const groupPermission = new groupPermission({
//       groupId,
//       permission: permission._id,
//     });
//     await groupPermission.save();

//     const group = groupSchema.findById({ groupId });
//     if (!group) return res.send({ message: "Group does not exist." });

//     const match = (group.permission = groupPermission._id);
//     console.log(match, "Verifying group while providing permissions.");

//     await group.save();

//     res.status(200).send({
//       success: true,
//       message: "Permission added to group successfully.",
//       groupPermission,
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error while Providing permissions to the group.",
//       error: error.message,
//     });
//   }
// };

// const permissionToUser = async (req, res) => {
//   const { userId, groupPermissionId } = req.body;

//   if (!userId || !groupPermissionId)
//     return res.send({ message: " Required fields are mendatory." });

//   try {
//     const userPermissions = new userPermission({
//       userId,
//       permission: groupPermissionId,
//     });
//     await userPermissions.save();

//     const user = userSchema.findById(userId);
//     user.permission = groupPermissionId;
//     await user.save();

//     if (!userPermissions || !user)
//       return res, send({ message: "Permissions or user not found." });

//     res.status(200).send({
//       success: true,
//       message: "Permission provided to user successfully.",
//       userPermissions,
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error while providing permissions to user.",
//       error: error.message,
//     });
//   }
// };

const permissionToGroup = async (req, res) => {
  const { groupId, permissions } = req.body;

  if (!groupId || !permissions)
    return res.send({ message: "required fields are necessary." });

  try {
    const permission = permissionSchema.findOne({ permissions });
    console.log();

    const groupPermissions = new groupPermission({
      groupId,
      permission: permissions,
    });

    if (groupPermissions) {
      return groupPermission.groupId?.push(permission);
    }

    await groupPermissions.save();

    const group = groupSchema.findById({ groupId });
    if (!group) return res.send({ message: "Group does not exist." });

    const match = (group.permission = groupPermission._id);
    console.log(match, "Verifying group while providing permissions.");

    await group.save();

    res.status(200).send({
      success: true,
      message: "Permission added to group successfully.",
      groupPermission,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while Providing permissions to the group.",
      error: error.message,
    });
  }
};

const permissionToUser = async (req, res) => {
  const { userId, groupPermissionId } = req.body;

  if (!userId || !groupPermissionId)
    return res.send({ message: " Required fields are mendatory." });

  try {
    const userPermissions = new userPermission({
      userId,
      permission: groupPermissionId,
    });
    await userPermissions.save();

    const user = userSchema.findById(userId);
    user.permission = groupPermissionId;
    await user.save();

    if (!userPermissions || !user)
      return res, send({ message: "Permissions or user not found." });

    res.status(200).send({
      success: true,
      message: "Permission provided to user successfully.",
      userPermissions,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while providing permissions to user.",
      error: error.message,
    });
  }
};

export {
  createGroup,
  addUsers,
  removeUsers,
  permissionToGroup,
  permissionToUser,
};
