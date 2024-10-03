const express = require("express");
const { PrismaClient } = require("@prisma/client"); // Assuming Prisma for database interaction
const Routes = require("./Routes/userRoute"); // Routes for user functionality
const Errors = require("./Middleware/errorHandler"); // Middleware for error handling
const auth = require("./Middleware/checkAuthentication");

const app = express();
const prisma = new PrismaClient();
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Set up session secret (replace with secure environment variables)
const extendedSecret = process.env.EXTENDED_SECRET;
const sessionSecret = `${process.env.SESSION_SECRET}${extendedSecret}`;

const { login } = require("./Controllers/Update/login");
const { signin } = require("./Controllers/Update/signin");

// Middleware for parsing incoming data formats
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware for handling cookies
app.use(cookieParser());

// Session middleware for managing user sessions (consider alternatives)
app.use(
  session({
    secret: sessionSecret, // Secret key for session ID cookie
    resave: false, // Avoid resaving unchanged sessions
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: { secure: false, maxAge: 600000 }, // `secure: true` requires HTTPS
  })
);
/* API route to perform CRUD operations on database */
app.use("/api", Routes);

// Login route
app.use("/login",login);

// Route for signing up
app.use("/signin",signin);

// Route for a simple response (replace with more meaningful routes)
app.get("/", async (req, res) => {
  res.status(200).json({ status: 200, msg: "Server is running" });
});

// Check if any errors are found
app.use(Errors);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Optional: Graceful shutdown for Prisma client
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
