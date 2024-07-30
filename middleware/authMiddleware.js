import jwt from "jsonwebtoken";
import userSchema from "../model/userSchema.js";
import permissionSchema from "../model/permissionSchema.js";
import userPermission from "../model/userPermission.js";
import groupPermission from "../model/groupPermission.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({ message: "Token is not provided." });
  }
  console.log(token);

  try {
    //* Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const id = decoded._id;
    console.log(id, "-0---------");

    //* Retrieve the user using the decoded ID
    const user = await userSchema.find({ id });

    console.log(user, "uuuuuuuussssssssssssseeeeeeeeeeeeeerrrrrrrrrrrr");

    if (!user) {
      return res.status(403).send({ message: "User is not found." });
    }

    req.token = token;
    req.user = user;

    console.log(req.user.group, "User Groups");

    //* Check if the user is an admin
    if (req.user?.role === "admin") {
      return next();
    } else {
      return res.status(403).send({
        message: "Authenticated to admin only.",
      });
    }
  } catch (error) {
    console.error("Authentication Error:", error.message);
    res.status(401).send({
      success: false,
      message: "Error while authentication.",
      error: error.message,
    });
  }
};

const checkPermission =
  (requiredPermissions, moduleId) => async (req, res, next) => {
    try {
      const userPermissions = await userPermission
        .findOne({ userId: req.user._id })
        .populate("permission");

      const groupPermissions = await groupPermission
        .findOne({ groupId: req.user.group._id })
        .populate("permission");

      let permissions = [];

      if (userPermissions && userPermissions.permission) {
        const userPermission = await permissionSchema.findById(
          userPermissions.permission
        );
        permissions = permissions.concat(userPermission.permissions);
      }

      if (groupPermissions && groupPermissions.permission) {
        const groupPermission = await permissionSchema.findById(
          groupPermissions.permission
        );
        permissions = permissions.concat(groupPermission.permissions);
      }

      if (!permissions.length) {
        return res.status(403).send({ error: "Access denied." });
      }

      // const permission = await permissionSchema
      //   .findById(userPermission.permission)
      //   .populate(moduleId);

      // if (permission.moduleId.toString() !== moduleId.toString()) {
      //   return res.send({ message: "Access denied as module is not matched." });
      // }

      const hasPermission = requiredPermissions.every((permission) =>
        permissions?.includes(permission)
      );

      if (!hasPermission)
        return res.send({
          message: "Access denied as this user has already the permission.",
        });
    } catch (error) {}
  };

export { authMiddleware, checkPermission };
