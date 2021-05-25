const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

const UsersDAO = require('./dao/usersDAO');

dotenv.config({
  path: './config/config.env',
});
const server = require('./app');

const { PORT } = process.env || 3000;
const uri = process.env.URI.replace('<PASSWORD>', process.env.MONGO_PASSWORD);

MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async (client) => {
  await UsersDAO.injectDB(client);

  server.listen(PORT, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  });
});
