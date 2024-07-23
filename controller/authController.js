import userSchema from "../model/userModel.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import argon from "argon2";
dotenv.config();
// console.log({
//   ARGON: argon,
//   BCRYPT: bcrypt,
//   JWT: JWT,
//   SECRET: process.env.SECRET_KEY,
//   SALT: process.env.SALT,
// });

//* ============================================= user register =============================================

const register = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password)
    return res.send({ message: "Username or Password is required." });

  try {
    if (userName === null || userName === undefined) {
      return res
        .status(400)
        .send({ message: "Username cannot be null or undefined." });
    }

    const existingUser = await userSchema.findOne({ userName });
    if (existingUser)
      return res.send({
        message: `User already exists as the same name: ${existingUser.userName}.`,
      });

    const saltRound = 10;
    const hashed = await bcrypt.hash(password, saltRound);
    console.log(hashed, "Initial hashed");
    // const hashed = await argon.hash(password);

    const user = await userSchema({ userName, password: hashed });
    console.log(hashed, "hashed in database to store");
    // but when we check database, a different password stores
    user.save();

    console.log(hashed, "............");
    console.log(user, "User");

    if (!user) return res.status(403).send({ message: "User not created." });

    res.status(200).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Error while registering user.",
      error: error.message,
    });
  }
};

//* ============================================= user login =============================================

// const login = async (req, res) => {
//   const { userName, password } = req.body;
//   console.log(password, "JJJJ");

//   if (!userName || !password) {
//     res.status(400).send({
//       success: false,
//       message: "userName and password are required.",
//     });
//   }

//   try {
//     const user = await userSchema.findOne({ userName });

//     // Check if user exists
//     if (!user) {
//       return res.status(400).send({
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

//     // Compare password
//     // const validPassword = await bcrypt.compare(password, user.password);
//     // bcrypt.hash(password, 10, function(err, hash) {
//     // if (err) { throw (err); }

//     try {
//       console.log(password, "password");
//       console.log(user.password, "user.password");
//       const result = await bcrypt.compare(password, user.password);
//       console.log(result, "RRR");
//       if (result) {
//         //* ================ Create token ================
//         const token = JWT.sign(
//           { name: user.userName, role: user.role },
//           process.env.SECRET_KEY,
//           { expiresIn: process.env.JWT_EXPIRATION }
//         );

//         // await token.save();

//         res.status(200).send({
//           success: true,
//           message: `${user.userName} logged in successfully`,
//           token: token,
//           user: user.role,
//         });
//       } else {
//         console.log("login failked");
//       }
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//     // });
//     // const validPassword = await argon.verify(password, user.password)
//     // console.log("Valid Password =>", validPassword);

//     // $2b$10$HJTtYsY94lKQkqTMfLhJJ.ACwCaSwq3lNtUCXfQpaZR42GGv0W7MS = Register
//     // $2b$10$HJTtYsY94lKQkqTMfLhJJ.ACwCaSwq3lNtUCXfQpaZR42GGv0W7MS = Login
//     // $2b$10$HJTtYsY94lKQkqTMfLhJJ.ACwCaSwq3lNtUCXfQpaZR42GGv0W7MS = Login Again

//     // if (user[0]?.password === undefined) {
//     //   return res.status(500).send({ message: "User password is undefined." });
//     // }

//     // if (password == user.password) return res.send({ matched: "true" });

//     // if (!validPassword)
//     //   return res
//     //     .status(403)
//     //     .send({ success: false, message: "Invalid username or password." });
//   } catch (error) {
//     console.log("Error =>", error.message);
//     // res.status(500).send({
//     //   success: false,
//     //   message: "Error while logging in.",
//     //   error: error.message,
//     // });
//   }
// };

const login = async (req, res) => {
  const { userName, password } = req.body;
  console.log(password);
  if (!userName || !password) {
    return res.status(400).send({
      success: false,
      message: "Username and password are required.",
    });
  }

  try {
    const user = await userSchema.findOne({ userName });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not registered.",
      });
    }

    if (!user.password) {
      return res.status(400).send({
        success: false,
        message: "User password is not available.",
      });
    }

    // const isMatch = await bcrypt.compareSync(password, user.password);
    // bcrypt.hash(req.body.password, 10, function (err, hash) {
    // if (err) {
    //   throw err;
    // } else {
    console.log(user.password);
    const compare = await bcrypt.compare(password, user.password);

    console.log(compare);

    // if (isMatch) {
    //   const token = JWT.sign(
    //     { name: user.userName, role: user.role },
    //     process.env.SECRET_KEY,
    //     { expiresIn: process.env.JWT_EXPIRATION }
    //   );

    //   return res.status(200).send({
    //     success: true,
    //     message: `${user.userName} logged in successfully`,
    //     token: token,
    //     user: user.role,
    //   });
    // } else {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Invalid username or password.",
    //   });
    // }
  } catch (error) {
    console.error("Error =>", error.message);
    return res.status(500).send({
      success: false,
      message: "Error while logging in.",
      error: error.message,
    });
  }
};

export { register, login };

// const saltRound = 10;
// const hashed = await bcrypt.hash("Test@123", saltRound);
// console.log(hashed, "=============================");

// const compare = bcrypt
//   .compare("Test@1234", hashed)
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// console.log(compare);
