const jwt = require('jsonwebtoken');
const {
  checkPasswordSimilarity,
  hashPassword,
  correctPassword,
} = require('../utils/password');
const UsersDAO = require('../dao/UsersDAO');

const generateJWT = (userID) =>
  jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '2h' });

const signUp = async (name, email, password, passwordConfirm) => {
  if (!checkPasswordSimilarity(password, passwordConfirm)) {
    throw new Error('Passwords do not match');
  }
  const hashedPassword = await hashPassword(password);
  const newUser = await UsersDAO.addUser(name, email, hashedPassword);

  return {
    message: 'User registered successfully',
    id: newUser.ops[0]._id,
    name: newUser.ops[0].name,
    email: newUser.ops[0].email,
  };
};

//* Generate JWT upon successful authentication
const login = async (email, password) => {
  const user = await UsersDAO.getUser(email);

  if (!user || !(await correctPassword(password, user.password))) {
    throw new Error('Incorrect password or email');
  }

  const token = generateJWT(user._id);

  return {
    message: 'Logged in successfully',
    name: user.name,
    email: user.email,
    token,
  };
};

module.exports = { signUp, login };
