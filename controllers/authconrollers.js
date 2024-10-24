const RegisterUser = require("../models/registerSchema"); // Ensure this model is set up correctly
const bcrypt = require("bcrypt");
const { trace } = require("../routers/auth-router");
const message = require("../models/Message");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await RegisterUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await RegisterUser.create({
      name,
      email,
      password: hashedPassword,
    });

    res
      .status(200)
      .json({ msg: "You are registered successfully", data: newUser });
    console.log(newUser);
  } catch (error) {
    res.status(400).json({ msg: "Registration failed", error });
    console.log("Registration failed", error);
  }
};
const login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const userexist = await RegisterUser.findOne({ email: email });
    console.log(userexist.password);

    if (!userexist) {
      resp.status(400).json({ msg: "user not exist please register first" });
    } else {
      const ismatch = await bcrypt.compare(password, userexist.password);
      if (!ismatch) {
        resp.status(400).json({ msg: "Invailid Cridentials. try again" });
      }
      resp.status(200).json({ msg: "login succesfully", userexist });
    }
  } catch (error) {
    resp.status(400).json({ msg: "Failed To login" });
  }
};
const findMessage = async (req, resp) => {
  try {
    const { recipientEmail, senderEmail } = req.body;
    console.log("Recipient:", recipientEmail, "Sender:", senderEmail);

    const messages = await message.find({
      $or: [
        { senderEmail: senderEmail, recipientEmail: recipientEmail },
        { senderEmail: recipientEmail, recipientEmail: senderEmail },
      ],
    });

    if (messages.length > 0) {
      resp.status(200).json(messages);
    } else {
      resp.status(404).json({ message: "No messages found." });
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    resp
      .status(500)
      .json({ error: "An error occurred while fetching messages." });
  }
};

module.exports = {
  register,
  login,
  findMessage,
};
