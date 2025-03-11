// src/controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("email", email);
      console.log("password", password);
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      console.log("existingUser", existingUser);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("hashedPassword", hashedPassword);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      console.log("user", user);

      res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("login email", email);
      console.log("login password", password);
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      console.log("login user", user);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("login isMatch", isMatch);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log("login token", token);

      // Example if returning the token in the response body
      return res.json({ message: 'Logged in', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  logout: (req, res) => {
    // If using cookies, clear it. If storing token in frontend, the client can simply remove it.
    // Here is a simple example for clearing an auth cookie:
    // res.clearCookie('token');
    return res.json({ message: 'Logged out successfully' });
  },
};
