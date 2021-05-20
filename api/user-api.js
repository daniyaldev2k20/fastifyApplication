const fastifyRateLimit = require('fastify-rate-limit');
const fastifyCookie = require('fastify-cookie');

const authService = require('../services/auth-service');
const userSchema = require('../schemas/user-schema');

async function userRoutes(fastify, options) {
  fastify.register(fastifyRateLimit, {
    max: 4,
    timeWindow: '1 minute',
  });

  fastify.register(fastifyCookie);

  fastify.route({
    method: 'POST',
    url: '/signUp',
    schema: userSchema.signUp,
    handler: async function (request, reply) {
      const { name, email, password, passwordConfirm } = request.body;
      const newUser = await authService.signUp(
        name,
        email,
        password,
        passwordConfirm
      );
      return newUser;
    },
  });

  fastify.route({
    method: 'POST',
    url: '/login',
    schema: userSchema.login,
    handler: async function (request, reply) {
      const { email, password } = request.body;
      const user = await authService.login(email, password);
      const { message, name, token } = user;
      reply
        .setCookie('jwt', token, {
          domain: '*',
          expires: new Date(Date.now() + 60 * 60 * 1000),
          path: '/',
          httpOnly: true,
        })
        .code(200)
        .send({
          message,
          name,
          email: user.email,
          jwt: token,
        });
    },
  });

  fastify.route({
    method: 'GET',
    url: '/login',
    handler: function (request, reply) {
      reply
        .setCookie('jwt', 'loggedOut', {
          domain: '*',
          expires: new Date(Date.now() + 10 * 1000),
          path: '/',
          httpOnly: true,
        })
        .code(200)
        .send({
          message: 'Success',
        });
    },
  });

  fastify.setErrorHandler((error, request, reply) => {
    const { message } = error;

    if (message === 'Unable to establish collection handles in userDAO') {
      return reply.status(401).send({ error });
    }
    if (message === 'User email address already exists') {
      return reply.status(409).send({ message });
    }
    if (message === 'Passwords do not match') {
      return reply.status(400).send({ message });
    }
    if (message === 'Incorrect password or email') {
      return reply.status(401).send({ message });
    }

    reply.send(error);
  });
}

module.exports = userRoutes;
