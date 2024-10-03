const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch all users
const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    next(error);  
  }
};

module.exports = {
  getUsers,
};
