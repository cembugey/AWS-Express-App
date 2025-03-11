// src/routes/postRoutes.js

const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public: GET all posts
router.get("/", postController.getAllPosts);

// Protected: Create a new post
router.post("/", authMiddleware, postController.createPost);

// Protected: Update a post
router.put("/:id", authMiddleware, postController.updatePost);

// Protected: Delete a post
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;
