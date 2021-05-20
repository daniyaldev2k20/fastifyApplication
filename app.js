const path = require('path');
const fastify = require('fastify')({
  logger: {
    level: 'info',
    prettyPrint: true,
  },
});

const userAPI = require('./api/user-api');

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
});

fastify.register(require('fastify-helmet'));
fastify.register(require('fastify-rate-limit'), {
  max: 100,
  timeWindow: '1 minute',
});
fastify.register(require('fastify-cors'), { origin: true });

fastify.register(userAPI, { prefix: '/api/v1/users' });

module.exports = fastify;
