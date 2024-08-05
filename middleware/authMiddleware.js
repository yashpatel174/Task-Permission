import jwt from "jsonwebtoken";
import userSchema from "../model/userSchema.js";
import permissionSchema from "../model/permissionSchema.js";
import userPermission from "../model/userPermission.js";
import groupPermission from "../model/groupPermission.js";
import moduleSchema from "../model/moduleSchema.js";
import mongoose from "mongoose";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({ message: "Token is not provided." });
  }

  try {
    //* Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    //* Retrieve the user using the decoded ID
    const user = await userSchema.findById(decoded._id);

    if (!user) {
      return res.status(403).send({ message: "User is not found." });
    }

    req.token = token;
    req.user = user;

    if (req.user?.role === "admin") {
      return next();
    }

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    res.status(401).send({
      success: false,
      message: "Error while authentication.",
      error: error.message,
    });
  }
};

// const checkPermission =
//   (requiredPermissions, moduleId) => async (req, res, next) => {
//     try {
//       if (req.user?.role === "admin") {
//         return next();
//       }
//       const userPermissions = await userPermission
//         .findOne({ userId: req.user._id })
//         .populate("permission");

//       console.log(userPermissions, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

//       const groupPermissions = await groupPermission
//         .findOne({ groupId: req.user.group._id })
//         .populate("permission");

//       console.log(groupPermissions, "bbbbbbbbbbbbbbbbbbbbbbbbbbbbb");

//       let permissions = [];

//       if (userPermissions && userPermissions.permission) {
//         const userPermission = await permissionSchema.findById(
//           userPermissions.permission
//         );
//         permissions = permissions.concat(userPermission.permissions);
//       }

//       if (groupPermissions && groupPermissions.permission) {
//         const groupPermission = await permissionSchema.findById(
//           groupPermissions.permission
//         );
//         permissions = permissions.concat(groupPermission.permissions);
//       }

//       if (!permissions.length) {
//         return res.status(403).send({ error: "Access denied." });
//       }

//       // const permission = await permissionSchema
//       //   .findById(userPermission.permission)
//       //   .populate(moduleId);

//       // if (permission.moduleId.toString() !== moduleId.toString()) {
//       //   return res.send({ message: "Access denied as module is not matched." });
//       // }

//       const hasPermission = requiredPermissions.every((permission) =>
//         permissions?.includes(permission)
//       );

//       if (!hasPermission)
//         return res.send({
//           message: "Access denied as this user has already the permission.",
//         });
//     } catch (error) {
//       res.status(500).send({
//         success: false,
//         message: "Error while checking permissions.",
//         error: error.message,
//       });
//     }
//   };

// const checkPermission =
//   (requiredPermissions, moduleId) => async (req, res, next) => {
//     try {
//       const group = req.user.group;
//       if (req.user?.role === "admin") {
//         return next();
//       }
//       const userPermissions = await userPermission
//         .findOne({ userId: req.user._id })
//         .populate({ path: "permission", strictPopulate: false });

//       console.log(userPermissions, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

//       // Fetch group permissions
//       const groupPermissions = await groupPermission
//         .find({ groupId: { $in: group } })
//         .populate({
//           path: "permission",
//           match: { id: moduleId },
//         });

//       // const groupPermissions = await groupPermission
//       //   .find({ groupId: group })
//       //   .populate({ path: "permission", strictPopulate: false });

//       console.log(groupPermissions, "bbbbbbbbbbbbbbbbbbbbbbbbbbbbb");

//       let permissions = [];

//       if (userPermissions && userPermissions.groupPermissionId) {
//         const uPermission = await groupPermission.find({
//           requiredPermissions,
//         });
//         console.log(requiredPermissions, "bbbbbbbbbbbbbbcccccccccc");
//         const permission = permissions?.push(uPermission);
//         console.log(uPermission, "cccccccccccccccccccc");
//         console.log(permission, "dddddddddddddddddddd");
//       }
//       if (groupPermissions && groupPermissions.permission) {
//         const gPermission = await permissionSchema.findById(
//           groupPermissions.permission
//         );
//         permissions = permissions.concat(gPermission.permissions);
//       }

//       if (!permissions.length) {
//         return res.status(403).send({ error: "Access denied." });
//       }

//       // const permission = await permissionSchema
//       //   .findById(userPermission.permission)
//       //   .populate(moduleId);

//       // if (permission.moduleId.toString() !== moduleId.toString()) {
//       //   return res.send({ message: "Access denied as module is not matched." });
//       // }

//       const hasPermission = requiredPermissions.every((permission) =>
//         permissions?.includes(permission)
//       );

//       if (!hasPermission) return next();
//     } catch (error) {
//       res.status(500).send({
//         success: false,
//         message: "Error while checking permissions.",
//         error: error.message,
//       });
//     }
//   };

// const checkPermission = (requiredPermission, moduleId) => {
//   return async (req, res, next) => {
//     try {
//       const userId = req.user._id; // Assumes user is set in req.user by auth middleware
//       const moduleId = req.body.moduleId; // Assuming moduleId is sent in the request body if needed

