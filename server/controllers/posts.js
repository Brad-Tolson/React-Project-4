const { Post, User } = require('../models/post');

module.exports = {
  addPost: async (req, res) => {
    console.log('Adding a new post');
    try {
      const { title, content, status, userId } = req.body;
      await Post.create({
        title,
        content,
        privateStatus: status,
        userId
      });
      res.sendStatus(200);
    } catch (error) {
      console.log('ERROR IN addPost');
      console.log(error);
      res.sendStatus(400);
    }
  },

  getAllPosts: async (req, res) => {
    console.log('Getting all posts');
    try {
      const posts = await Post.findAll({
        where: { privateStatus: false },
        include: [
          {
            model: User,
            required: true,
            attributes: [`username`],
          },
        ],
      });
      res.status(200).send(posts);
    } catch (error) {
      console.log('ERROR IN getAllPosts');
      console.log(error);
      res.sendStatus(400);
    }
  },

  getCurrentUserPosts: async (req, res) => {
    console.log('Getting current user posts');
    try {
      const { userId } = req.params;
      const posts = await Post.findAll({
        where: {
          userId: userId,
          privateStatus: false,
        },
      });
      res.status(200).send(posts);
    } catch (error) {
      console.log('ERROR IN getCurrentUserPosts');
      console.log(error);
      res.sendStatus(400);
    }
  },

  editPost: async (req, res) => {
    console.log('Editing a post');
    try {
      const { id } = req.params;
      const { status } = req.body;
      await Post.update(
        { privateStatus: status },
        { where: { id: +id } }
      );
      res.sendStatus(200);
    } catch (error) {
      console.log('ERROR IN editPost');
      console.log(error);
      res.sendStatus(400);
    }
  },

  deletePost: async (req, res) => {
    console.log('Deleting a post');
    try {
      const { id } = req.params;
      await Post.destroy({
        where: {
          id: +id,
        },
      });
      res.sendStatus(200);
    } catch (error) {
      console.log('ERROR IN deletePost');
      console.log(error);
      res.sendStatus(400);
    }
  },
};
