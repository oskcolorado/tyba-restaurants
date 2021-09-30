module.exports = {
  title: 'userSchema',
  type: 'object',
  properties: {
    document: {
      type: 'integer',
      minLength: 1,
    },
    password: {
      type: 'string',
      minLength: 1,
    },
  },
  required: [
    'document',
    'password',
  ],
};
