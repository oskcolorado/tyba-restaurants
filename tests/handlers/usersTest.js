const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jwt-simple');
const app = require('../../index');
const usersRepository = require('../../src/repositories/users');
const authenticationsRepository = require('../../src/repositories/authentications');
const { BaseError } = require('../../src/server/requestErrorHandler');

chai.use(chaiHttp);

const { API_KEY } = process.env;
const USER_PATH = '/api/tyba-ms/user';

describe('Check usersHandler:', () => {
  afterEach(() => {
    sandbox.restore();
  });

  beforeEach(async () => {
    sandbox.stub(jwt, 'decode').resolves(
      {
        sub: 1,
        name: 'Luis',
        last_name: 'Colorado',
        document: 1032884,
        iat: Date.now(),
        exp: Date.now(),
      },
    );
    sandbox.stub(jwt, 'encode').resolves('test');
    sandbox.stub(authenticationsRepository, 'getTokenCached').resolves('test');
    sandbox.stub(usersRepository, 'get').resolves(
      {
        id: 1,
        name: 'Luis',
        last_name: 'Colorado',
        document: 1032884,
        gender: 'male',
        created_at: '2021-09-25T22:04:20.427Z',
        updated_at: '2021-09-25T22:04:20.427Z',
      },
    );
  });

  describe('Request to user:', () => {
    it('Should return the user from database', async () => chai.request(app)
      .get(USER_PATH)
      .set('authorization', 'Bearer test')
      .set('API_KEY', API_KEY)
      .then(async ({ body: user }) => {
        const want = 1;
        assert.strictEqual(user.id, want);
      }));

    it('Should return error when the repository fails', async () => {
      sandbox.restore();
      sandbox.stub(jwt, 'decode').resolves(
        {
          sub: 1,
          name: 'Luis',
          last_name: 'Colorado',
          document: 1032884,
          iat: Date.now(),
          exp: Date.now(),
        },
      );
      sandbox.stub(jwt, 'encode').resolves('test');
      sandbox.stub(authenticationsRepository, 'getTokenCached').resolves('test');
      sandbox.stub(usersRepository, 'get').resolves(new BaseError('Connection timeout', 522));

      return chai.request(app)
        .get(USER_PATH)
        .set('authorization', 'Bearer test')
        .set('API_KEY', API_KEY)
        .then(async ({ body: { code } }) => {
          const want = 522;
          assert.strictEqual(code, want);
        });
    });
  });
});
