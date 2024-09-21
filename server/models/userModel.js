const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new Map();

class UserModel {
  static async createUser(username, password) {
    if (users.has(username)) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.set(username, { password: hashedPassword });
    return { username };
  }

  static async findUserByUsername(username) {
    if (!users.has(username)) {
      throw new Error('User not found');
    }
    return { username, ...users.get(username) };
  }

  static async validatePassword(username, password) {
    const user = await this.findUserByUsername(username);
    return bcrypt.compare(password, user.password);
  }

  static generateToken(username) {
    return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}

module.exports = UserModel;
