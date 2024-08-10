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
    const existingGroup = await groupSchema.findOne({ groupName });

    if (existingGroup)
      return res.send({
        message: `${groupName} already exists, Please create with another name.`,
      });

    const group = new groupSchema({ groupName, permission });

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

const getAllGroups = async (req, res) => {
  try {
    const groups = await groupSchema.find({});
    if (!groups) return res.send({ message: "Failed listing the groups" });

    const groupList = groups?.map((group) => group.groupName);

    console.log(groupList, "aaaaaaaaaaaaaaaaaaa");

    res.status(200).send({
      success: true,
      message: `There are totel ${groupList.length} groups as you can see the list of existing groups below.`,
      groupList,
    });
  } catch (error) {
    res.send(500).send({
      success: false,
      message: "Error while getting all groups.",
      error: error.message,
    });
  }
};

const removeGroup = async (req, res) => {
  const { groupName } = req.params;

  if (!groupName)
    return res.send({
      message: "Which group you want to delete? Kindly provide the group name.",
    });

  try {
    const group = await groupSchema.findOne({ groupName });

    if (!group)
      return res.send({ message: "Any group by this name is not exist." });

    if (group.members?.length > 0)
      return res.send({
        message: "Group can not be deleted as this group Contains members.",
      });

    const removedGroup = await groupSchema.findOneAndDelete({ groupName });
    console.log(removedGroup, "0000000000000000000");

    res.status(200).send({
      success: true,
      message: `${groupName} removed successfully.`,
    });
  } catch (error) {
    res.status(500).send({
      succcess: false,
      message: "Error while removing group.",
      error: error.message,
    });
  }
};

