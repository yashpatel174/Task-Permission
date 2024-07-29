import jwt from "jsonwebtoken";
import userSchema from "../model/userModel.js";
import groupSchema from "../model/groupModel.js";
import mongoose from "mongoose";

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
    //* Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("Decoded Id (initial):", decoded._id);

    const id = decoded._id;
    console.log(id, "-0---------");
    // //* Retrieve the user usign aggregate
    // const userWithGroup = await userSchema.aggregate([
    //   { $match: { _id: mongoose.type?.ObjectId(id) } },
    //   {
    //     $lookup: {
    //       from: "group",
    //       localField: "group",
    //       foreignField: "_id",
    //       as: "group",
    //     },
    //   },
    // ]);

    // const user = userWithGroup[0];

    //* Retrieve the user using the decoded ID
    const user = await groupSchema.findById(id).populate("members");

    console.log(user, "uuuuuuuussssssssssssseeeeeeeeeeeeeerrrrrrrrrrrr");

    // if (!user) {
    //   return {
    //     catch(err) {
    //       res.status(404).send({
    //         message: "User is not found.",
    //         err: err.message,
    //       });
    //     },
    //   };
    // } else {
    //   return next();
    // }

    if (!user) {
      return res.status(403).send({ message: "User is not found." });
    }

    req.token = token;
    req.user = user;

    // console.log(req?.user.role, "Userrrrrrrrrrrrr Role");
    console.log(req.user.group, "User Groups");

    //* Check if the user is an admin
    if (req?.user.role.role === "admin") {
      return next(); // Admin has access to everything
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
