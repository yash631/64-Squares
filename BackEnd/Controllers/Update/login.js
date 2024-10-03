const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Login function
const login = [
  // Validate input fields
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),

  // Handle the login request
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
 
    try {
      // Fetch the user from the database using the username
      const findUser = await prisma.user.findUnique({
        where: { username },
      });

      // User not found
      if (!findUser) {
        return res.status(401).json({ error: "User not found" });
      }

      // Compare the password with the stored hashed password
      const isMatch = await bcrypt.compare(password, findUser.password);

      if (isMatch) {
        req.session.userId = prisma.user.uid;
        // Set a secure cookie (consider using JWT for token-based auth)
        res.cookie("user", username, {
          maxAge: 900000, // 15 minutes
          httpOnly: true,
        });

        console.log("Cookies set: ", req.cookies);

        // Respond with a success message
        return res.send({
          msg: `Welcome ${username}, you're successfully logged in!`,
        });
      } else {
        // Password doesn't match
        return res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      // Log and handle the error
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
];

module.exports = { login };
