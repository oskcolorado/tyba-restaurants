const validator = module.exports;

const Ajv = require('ajv');

const ajv = new Ajv();

const build = (schema) => {
  const compiler = ajv.compile(schema);
  const validatorBuilt = {
    validate: data => compiler(data),
    getError: () => compiler.errors,
  };

  return validatorBuilt;
};

validator.validate = (body, schema) => {
  const currentValidator = build(schema);
  const valid = currentValidator.validate(body);

  if (!valid) {
    const [invalidParam] = currentValidator.getError();
    const errorMessage = `${invalidParam.dataPath} ${invalidParam.message}`;

    return [valid, errorMessage];
  }

  return [valid, null];
};
