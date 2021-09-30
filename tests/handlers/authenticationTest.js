const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jwt-simple');
const app = require('../../index');
const usersRepository = require('../../src/repositories/users');
const authenticationsRepository = require('../../src/repositories/authentications');
const authenticationHandler = require('../../src/handlers/authentication');

chai.use(chaiHttp);

const { API_KEY } = process.env;
const BASE_PATH = '/api/tyba-ms';

describe('Check authenticationHandler:', () => {
  afterEach(() => {
    sandbox.restore();
  });

  beforeEach(async () => {
    sandbox.stub(usersRepository, 'getByDocumentForLogin').resolves(
      {
        id: 1,
        name: 'Luis',
        last_name: 'Colorado',
        document: 1032884,
        gender: 'male',
        password: 'xxxxxxxxx',
      },
    );
  });

  describe('Request to login:', () => {
    it('Should return error when password is invalid', async () => {
      const credentials = {
        document: 1032884,
        password: 'any',
      };

      return chai.request(app)
        .post(`${BASE_PATH}/login`)
        .send(credentials)
        .set('authorization', 'Bearer test')
        .set('API_KEY', API_KEY)
        .then(async ({ body: { error: got } }) => {
          const want = { code: 400, message: 'invalid credentials' };
          assert.deepStrictEqual(got, want);
        });
    });

    it('Should return token when credentials are valid', async () => {
      const credentials = {
        document: 1032884,
        password: '12345678',
      };
      const userDB = {
        id: 1,
        name: 'Luis',
        last_name: 'Colorado',
        document: 1032884,
        gender: 'male',
        password: authenticationHandler.encodePassword(credentials.password),
      };

      sandbox.restore();
      sandbox.stub(jwt, 'encode').resolves('test');
      sandbox.stub(authenticationsRepository, 'saveTokenCache').resolves();
      sandbox.stub(usersRepository, 'getByDocumentForLogin').resolves(userDB);

      return chai.request(app)
        .post(`${BASE_PATH}/login`)
        .send(credentials)
        .set('authorization', 'Bearer test')
        .set('API_KEY', API_KEY)
        .then(async ({ body: { token } }) => {
          assert.ok(token);
        });
    });
  });

  describe('Request to create user:', () => {
    it('Should return error when gender param is invalid', async () => {
      const user = {
        id: 1,
        name: 'Luis',
        last_name: 'Colorado',
        document: 1032884,
        gender: 'any',
        password: 'any',
      };

      return chai.request(app)
        .post(`${BASE_PATH}/signup`)
        .send(user)
        .set('authorization', 'Bearer test')
        .set('API_KEY', API_KEY)
        .then(async ({ body: { error: got } }) => {
          const want = { code: 400, message: '.gender should be equal to one of the allowed values' };
          assert.deepStrictEqual(got, want);
        });
    });
  });
});
