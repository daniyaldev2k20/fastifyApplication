const bcrypt = require('bcrypt');

const checkPasswordSimilarity = (password, passwordConfirm) => {
  if (password === passwordConfirm) {
    return true;
  }
  return false;
};

const hashPassword = async (password) => await bcrypt.hash(password, 10);

const correctPassword = async (userPassword, password) =>
  await bcrypt.compare(userPassword, password);

module.exports = { checkPasswordSimilarity, hashPassword, correctPassword };
