const signUp = {
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', maxLength: 20 },
      email: {
        type: 'string',
        maxLength: 20,
        format: 'email',
      },
      password: { type: 'string', maxLength: 15, minLength: 8 },
      passwordConfirm: { type: 'string', maxLength: 15, minLength: 8 },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
};

const login = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', maxLength: 20, format: 'email' },
      password: { type: 'string', maxLength: 15, minLength: 8 },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'object',
      required: ['jwt'],
      properties: {
        message: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        jwt: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
};

module.exports = { signUp, login };
