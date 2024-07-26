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
    // console.log("Decoded Id (initial):", decoded._id);

    const id = decoded._id;

    // Retrieve the user using the decoded ID
    const user = await userSchema
      .findById(id)
      .populate({ path: "group", strictPopulate: false });
    // console.log("Decoded Id (after):", decoded._id);
    // console.log(user, "uuuuuuuussssssssssssseeeeeeeeeeeeeerrrrrrrrrrrr");

    if (!user) {
      return res.status(404).send({ message: "User is not found." });
    }

    req.token = token;
    req.user = user;

    //* Check if the user is an admin
    if (user.role === "admin") {
      return next(); // Admin has access to everything
    } else {
      return res.status(403).send({
        message: "Only admin can access this route.",
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

// With the below code, I can get only users, not groups -
// const user = await userSchema
//       .findById(id)
//       .populate({ path: "Group", strictPopulate: false });
//     console.log("Decoded Id (after):", decoded._id);
//     console.log(user, "uuuuuuuussssssssssssseeeeeeeeeeeeeerrrrrrrrrrrr");

// And with the below code, I can get only groups, not users -
// const user = await userSchema
//       .find({id})
//       .populate({ path: "Group", strictPopulate: false });
//     console.log("Decoded Id (after):", decoded._id);
//     console.log(user, "uuuuuuuussssssssssssseeeeeeeeeeeeeerrrrrrrrrrrr");

// Kindly resolve the above error so that both the user and ground would be fetched using a single query.
