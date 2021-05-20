let users;

class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.DB_NAME).collection('users');
    } catch (err) {
      throw new Error(`Unable to establish collection handles in userDAO`);
    }
  }

  static async addUser(name, email, password) {
    try {
      await users.createIndex({ email: 1 }, { unique: true });

      const newUser = await users.insertOne({
        name,
        email,
        password,
      });

      return newUser;
    } catch (e) {
      if (String(e).startsWith('MongoError: E11000 duplicate key error')) {
        throw new Error('User email address already exists');
      }
      throw e;
    }
  }

  static async getUser(email) {
    const query = { email };
    const options = {
      projection: { _id: 0 },
    };

    const user = await users.findOne(query, options);

    return user;
  }
}

module.exports = UsersDAO;
