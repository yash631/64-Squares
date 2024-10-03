const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const signin = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if the username already exists
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return res.status(409).json({ error: "Username already exists." });
      } else {
        const findExistingEmail = await prisma.user.findUnique({
          where: { email },
        });
        if (findExistingEmail) {
          return res
            .status(409)
            .json({ error: "User with this email already exists." });
        }
      }

      // Password hashing with bcrypt
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_VALUE) || 10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Store the hashed password in the database
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      // Set a secure cookie (consider replacing with a session or JWT token)
      res.cookie("user", username, {
        maxAge: 900000,
        httpOnly: true,
      });

      res.send({ msg: "Signup successful and cookie set" });
    } catch (error) {
      // Log the error and send a generic error message
      console.error("Error during signup:", error);
      res.status(500).send({ msg: "Internal server error during signup" });
    }
  },
];

module.exports = { signin };
