import jwt from "jsonwebtoken";
import userSchema from "../model/userSchema.js";
import permissionSchema from "../model/permissionSchema.js";
import userPermission from "../model/userPermission.js";
import groupPermission from "../model/groupPermission.js";
import moduleSchema from "../model/moduleSchema.js";

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

// ************************************************************************************************
// const checkPermission =
//   (requiredPermission, getModuleName) => async (req, res, next) => {
//     if (req.user?.role === "admin") {
//       return next();
//     }

//     const user = req.user;
//     const userGroup = user.group;
//     const userId = user._id;
//     const moduleName = getModuleName(req);
//     console.log(user, "userrrrrrrrrrrrrrrrrrrrrrrrrrr");
//     // console.log(userGroup, "user's group");

//     try {
//       const module = await moduleSchema.findOne({ moduleName });
//       console.log(module, "module");

//       if (!module)
//         res.send({
//           message: "You do not have the permission for this module.",
//         });

//       // const moduleId = module._id;
//       // console.log(moduleId, "moduleId");

//       // Find the permission with the required permission and moduleId
//       const permission = await permissionSchema
//         .findOne({
//           permissions: { $in: [requiredPermission] },
//           moduleId: module._id,
//         })
//         .populate({ path: "module", strictPopulate: false });

//       console.log(permission, "permission");

//       if (!permission)
//         return res
//           .status(403)
//           .send({ message: "This permission is not provided to this module." });

//       let prmsn = [];

//       // Check for group permission
//       const gPermission = await groupPermission.findOne({
//         groupId: userGroup,
//         permission: permission,
//       });

//       if (!gPermission)
//         return res.send({
//           message: `Permission is not provided to this group.`,
//         });

//       const uPermission = await userPermission.findOne({
//         userId,
//         groupPermissionId: gPermission,
//       });

//       if (!uPermission)
//         return res.send({
//           message: `Permission is not provided to this user.`,
//         });

//       prmsn.push(gPermission);

//       console.log(prmsn, "ppppppppppppppppppppppppppp");

//       console.log(permission, "Permission");
//       console.log(userGroup, "Group");
//       console.log(gPermission, "Group Permission");
//       console.log(userId, "User");

//       if (prmsn.length < 1)
//         return res.status(403).send({
//           message:
//             "Permission does not match or the member does not belong to this group",
//         });

//       next();
//     } catch (error) {
//       console.error("Error while checking permissions:", error);
//       res.status(500).send({
//         success: false,
//         message: "Error while checking permissions",
//         error: error.message,
//       });
//     }
//   };
// ************************************************************************************************

const checkPermission =
  (requiredPermission, getModuleName) => async (req, res, next) => {
    if (req.user?.role === "admin") {
      return next();
    }

    const user = req.user;
    const userGroup = user.group;
    const userId = user._id;

    let moduleName = getModuleName(req);

    // Log for debugging
    console.log(user, "User");
    console.log(userGroup, "User Group");
    console.log(userId, "User ID");
    console.log(moduleName, "Module Name");
    console.log(requiredPermission, "Required Permissions");

    try {
      let moduleId;

      // For "FindAll" and "Create", bypass moduleId check but ensure permission exists
      if (requiredPermission !== "FindAll" && requiredPermission !== "Create") {
        const module = await moduleSchema.findOne({ moduleName });
        if (!module) {
          return res.status(404).send({ message: "Module not found" });
        }
        moduleId = module._id;
        console.log(moduleName, "Module Name from DB");
      }

      // Prepare the permission query
      const permissionQuery = {
        permissions: { $in: [requiredPermission] },
      };
      if (moduleId) {
        permissionQuery.moduleId = moduleId;
      }

      console.log(permissionQuery, "Permission Query");

      // Find the permission
      const permission = await permissionSchema
        .findOne(permissionQuery)
        .populate({ path: "module", strictPopulate: false });

      console.log(permission, "Permission");

      if (!permission) {
        return res
          .status(403)
          .send({ message: "You do not have access for this module" });
      }

      // Check for group permission
      const gPermission = await groupPermission.findOne({
        groupId: userGroup,
        permission: permission._id,
      });

      console.log(gPermission, "Group Permission");

      if (!gPermission) {
        return res.status(403).send({ message: "Group permission not found" });
      }

      // Check for user-specific permission
      const uPermission = await userPermission.findOne({
        userId,
        groupPermissionId: gPermission._id,
      });

      console.log(uPermission, "User Permission");

      if (!uPermission) {
        return res
          .status(403)
          .send({ message: "This permission is not provided to this member" });
      }

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

// const checkPermission = (requiredPermission) => async (req, res, next) => {
//   const user = req.user;

//   try {
//     const permission = await permissionSchema.findOne({
//       permissions: requiredPermission,
//     });

//     console.log(permission, "aaaaaaaaaaaaaaaaaaa");

//     if (!permission) {
//       return res.send({ message: "Permission is not exist." });
//     }

//     const gPermission = await groupPermission.findOne({
//       permission,
//       groupId: user.group,
//     });

//     console.log(gPermission, "00000000000000000000000");

//     if (!gPermission)
//       return res.send({ message: "Permission is not provided to this group." });

//     if (requiredPermission?.includes("Create" || "FindAll")) {
//       return next();
//     }

//     if (requiredPermission?.includes("FindOne" || "Update" || "Delete")) {
//       const module = permission.moduleId;
//       console.log(
//         module,
//         "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
//       );
//       return next();
//     }
//     next();
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error while checking permissions.",
//       error: error.message,
//     });
//   }
// };

const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  } else {
    return res
      .status(403)
      .send({ message: "Only admin can access this route." });
  }
};

export { authMiddleware, checkPermission, isAdmin };
