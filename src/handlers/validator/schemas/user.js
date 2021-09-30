const GENDERS = ['male', 'female'];

module.exports = {
  title: 'userSchema',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    last_name: {
      type: 'string',
      minLength: 1,
    },
    document: {
      type: 'integer',
      minLength: 1,
    },
    gender: {
      type: 'string',
      enum: GENDERS,
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
  required: [
    'name',
    'last_name',
    'document',
    'password',
  ],
};
