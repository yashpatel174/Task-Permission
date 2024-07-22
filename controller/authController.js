import userSchema from "../model/userModel.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

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

    const hashed = await bcrypt.hash(password, 10);
    console.log(hashed);
    console.log(bcrypt.hash);

    const user = new userSchema({ userName, password: hashed });
    await user.save();

    if (!user) return res.status(403).send({ message: "User not created." });

    res.status(200).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while registering user.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    res.status(400).send({
      success: false,
      message: "userName and password are required.",
    });
  }

  try {
    const user = await userSchema.findOne({ userName });

    // Check if user exists
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not registered.",
      });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password).then(
      console.log({
        User: user,
        HashedPassword: user.password,
        // validation: validPassword,
      })
    );

    if (password == user.password) return res.send({ matched: "true" });

    if (!validPassword) {
      return res.status(400).send({
        success: false,
        message: "Invalid userName or password.",
      });
    }

    // Create token
    const token = JWT.sign(
      { name: user.userName, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    await token.save();

    res.status(200).send({
      success: true,
      message: `${user.userName} logged in successfully`,
      token: token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while logging in.",
      error: error.message,
    });
  }
};

export { register, login };
