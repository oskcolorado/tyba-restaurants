const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jwt-simple');
const app = require('../../index');
const transactionsProvider = require('../../src/providers/restaurants');
const transactionsRepository = require('../../src/repositories/transactions');
const authenticationsRepository = require('../../src/repositories/authentications');

chai.use(chaiHttp);

const { API_KEY } = process.env;
const USER_PATH = '/api/tyba-ms/restaurants';

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
    sandbox.stub(transactionsProvider, 'getByCity').resolves(
      [{
        business_status: 'OPERATIONAL',
        formatted_address: 'Ak. 24 ##86a-90, Bogotá, Colombia',
        place_id: 'ChIJOfJoM_CaP44R35vHJPEElAs',
        price_level: 2,
        rating: 4.7,
        reference: 'ChIJOfJoM_CaP44R35vHJPEElAs',
        types: [
          'restaurant',
        ],
        user_ratings_total: 219,
      }],
    );
    sandbox.stub(transactionsRepository, 'save').resolves();
  });

  describe('Request to restaurants:', () => {
    it('Should return the number of restaurants in the database', async () => chai.request(app)
      .get(`${USER_PATH}/bogota`)
      .set('authorization', 'Bearer test')
      .set('API_KEY', API_KEY)
      .then(async ({ body }) => {
        const want = 1;
        assert.strictEqual(body.length, want);
      }));
  });
});
