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
const checkPermission =
  (requiredPermission, getModuleName) => async (req, res, next) => {
    if (req.user?.role === "admin") {
      return next();
    }

    const user = req.user;
    const userGroup = user.group;
    const userId = user._id;
    const moduleName = getModuleName(req);
    console.log(user, "userrrrrrrrrrrrrrrrrrrrrrrrrrr");
    // console.log(userGroup, "user's group");

    try {
      const module = await moduleSchema.findOne({ moduleName });
      console.log(module, "module");

      if (!module) res.send({ message: "Module not exist." });

      // const moduleId = module._id;
      // console.log(moduleId, "moduleId");

      // Find the permission with the required permission and moduleId
      const permission = await permissionSchema
        .findOne({
          permissions: { $in: [requiredPermission] },
          moduleId: module._id,
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
// ************************************************************************************************

// const checkPermission =
//   (requiredPermission, getModuleName) => async (req, res, next) => {
//     if (req.user?.role === "admin") {
//       return next();
//     }

//     const user = req.user;
//     const userGroup = user.group;
//     const userId = user._id;
//     let moduleName = getModuleName(req);

//     console.log(user, "aaaaaaaaaaaaaaa");
//     console.log(userGroup, "bbbbbbbbbbbb");
//     console.log(userId, "cccccccccccccc");
//     console.log(moduleName, "dddddddddddddddd");

//     try {
//       let moduleId;

//       // If the permission is not "FindAll" or "Create", find the module ID
//       if (!["FindAll", "Create"]?.includes(requiredPermission)) {
//         moduleName = getModuleName(req);
//         const module = await moduleSchema.findOne({ moduleName });
//         if (!module) {
//           return res.status(404).send({ message: "Module not found" });
//         }
//         moduleId = module._id;
//         console.log(moduleName, "ddddddddddddddeeeeeeeeeeeee");
//       }

//       // Find the permission based on the requiredPermission and moduleId (if applicable)
//       const permissionQuery = {
//         permissions: { $in: [requiredPermission] },
//       };
//       if (moduleId) {
//         permissionQuery.moduleId = moduleId;
//       }

//       console.log(permissionQuery, "eeeeeeeeeeeeee");

//       const permission = await permissionSchema
//         .findOne(permissionQuery)
//         .populate({ path: "module", strictPopulate: false });

//       console.log(permission, "ffffffffffffffffff");

//       if (!permission)
//         return res
//           .status(403)
//           .send({ message: "You do not have access for this module" });

//       // Check for group permission
//       const gPermission = await groupPermission.findOne({
//         groupId: userGroup,
//         permission: permission._id,
//       });

//       console.log(gPermission, "ggggggggggggggg");

//       if (!gPermission)
//         return res.status(403).send({ message: "Group permission not found" });

//       // Check for user-specific permission
//       const uPermission = await userPermission.findOne({
//         userId,
//         groupPermissionId: gPermission._id,
//       });

//       console.log(uPermission, "hhhhhhhhhhhhhhhhhhhhh");

//       if (!uPermission)
//         return res
//           .status(403)
//           .send({ message: "This permission is not provided to this member" });

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

// const checkPermission =
//   (requiredPermission, getModuleName) => async (req, res, next) => {
//     if (req.user?.role === "admin") {
//       return next();
//     }

//     const user = req.user;
//     const userGroup = user.group;
//     const userId = user._id;

//     let moduleName = getModuleName(req);

//     // Log for debugging
//     console.log(user, "User");
//     console.log(userGroup, "User Group");
//     console.log(userId, "User ID");
//     console.log(moduleName, "Module Name");
//     console.log(requiredPermission, "Required Permissions");

//     try {
//       let moduleId;

//       // If the permission is "FindAll" or "Create", do not use moduleName
//       if (requiredPermission === "Create" || "FindAll") {
//         return (moduleName = null); // Skip moduleId check
//       }

//       // For other permissions, find the module ID
//       moduleName = getModuleName(req); // Ensure this correctly retrieves moduleName
//       const module = await moduleSchema.findOne({ moduleName });
//       if (!module) {
//         return res.status(404).send({ message: "Module not found" });
//       }
//       moduleId = module._id;
//       console.log(moduleName, "Module Name from DB");

//       // Prepare the permission query
//       const permissionQuery = {
//         permissions: { $in: [requiredPermission] },
//       };
//       if (moduleId) {
//         permissionQuery.moduleId = moduleId;
//       }

//       console.log(permissionQuery, "Permission Query");

//       // Find the permission
//       const permission = await permissionSchema
//         .findOne(permissionQuery)
//         .populate({ path: "module", strictPopulate: false });

//       console.log(permission, "Permission");

//       if (!permission) {
//         return res
//           .status(403)
//           .send({ message: "You do not have access for this module" });
//       }

//       // Check for group permission
//       const gPermission = await groupPermission.findOne({
//         groupId: userGroup,
//         permission: permission._id,
//       });

//       console.log(gPermission, "Group Permission");

//       if (!gPermission) {
//         return res.status(403).send({ message: "Group permission not found" });
//       }

//       // Check for user-specific permission
//       const uPermission = await userPermission.findOne({
//         userId,
//         groupPermissionId: gPermission._id,
//       });

//       console.log(uPermission, "User Permission");

//       if (!uPermission) {
//         return res
//           .status(403)
//           .send({ message: "This permission is not provided to this member" });
//       }

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
