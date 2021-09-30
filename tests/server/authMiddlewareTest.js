const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');

chai.use(chaiHttp);

const { API_KEY } = process.env;
const USER_PATH = '/api/tyba-ms/user';

describe('Check authMiddleware:', () => {
  describe('Request unauthorized:', () => {
    it('Should return forbidden when the request has no Authorization in headers', async () => chai.request(app)
      .get(USER_PATH)
      .set('API_KEY', API_KEY)
      .catch(async ({ status: got }) => {
        const want = 401;
        assert.strictEqual(got, want);
      }));
  });

  it('Should return forbidden when the request has no API_KEY in headers', async () => chai.request(app)
    .get(USER_PATH)
    .set('Authorization', 'test')
    .catch(async ({ status: got }) => {
      const want = 401;
      assert.strictEqual(got, want);
    }));
});
