require('dotenv').config()
const {SECRET} = process.env
const {User} = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createToken = (username, id) => {
  const options = { expiresIn: '2 days' };
  const payload = { username, id };
  return jwt.sign(payload, SECRET, options);
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ where: { username } });

    if (foundUser) {
      return res.status(400).send({ message: 'Cannot create user' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    const newUser = await User.create({ username, hashedPass });
    const token = createToken(newUser.dataValues.username, newUser.dataValues.id);
    const exp = Date.now() + 1000 * 60 * 60 * 48;

    return res.send({
      username: newUser.dataValues.username,
      userId: newUser.dataValues.id,
      token,
      exp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'An error occurred' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ where: { username } });

    if (!foundUser) {
      return res.status(400).send({ message: 'Cannot log in' });
    }

    const isAuthenticated = bcrypt.compareSync(password, foundUser.hashedPass);

    if (isAuthenticated) {
      const token = createToken(foundUser.dataValues.username, foundUser.dataValues.id);
      const exp = Date.now() + 1000 * 60 * 60 * 48;

      return res.send({
        username: foundUser.dataValues.username,
        userId: foundUser.dataValues.id,
        token,
        exp,
      });
    } else {
      return res.status(400).send({ message: 'Cannot log in' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'An error occurred' });
  }
};

module.exports = {
  register,
  login,
};