const addUsers = async (req, res) => {
  const { groupName, userName } = req.body;

  if (!userName) {
    return res.status(400).send({ message: "Username is missing" });
  }

  if (!groupName) {
    return res.status(400).send({ message: "Groupname is missing" });
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

  if (!userName) {
    return res.status(400).send({ message: "Username is missing" });
  }

  if (!groupName) {
    return res.status(400).send({ message: "Groupname is missing" });
  }

  try {
    const group = await groupSchema.findOne({ groupName });
    const user = await userSchema.findOne({ userName });

    if (!group) return res.status(404).send({ message: "Group not found." });
    if (!user) return res.status(404).send({ message: "User not found." });

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

const gPermission = async (req, res) => {
  const { groupId } = req.params;
  const { moduleId, permissions } = req.body;

  if (
    !groupId ||
    !permissions ||
    (permissions.includes("Create") || permissions.includes("FindAll")
      ? false
      : !moduleId)
  ) {
    return res.send({ message: "Required fields are necessary." });
  }

  try {
    // * created permissions for the groups
    let prmsn;
    if (permissions.includes("Create") || permissions.includes("FindAll")) {
      prmsn = new permissionSchema({ permissions });
    } else {
      prmsn = new permissionSchema({ moduleId, permissions });
    }
    await prmsn.save();

    // prmsn = new permissionSchema({ moduleId, permissions });
    // await prmsn.save();

    const group = await groupSchema.findById(groupId);
    if (!group) return res.send({ message: "Group does not exist." });

    // * store the created permissions to the group permission.
    const gPermission = new groupPermission({
      groupId,
      permission: prmsn._id,
    });
    await gPermission.save();

    if (group.permission?.includes(gPermission)) {
      return res.send({
        message:
          "This group has already the same permission for the same module.",
      });
    }

    group.permission?.push(gPermission);
    await group.save();

    res.status(200).send({
      success: true,
      message: `Permission provided to ${group.groupName} successfully.`,
      group,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Error while Providing permissions to ${group.groupName}.`,
      error: error.message,
    });
  }
};

// const removeGroupPermission = async (req, res) => {
//   const { groupId } = req.params;
//   const { moduleId, permissions } = req.body;

//   if (!groupId || !moduleId || !permissions) {
//     return res.status(400).send({ message: "Required fields are necessary." });
//   }

//   try {
//     // Find the existing permission
//     const existPermission = await permissionSchema.findOne({
//       moduleId,
//       permissions,
//     });

//     const group = await groupSchema.findById(groupId);
//     if (!group) {
//       return res.status(404).send({ message: "Group does not exist." });
//     }

//     if (!existPermission) {
//       return res
//         .status(404)
//         .send({ message: `Permission is not provided to ${group.groupName}.` });
//     }

//     // Remove the permission
//     await permissionSchema.findOneAndDelete({ _id: existPermission._id });

//     // Find the group permission
//     const gPermission = await groupPermission.findOne({
//       groupId,
//       permission: existPermission._id,
//     });

//     if (!gPermission) {
//       return res.status(404).send({
//         message: "Group permission does not exist for this group.",
//       });
//     }

//     // Remove the group permission
//     await groupPermission.findOneAndDelete({ _id: gPermission._id });

//     // Find the group and remove the group permission from its permissions array
//     group.permission = group.permission.filter(
//       (perm) => perm.toString() !== gPermission._id.toString()
//     );

//     await group.save();

//     res.status(200).send({
//       success: true,
//       message: `Permission removed from ${group.groupName} successfully.`,
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error while removing permissions from the group.",
//       error: error.message,
//     });
//   }
// };

const removeGroupPermission = async (req, res) => {
  const { groupId } = req.params;
  const { moduleId, permissions } = req.body;

  // Ensure required fields are present
  if (!groupId || !permissions) {
    return res.status(400).send({ message: "Required fields are necessary." });
  }

  try {
    let permissionQuery = {
      permissions: { $in: permissions },
    };

    // For permissions that do not include "Create" or "FindAll", moduleId is required
    if (!permissions?.includes("Create") && !permissions?.includes("FindAll")) {
      if (!moduleId) {
        return res
          .status(400)
          .send({ message: "ModuleId is required for this permission." });
      }
      permissionQuery.moduleId = moduleId;
    }

    // Find the existing permission
    const existPermission = await permissionSchema.findOne(permissionQuery);
    if (!existPermission) {
      return res
        .status(404)
        .send({ message: "There are no permissios to remove." });
    }

    // Find the group permission
    const gPermission = await groupPermission.findOne({
      groupId,
      permission: existPermission._id,
    });

    if (!gPermission) {
      return res.status(404).send({
        message: "Group permission does not exist for this group.",
      });
    }

    // Remove the permission
    await permissionSchema.findOneAndDelete({ _id: existPermission._id });

    // Remove the group permission
    await groupPermission.findOneAndDelete({ _id: gPermission._id });

    // Find the group and remove the group permission from its permissions array
    const group = await groupSchema.findById(groupId);
    if (!group) {
      return res.status(404).send({ message: "Group does not exist." });
    }

    group.permission = group.permission.filter(
      (perm) => perm.toString() !== gPermission._id.toString()
    );

    await group.save();

    res.status(200).send({
      success: true,
      message: `Permission removed from ${group.groupName} successfully.`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while removing permissions from the group.",
      error: error.message,
    });
  }
};

const uPermission = async (req, res) => {
  const { userId, groupPermissionId } = req.body;

  if (!userId || !groupPermissionId)
    return res.send({ message: " Required fields are mendatory." });

  try {
    //* Finding group permission
    const gPermission = await groupPermission.findById(groupPermissionId);
    // console.log(gPermission, "aaaaaaaaaaaaaaa");

    if (!gPermission) {
      return res
        .status(404)
        .send({ message: "Group permission is not exist." });
    }

    //* Finding user
    const user = await userSchema.findById(userId);
    // console.log(user, "bbbbbbbbbbbbbbbbbbbb");
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    //* Comparing group of group permissions with group of user
    const userGroups = user.group.map((group) => group.toString());
    const gId = gPermission.groupId.toString();

    // console.log(userGroups, "cccccccccccccccccccc");
    // console.log(gId, "dddddddddddddddddddd");

    if (!userGroups.includes(gId)) {
      return res
        .status(400)
        .send({ message: "This user is not a member of this group." });
    }

    if (user?.role === "admin") {
      return res.send({
        message:
          "You are providing permissions to admin, please verify the user before providing permission.",
      });
    }

    //* Create user permission
    const uPermission = new userPermission({ userId, groupPermissionId });
    await uPermission.save();
    // console.log(uPermission, "eeeeeeeeeeeeeeeeeeeeeeeeee");

    if (!user.permission?.includes(groupPermissionId)) {
      //* providing permissions to the user.
      user.permission?.push(groupPermissionId);
    }
    await user.save();

    res.status(200).send({
      success: true,
      message: `Permission provided to ${user.userName} successfully.`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while providing permissions to user.",
      error: error.message,
    });
  }
};

const removeUserPermission = async (req, res) => {
  const { userId, groupPermissionId } = req.body;

  if (!userId || !groupPermissionId) {
    return res.status(400).send({ message: "Required fields are necessary." });
  }

  try {
    // Finding group permission
    const gPermission = await groupPermission.findById(groupPermissionId);
    if (!gPermission) {
      return res
        .status(404)
        .send({ message: "Group permission does not exist." });
    }

    // Finding user
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Comparing group of group permissions with group of user
    const userGroups = user.group.map((group) => group.toString());
    const gId = gPermission.groupId.toString();

    if (!userGroups.includes(gId)) {
      return res
        .status(400)
        .send({ message: "This user is not a member of this group." });
    }

    if (user?.role === "admin") {
      return res.send({
        message:
          "You are removing permissions from admin, please verify the user before removing permission.",
      });
    }

    // Remove the user permission
    const uPermission = await userPermission.findOneAndDelete({
      userId: userId,
      groupPermissionId: groupPermissionId,
    });

    if (!uPermission) {
      return res
        .status(404)
        .send({ message: "User permission does not exist." });
    }

    // Remove the user permission from the user's permissions array
    user.permission = user.permission.filter(
      (perm) => perm.toString() !== groupPermissionId.toString()
    );

    await user.save();

    res.status(200).send({
      success: true,
      message: `Permission removed from ${user.userName} successfully.`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while removing permissions from the user.",
      error: error.message,
    });
  }
};

export {
  createGroup,
  getAllGroups,
  removeGroup,
  addUsers,
  removeUsers,
  gPermission,
  uPermission,
  removeGroupPermission,
  removeUserPermission,
};
