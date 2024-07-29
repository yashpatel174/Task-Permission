import userSchema from "../model/userModel.js";
import groupSchema from "../model/groupModel.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//* ============================================= user register =============================================

// const register = async (req, res) => {
//   const { userName, password, role } = req.body;

//   if (!userName || !password)
//     return res
//       .status(400)
//       .send({ message: "Username and Password are required." });

//   try {
//     const existingUser = await userSchema.findOne({ userName });
//     if (existingUser) {
//       return res.status(409).send({
//         message: `User already exists with the same name: ${existingUser.userName}.`,
//       });
//     }

//     const user = new userSchema({ userName, password, role });
//     await user.save();

//     console.log(user.role, "roleeeeeeeeeeleeeeeeeeeee");

//     if (!user) {
//       return res.status(403).send({ message: "User not created." });
//     }

//     res.status(201).send({
//       success: true,
//       message: "User created successfully",
//       user,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send({
//       success: false,
//       message: "Error while registering user.",
//       error: error.message,
//     });
//   }
// };

//* ============================================= user login =============================================

// const register = async (req, res) => {
//   const { userName, password, role } = req.body;

//   if (!userName || !password) {
//     return res
//       .status(400)
//       .send({ message: "Username and password are required." });
//   }

//   // // Ensure the role is valid
//   // if (!["user", "admin"].includes(role)) {
//   //   return res.status(400).send({ message: "Invalid role provided." });
//   // }

//   try {
//     // const groups = groupSchema.find({});
//     const user = new userSchema({ userName, password, role });
//     // console.log(user, "uuuuuuuuuuuuuuuuuu");

//     // if (groupName && Array.isArray(groupName) && groupName.length > 0) {
//     //   const groups = await groupSchema.find({ name: { $in: groupName } });
//     //   console.log(groups, "ggggggggggggg");

//     //   // add found group to user's group
//     //   user.group = groups.map((group) => group._id.toString());

//     //   for (let group of groups) {
//     //     group.members?.push(user._id.toString());
//     //     await group.save();
//     //   }
//     // }

//     // if (!user.group?.includes(groups._id.toString())) return;
//     // next();
//     // res.send({
//     //   message: `${user.userName} is not added in any group.`,
//     // });

//     await user.save();
//     res.status(201).send({
//       success: true,
//       message: "User created successfully",
//       user,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .send({ message: "Error creating user", error: error.message });
//   }
// };

// const login = async (req, res) => {
//   const { userName, password } = req.body;

//   try {
//     const user = await userSchema.findOne({ userName });

//     if (!user) {
//       res.status(400).send({
//         success: false,
//         message: "User not registered.",
//       });
//     }

//     if (!user.password) {
//       res.status(400).send({
//         success: false,
//         message: "User password is not available.",
//       });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);

//     if (!validPassword)
//       res.status(403).send({
//         success: false,
//         message: "Invalid userName or password.",
//       });

//     console.log("Role While login:", user.role);

//     //* ================ Create token ================
//     const token = JWT.sign(
//       { name: user.userName, role: user.role },
//       process.env.SECRET_KEY,
//       { expiresIn: process.env.JWT_EXPIRATION }
//     );

//     res.status(200).send({
//       success: true,
//       message: `${user.userName} logged in successfully`,
//       token,
//     });
//   } catch (error) {
//     console.log("Error =>", error.message);
//     res.status(500).send({
//       success: false,
//       message: "Error while logging in.",
//       error: error.message,
//     });
//   }
// };

const register = async (req, res) => {
  const { userName, password, role, groupName } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required." });
  }

  try {
    // Check if the user already exists
    const existingUser = await userSchema.findOne({ userName });
    if (existingUser) {
      return res.status(400).send({ message: "Username already exists." });
    }

    // Create a new user
    const user = new userSchema({
      userName,
      password,
      role,
    });
    console.log(user, "user initial");
    console.log(user.group, "group initial");

    //* If group names are provided, find the groups and add to user's groups array
    if (groupName && Array.isArray(groupName) && groupName.length > 0) {
      const groups = await groupSchema.find({ name: { $in: groupName } });
      user.group = groups.map((group) => group._id.toString());

      // Add user to the groups' members array
      await Promise.all(
        groups.map(async (group) => {
          if (!group.members?.includes(user._id.toString())) {
            group.members.push(user._id.toString());
            await group.save();
          }
        })
      );
    }

    await user.save();
    console.log(user, "uuuuuuuuuuuuu");
    console.log(user.group, "gggggggggggg");

    res.status(201).send({
      success: true,
      message: "User registered successfully.",
      user: {
        username: user.userName,
        role: user.role,
        groups: user?.group,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error.message);
    res.status(500).send({
      success: false,
      message: "Error during user registration.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    res.status(400).send({
      success: false,
      message: "Username and password are required.",
    });
  }

  try {
    const user = await userSchema.findOne({ userName });

    if (!user) {
      return res.status(400).send({ message: "No user found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid username or password." });
    }

    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(200).send({
      success: true,
      message: `${user.userName} logged in successfully.`,
      token,
    });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error: error.message });
  }
};

export { register, login };
