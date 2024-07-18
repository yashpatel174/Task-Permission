import JWT from "jsonwebtoken";
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
//     next();
//   } catch (error) {
//     res.status(401).send({
//       success: false,
//       message: "Authentication denied.",
//       error: error.message,
//     });
//   }
// };

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) res.send({ message: "Token is not provided." });

  try {
    const decoded = JWT.verify(token, process.env.SECRET_KEY);
    const user = await userSchema.findById(decoded._id).populate("Group");

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const user = req.user;
    const userPermissions = user?.permissions;
    const groupPermissions = user?.group ? user.group.permissions : [];

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