//       if (req.user?.role === "admin") return next();

//       // Fetch user permissions
//       const userPermissions = await userPermission
//         .findOne({ userId })
//         .populate({
//           path: "groupPermissionId",
//           populate: {
//             path: "permission",
//             match: moduleId ? { moduleId } : "ModuleId is not matched.",
//           },
//         });

//       if (!userPermissions) {
//         return res.status(403).json({ message: "User permissions not found" });
//       }

//       console.log(
//         userPermissions.groupPermissionId,
//         "aaaaaaaaaaaaaaaaaaaaaaaaaaa"
//       );

//       // const user = await userSchema.findOne({ _id: userId }).populate({
//       //   path: "permission",
//       //   populate: {
//       //     path: "permission",
//       //     match: moduleId ? { moduleId } : "ModuleId is not matched.",
//       //   },
//       // });

//       // if (!user) {
//       //   return res.status(403).json({ message: "User permissions not found" });
//       // }

//       // // Collect permissions from user-specific permissions
//       // if (user.permission?.includes(requiredPermission)) {
//       //   return next();
//       // }
//       // console.log(user, "aaaaaaaaaaaaaaaaaaaaaaaaaaa");
//       // If no permissions match, deny access
//       return res.status(403).json({ message: "Permission denied" });
//     } catch (error) {
//       console.error("Error checking permissions:", error.message);
//       return res
//         .status(500)
//         .json({ message: "Internal server error", error: error.message });
//     }
//   };
// };

// const checkPermission =
//   (requiredPermission, moduleId) => async (req, res, next) => {
//     const user = req.user;

//     try {
//       console.log("Required Permission:", requiredPermission);
//       console.log("Module ID:", moduleId);

//       const permission = await permissionSchema
//         .findOne({
//           permissions: { $in: [requiredPermission] },
//           moduleId: new mongoose.Types.ObjectId(moduleId),
//         })
//         .populate({ path: "module", strictPopulate: false });
//       console.log(permission, "Retrieved Permission");

//       if (!permission) return res.send({ message: "Invalid Permission" });

//       const gPermission = await groupPermission.findOne({ permission });
//       console.log(gPermission, "gggggggggggggggggggggggggg");

//       if (!gPermission)
//         return res.send({
//           message: "Permission does not match",
//         });

//       const user = await userSchema.findOne({ permission: gPermission });
//       console.log(user, "uuuuuuuuuuuuuuuuuuuuu");
//       if (!user.includes(gPermission)) {
//         return res.send({ message: "This user does not belong to the group." });
//       }
//       next();
//     } catch (error) {
//       res.status(500).send({
//         success: false,
//         message: "Error while checking permissions",
//         error: error.message,
//       });
//     }
//   };

const checkPermission =
  (requiredPermission, getModuleName) => async (req, res, next) => {
    if (req.uesr?.role === "admin") return next();

    const user = req.user;
    const userGroup = user.group;
    const userId = user._id;
    const moduleName = getModuleName(req);
    // console.log(userId, "user Id");
    // console.log(userGroup, "user's group");

    try {
      const module = await moduleSchema.findOne({ moduleName });
      // console.log(module, "module");

      if (!module) res.send({ message: "module not found" });

      const moduleId = module._id;
      // console.log(moduleId, "moduleId");

      // Find the permission with the required permission and moduleId
      const permission = await permissionSchema
        .findOne({
          permissions: { $in: [requiredPermission] },
          moduleId,
        })
        .populate({ path: "module", strictPopulate: false });

      console.log(permission, "permission");

      if (!permission)
        return res
          .status(403)
          .send({ message: "You do not have access for this module" });

      let prmsn = [];

      // Check for group permission
      const gPermission = await groupPermission.findOne({
        groupId: userGroup,
        permission: permission,
      });

      const uPermission = await userPermission.findOne({
        userId,
        groupPermissionId: gPermission,
      });

      prmsn.push(gPermission);

      console.log(prmsn, "ppppppppppppppppppppppppppp");

      console.log(permission, "Permission");
      console.log(userGroup, "Group");
      console.log(gPermission, "Group Permission");
      console.log(userId, "User");

      if (prmsn.length < 1)
        return res.status(403).send({
          message:
            "Permission does not match or the member does not belong to this group",
        });

      if (!uPermission)
        return res.send({
          message: "This permission is not provided to this member.",
        });

      next();
    } catch (error) {
      console.error("Error while checking permissions:", error);
      res.status(500).send({
        success: false,
        message: "Error while checking permissions",
        error: error.message,
      });
    }
  };

export { authMiddleware, checkPermission };

// console.log(user.userName, "Userrrrrrrrrrrrr");
// console.log(userGroup, "user's group");
// console.log(permission, "permission Id");
// console.log(gPermission), "group permission Id";
// console.log(user.permission, "user's group permissions id");
