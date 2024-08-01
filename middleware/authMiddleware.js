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
  // console.log(token);

  try {
    //* Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    //* Retrieve the user using the decoded ID
    const user = await userSchema.findById(decoded._id);

    // console.log(user, "uuuuuuuussssssssssssseeeeeeeeeeeeeerrrrrrrrrrrr");

    if (!user) {
      return res.status(403).send({ message: "User is not found." });
    }

    req.token = token;
    req.user = user;

    console.log("Role:", req.user.role);

    // //* Check if the user is an admin
    // if (req.user?.role === "user") {
    //   return res.status(403).send({
    //     message: "Authenticated to admin only.",
    //   });
    // }

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

//       const groupPermissions = await groupPermission
//         .find({ groupId: group })
//         .populate({ path: "permission", strictPopulate: false });

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
//       console.log(group, "topppppp");

//       // If user is admin, grant access
//       if (req.user?.role === "admin") {
//         return next();
//       }

//       // Fetch user permissions
//       const userPermissions = await userPermission
//         .find({
//           userId: req.user._id,
//         })
//         .populate({
//           path: "groupPermissionId",
//           populate: {
//             path: "permission",
//           },
//         });
//       console.log(userPermissions, "uuuuuuuuuppppppppppppppp");

//       // Fetch group permissions
//       const groupPermissions = await groupPermission
//         .find({
//           groupId: { $in: group },
//         })
//         .populate({
//           path: "permission",
//         });
//       console.log(groupPermissions, "gggggggggggggpppppppppppppp");

//       // let permissions = [];

//       // // Collect user-specific permissions
//       // if (userPermissions && userPermissions.groupPermissionId) {
//       //   userPermission.groupPermissionId.forEach((groupPermission) => {
//       //     groupPermission.permission.forEach((permission) => {
//       //       permissions.push(...permission.requiredPermissions);
//       //     });
//       //   });
//       // }
//       // console.log(userPermissions, "aaaaaaaaaaaaaa");
//       // console.log(userPermissions.groupPermission, "bbbbbbbbbbbbbbbbb");
//       // console.log(groupPermissions.permission, "ccccccccccc");
//       // console.log(permissions, "dddddddddddddddddd");

//       // // Collect group permissions
//       // groupPermissions.forEach((groupPermission) => {
//       //   groupPermission.permission.forEach((permission) => {
//       //     permissions.push(...permission.permissions);
//       //   });
//       // });

//       // Collect user-specific permissions
//       const userPermissionsList =
//         userPermissions.groupPermissionId?.flatMap((groupPermission) =>
//           groupPermission.permission.flatMap(
//             (permission) => permission.permissions
//           )
//         ) || [];

//       // Collect group permissions
//       const groupPermissionsList =
//         groupPermissions.flatMap((groupPermission) =>
//           groupPermission.permission.flatMap(
//             (permission) => permission.permissions
//           )
//         ) || [];

//       console.log(userPermissions, "aaaaaaaaaaaaaa");
//       console.log(userPermissions.groupPermissionId, "bbbbbbbbbbbbbbbbb");
//       console.log(userPermissionsList, "ccccccccccc");
//       console.log(groupPermissions, "dddddddddddddddddd");
//       console.log(groupPermissionsList, "eeeeeeeeeeeee");

//       // Combine all permissions
//       const permissions = [...userPermissionsList, ...groupPermissionsList];

//       console.log(permissions, "ffffffffffff");

//       // Check if the user has the required permissions
//       if (permissions.includes(requiredPermissions)) {
//         return next();
//       }
//       // // If no permissions match, deny access
//       // return res.status(403).json({ message: "Permission denied" });
//       next();
//     } catch (error) {
//       console.error("Error verifying permissions:", error.message);
//       return res
//         .status(500)
//         .json({ message: "Internal server error", error: error.message });
//     }
//   };

const checkPermission = (requiredPermission, moduleId) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id; // Assumes user is set in req.user by auth middleware
      const moduleId = req.body.moduleId; // Assuming moduleId is sent in the request body if needed

      // Fetch user permissions
      const userPermissions = await userPermission
        .findOne({ userId })
        .populate({
          path: "groupPermissionId",
          populate: {
            path: "permission",
            match: moduleId ? { moduleId } : "ModuleId is not matched.",
          },
        });

      if (!userPermissions) {
        return res.status(403).json({ message: "User permissions not found" });
      }

      // Collect permissions from user-specific permissions
      const userPermissionList = userPermissions.groupPermissionId?.flatMap(
        (groupPermission) =>
          groupPermission.permission?.flatMap(
            (permission) => permission.permissions
          )
      );

      console.log(userPermissions, "aaaaaaaaaaaaaa");
      console.log(userPermissions.groupPermissionId, "bbbbbbbbbbbbbbbbb");
      console.log(groupPermission, "ccccccccccc");

      // Check if the user has the required permission
      if (userPermissionList.includes(requiredPermission)) {
        return next();
      }

      // If no permissions match, deny access
      return res.status(403).json({ message: "Permission denied" });
    } catch (error) {
      console.error("Error checking permissions:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };
};

export { authMiddleware, checkPermission };
