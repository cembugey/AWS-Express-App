// src/controllers/postController.js

const prisma = require('../config/db');

module.exports = {
    getAllPosts: async (req, res) => {
        try {
        const posts = await prisma.post.findMany({
            include: { user: true }, // optional to include user data
        });
        console.log("getAllPosts posts", posts);
        
        res.json(posts);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
        }
    },

  createPost: async (req, res) => {
    try {
      const { title, content } = req.body;
      console.log("createPost title", title);
      console.log("createPost content", content);
      
      const userId = req.user.id; // from token decoding in authMiddleware
      console.log("createPost userId", userId);

      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          userId,
        },
      });
      console.log("createPost newPost", newPost);
      res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { title, content } = req.body;
      const { id } = req.params;
      const userId = req.user.id;

      // Verify ownership
      const existingPost = await prisma.post.findUnique({ where: { id: Number(id) } });
      if (!existingPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (existingPost.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const updatedPost = await prisma.post.update({
        where: { id: Number(id) },
        data: { title, content },
      });
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Verify ownership
      const existingPost = await prisma.post.findUnique({ where: { id: Number(id) } });
      if (!existingPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (existingPost.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      await prisma.post.delete({ where: { id: Number(id) } });
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};
