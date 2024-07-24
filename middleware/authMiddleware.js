import jwt from "jsonwebtoken";
import userSchema from "../model/userModel.js";

// const authMiddleware = async (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).send({ message: "Token is not provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     console.log("Decoded token:", decoded);

//     const user = await userSchema.findOne(decoded._id).populate("group");

//     if (!user) {
//       throw new Error("User not found.");
//     }

//     console.log("Authenticated user:", user.userName);
//     console.log("Role in Middleware:", user.role);

//     req.token = token;
//     req.user = user;

//     if (user.role === "admin") {
//       return next();
//     } else {
//       return res.status(403).send({ message: "Only admin can access." });
//     }
//   } catch (error) {
//     console.log("Authentication error:", error.message);
//     res.status(401).send({
//       success: false,
//       message: "Please authenticate.",
//       error: error.message,
//     });
//   }
// };

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({ message: "Token is not provided." });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded Token:", decoded);

    // Retrieve the user using the decoded ID
    const user = await userSchema.findById(decoded._id).populate("group");

    if (!user) {
      return res.status(404).send({ message: "User is not found." });
    }

    // Debugging: Print user and role
    console.log("Authenticated User:", user);
    console.log("Role in Middleware:", user.role);

    req.token = token;
    req.user = user;

    if (user.role === "admin") {
      console.log("Admin access granted");
      return next(); // Admin has access to everything
    } else {
      console.log("Non-admin access denied");
      return res
        .status(403)
        .send({ message: "Only admin can access this route." });
    }
  } catch (error) {
    console.error("Authentication Error:", error.message);
    res.status(401).send({
      success: false,
      message: "Please authenticate.",
      error: error.message,
    });
  }
};

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!user) return res.send({ message: "user not authorized." });

    const userPermissions = user?.permissions;
    const groupPermissions = user?.group ? user.group.permissions : [];

    if (user.role === "admin") return next();

    if (
      userPermissions?.includes(permission) ||
      groupPermissions?.includes(permission)
    ) {
      next();
    } else {
      res.status(403).send({ message: "Permission denied" });
    }
  };
};

export { authMiddleware, checkPermission };
