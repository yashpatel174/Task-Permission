import userSchema from "../model/userModel.js";
import groupSchema from "../model/groupModel.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

// * isAdmin function

const isAdmin = (user) => {
  return user && user.role === "admin";
};

//* ================================================== Grant Permission ============================================

const grantPermission = async (req, res) => {
  const { targetId, targetType, permission } = req.body;

  try {
    if (targetType === "Group") {
      // verify as an admin
      if (!isAdmin(req.user))
        return res
          .status(403)
          .send({ message: "Only admin can access the permissions." });

      const group = await groupSchema.findById(targetId);
      console.log(group, "gggggggggggppppppppppppppp");
      if (!group) return res.status(403).send({ message: "Group not found" });

      // grant permission to group
      if (!group.permissions?.includes(permission)) {
        group.permissions.push(permission);
      }

      await group.save();
      res.status(200).send({ message: "Permission granted to group.", group });
    } else if (targetType === "User") {
      // check if the users were granted the permission
      const user = await userSchema
        .findById(targetId)
        .populate({ path: "Group", strictPopulate: false });
      if (!user || !user.group)
        return res
          .status(403)
          .send({ message: "User is not a part of any group." });

      // Check if user has permission to grant
      if (!user.group.permissions?.includes(permission))
        return res.send({
          message: "Group does not have access to the permissions.",
        });

      const userToGrant = await userSchema.findById(targetId);

      if (!userToGrant)
        return res.send({ message: "User not found to grant the permission." });
      res.status(200).send({ message: "Permission granted to user.", user });

      // Grant user to permission
      if (!userToGrant.permissions?.includes(permission)) {
        return userToGrant.permissions.push(permission);
      }

      await userToGrant.save();
      res.status(200).send({ message: "Permission granted to user.", user });
    } else {
      res.status(400).send({
        success: false,
        message: "Target type is invalid.",
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Invalid request to grant the permission.",
      error: error.message,
    });
  }
};

//* ====================================================== Revoke Permission =================================================

const revokePermission = async (req, res) => {
  const { targetId, targetType, permission } = req.body;

  try {
    if (targetType === "Group") {
      //* Check if admion granted permission to this group or not.
      if (!isAdmin(req.user))
        return res.status(403).send({
          message: "Only admin can revoke permissions from the group.",
        });

      const group = await groupSchema.findById(targetId);

      if (!group)
        res.status(403).send({
          message:
            "Group does not exist, so you may create a new group by this name.",
        });

      // //* revoke permission from group
      group.permissions = group.permissions.filter(
        (perm) => perm !== permission
        // group.permissions.rem(permission)
      );

      // //* Remove permissions from users in this group
      // const removeUserPermissions = await userSchema.findById(targetId);

      // removeUserPermissions?.forEach(async (user) => {
      //   user.permissions = user.permissions.filter(
      //     // (perm) => perm !== permission
      //     user.permissions.pop(permission)
      //   );
      //   await user.save();
      // });

      const usersInGroup = await userSchema.find({ group: targetId });

      await Promise.all(
        usersInGroup?.map(async (user) => {
          user.permissions = user.permissions.filter(
            (perm) => perm !== permission,
            user.permissions.pop(permission)
          );
          await user.save();
        })
      );

      await group.save();
      res.status(200).send({
        message: "Permission revoked from group and sub-users.",
        group,
      });
    } else if (targetType === "User") {
      //* Check if the group have permissions to revoke and grant permissions to their users
      const user = await userSchema
        .findById(req.user._id)
        .populate({ path: "Group", strictPopulate: false });
      if (!user || !user.group)
        return res
          .status(403)
          .send({ message: "User is not a part of any group." });

      //* Check if the user's group has the permissions granted by admin or not
      if (!user.group.permissions?.includes(permission))
        return res.send({
          message: "The group to this user does not have any permissions.",
        });

      const userToRevoke = await userSchema.findById(targetId);
      if (!userToRevoke)
        return res
          .status(403)
          .send({ message: "User not found to revoke the permissions." });

      //* revoke permissions from the user
      userToRevoke.permissions = userToRevoke.permissions.filter(
        (perm) => perm !== permission,
        userToRevoke.permissions.pop(permission)
      );

      await userToRevoke.save();
      res.status(200).send({
        message: "Permission revoked from user.",
        user: userToRevoke,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Target type is invalid.",
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Invalid request to revoke the permission.",
      error: error.message,
    });
  }
};

// const createGroup = async (req, res) => {
//   const { groupName, groupPassword } = req.body;

//   try {
//     const hash = bcrypt.hash(password, process.env.SALT);
//     const group = new groupSchema({ groupName, groupPassword: hash });
//     await group.save();

//     if (!group) res.send({ message: "Group not found, Please create it." });

//     res.status(200).send({
//       success: true,
//       message: "Group created successfully",
//       group,
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error while creating group.",
//       error: error.message,
//     });
//   }
// };

// const groupLogin = async (req, res) => {
//   const { groupName, password } = req.body;

//   {
//     if (!groupName || !groupPassword)
//       return res.status(400).send({
//         success: false,
//         message: "Group name and password are required.",
//       });

//     const group = await groupSchema.findOne({ groupName });

//     if (!group) return res.status(404).send({ message: "Group not found." });

//     const isMatch = await bcrypt.compare(password, group.groupPassword);

//     if (!isMatch)
//       return res.status(401).send({ message: "Invalid group password." });

//     const token = await JWT.sign({ groupName }, process.env.SECRET_KEY, {
//       expiresIn: process.env.JWT_EXPIRATION,
//     });

//     res.status(200).send({
//       success: true,
//       message: "Group login successful.",
//       group,
//     });
//   }
// };

//* ====================================================== Register Group =================================================

const createGroup = async (req, res) => {
  const { groupName, password, role } = req.body;

  if (!groupName || !password)
    return res.send({ message: "Groupname or Password is required." });

  try {
    if (groupName === null || groupName === undefined) {
      return res
        .status(400)
        .send({ message: "Groupname cannot be null or undefined." });
    }

    const existingGroup = await groupSchema.findOne({ groupName });
    if (existingGroup)
      return res.send({
        message: `Group already exists as the same name: ${existingGroup.groupName}.`,
      });

    const group = new groupSchema({ groupName, password, role });
    await group.save();

    if (!group)
      return res.status(403).send({ message: "Error while createing group." });

    res.status(200).send({
      success: true,
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while registering Group.",
      error: error.message,
    });
  }
};

//* ====================================================== Login Group =================================================

const loginGroup = async (req, res) => {
  const { groupName, password } = req.body;

  if (!groupName || !password) {
    res.status(400).send({
      success: false,
      message: "Groupname and password are required.",
    });
  }

  try {
    const group = await groupSchema.findOne({ groupName });

    // Check if user exists
    if (!group) {
      return res.status(400).send({
        success: false,
        message: "Group not registered.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, group.password);

    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Create token
    const token = JWT.sign(
      { _id: group._id, name: group.groupName, role: group.role },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );

    res.status(200).send({
      success: true,
      message: `${group.groupName} logged in successfully`,
      token: token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while logging in.",
      error: error.message,
    });
  }
};

//* ====================================================== Delete Group =================================================

const deleteGroup = async (req, res) => {
  const { groupName } = req.body;

  try {
    const group = await groupSchema.find({ groupName });

    if (!group)
      return res
        .status(400)
        .send({ message: "Group does not exist, so you may create it." });

    const deletedGroup = await groupSchema.findOneAndDelete(groupName);
    res
      .status(200)
      .send({ message: "Group deleted successfully", deletedGroup });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting group.",
      error: error.message,
    });
  }
};

//* ====================================================== Add users =================================================

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

    console.log(user, "userrrrrrrrrrrr");
    console.log(user?.group), "reerererre";

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
    console.error("Error while adding group:", error.message);
    res.status(500).send({
      success: false,
      message: "Error while adding group.",
      error: error.message,
    });
  }
};

//* ====================================================== Remove users =================================================

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

    group.members?.pop(user);
    user.group?.groupName === group?.groupName;

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

export {
  createGroup,
  loginGroup,
  deleteGroup,
  addUsers,
  removeUsers,
  grantPermission,
  revokePermission,
};
