import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import sinon from 'sinon';
import passport from '../src/config/passport';
import { app } from '../index';

dotenv.config();
const { expect } = chai;
chai.use(chaiHttp);
const { FRONTEND_URL } = process.env;

const mockUser = {
  id: 'user-id',
  status: 'active',
  verified: true,
  userRole: 'buyer',
};

interface PassportCallback<TUser> {
  (error: Error | null, user: TUser | null): void;
}

describe('loginWithGoogle Controller', () => {
  let passportAuthenticateStub: sinon.SinonStub;

  before(() => {
    passportAuthenticateStub = sinon.stub(passport, 'authenticate');
  });

  after(() => {
    passportAuthenticateStub.restore();
  });

  it('should return a JWT token upon successful authentication', async () => {
    passportAuthenticateStub.callsFake(
      (strategy, callback: PassportCallback<object>) => {
        callback(null, mockUser);
      },
    );
    const res = await chai.request(app).get('/users/google/callback');
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token').that.is.a('string');
  });

  it('should return a 500 status code if an internal server error occurs', (done) => {
    passportAuthenticateStub.callsFake(
      (strategy, callback: PassportCallback<object>) => {
        callback(new Error('Internal Server Error'), null);
      },
    );

    chai
      .request(app)
      .get('/users/google/callback')
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('error', 'Internal Server Error');
        done();
      });
  });

  it('should return a 401 status code if authentication fails', (done) => {
    passportAuthenticateStub.callsFake(
      (strategy, callback: PassportCallback<object>) => {
        callback(null, null);
      },
    );

    chai
      .request(app)
      .get('/users/google/callback')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error', 'Authentication failed');
        done();
      });
  });

  it('should return a 401 status code if user is inactive', (done) => {
    const inactiveUser = { ...mockUser, status: 'inactive' };
    passportAuthenticateStub.callsFake(
      (strategy, callback: PassportCallback<object>) => {
        callback(null, inactiveUser);
      },
    );

    chai
      .request(app)
      .get('/users/google/callback')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message', 'User is disabled');
        done();
      });
  });
  it('should handle pending verification', async () => {
  passportAuthenticateStub.callsFake(
    (strategy, callback: PassportCallback<object>) => {
      callback(null, mockUser);
    },
  );

  const res = await chai.request(app).get('/users/google/callback');
  expect(res).to.have.status(200);
});

it('should handle seller OTP verification', async () => {
  const sellerUser = { ...mockUser, userRole: 'seller' };
  passportAuthenticateStub.callsFake(
    (strategy, callback: PassportCallback<object>) => {
      callback(null, sellerUser);
    },
  );

  const res = await chai.request(app).get('/users/google/callback');
});
});
