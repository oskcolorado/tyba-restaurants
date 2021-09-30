const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');

chai.use(chaiHttp);

const STATUS_PATH = '/api/tyba-ms/status';

describe('Check statusHandler:', () => {
  describe('Request to status server:', () => {
    it('Should return status OK when server is up', async () => chai.request(app)
      .get(STATUS_PATH)
      .then(async ({ body: { status } }) => {
        const want = 'OK';
        assert.strictEqual(status, want);
      }));
  });
});
