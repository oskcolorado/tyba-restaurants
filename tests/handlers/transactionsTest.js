const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jwt-simple');
const app = require('../../index');
const transactionsRepository = require('../../src/repositories/transactions');
const authenticationsRepository = require('../../src/repositories/authentications');

chai.use(chaiHttp);

const { API_KEY } = process.env;
const USER_PATH = '/api/tyba-ms/transactions';

describe('Check restaurantsHandler:', () => {
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
    sandbox.stub(transactionsRepository, 'getByUserID').resolves(
      [
        {
          id: 1,
          user_id: 1,
          city: 'bogota',
          created_at: '2021-09-25T22:04:20.427Z',
          updated_at: '2021-09-25T22:04:20.427Z',
        },
        {
          id: 2,
          user_id: 1,
          city: 'bogota',
          created_at: '2021-09-25T22:04:20.427Z',
          updated_at: '2021-09-25T22:04:20.427Z',
        }],
    );
  });

  describe('Request to transactions:', () => {
    it('Should return the number of transactions in the database for userID from token', async () => chai.request(app)
      .get(USER_PATH)
      .set('authorization', 'Bearer test')
      .set('API_KEY', API_KEY)
      .then(async ({ body }) => {
        const want = 2;
        assert.strictEqual(body.length, want);
      }));
  });
});
