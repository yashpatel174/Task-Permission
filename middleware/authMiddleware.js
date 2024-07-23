import jwt from "jsonwebtoken";
import userSchema from "../model/userModel.js";

// const authMiddleware = async (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) res.send({ message: "Access denied. No token provided" });

//   try {
//     const decoded = JWT.verify(token, process.env.SECRET_KEY);
//     const user = await userSchema.findById(decoded._id).populate("group");

//     // if (user.role === "admin") return next();

//     if (!user) {
//       throw new Error();
//     }

//     req.token = token;
//     req.user = user;
//     // next();

//     if (req.user.role === "admin") {
//       return next();
//     } else {
//       res.send({ message: "Only admins has the access to this." });
//     }
//   } catch (error) {
//     res.status(401).send({
//       success: false,
//       message: "Authentication denied.",
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
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("decoded token:", decoded);

    const user = await userSchema.findOne(decoded._id).populate("group");

    if (!user) {
      throw new Error("User not found.");
    }

    req.token = token;
    req.user = user;
    console.log("decoded token:", decoded);
    console.log("Token:", token);
    console.log("User:", req.user);

    if (user?.role == "admin") {
      return next();
    } else {
      return res.status(403).send({ message: "Only admin can access." });
    }
  } catch (error) {
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

    const userPermissions = user?.permissions;
    const groupPermissions = user?.group ? user.group.permissions : [];

    if (user?.role == "admin") return next();

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
