import chai from 'chai';
import Database from '../src/config/database';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import { app } from '../index';


chai.use(chaiHttp);
const { expect } = chai;
const port = 8080
describe('API Tests', () => {
/*     it('should return Welcome to the API!👋🏽👋🏽', done => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(res.body.message).to.equal(`Server is listening on port http://localhost:${port}`);
          done();
        });
    }); */
})
