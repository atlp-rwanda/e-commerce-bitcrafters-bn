import chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import User from '../src/models/user'; // Import your User model
import router from '../src/routes/routes'; // Path to your router file
import * as sinon from 'sinon';
// Configure chai
chai.use(chaiHttp);
const expect = chai.expect;

describe('User API', () => {
  let app:any;

  // Before each test, create a new Express app and use the router
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/', router);
  });

  // Test the GET /users endpoint
  describe('GET /users', () => {
    it('should return all users', async () => {
      // Stub the findAll method of the User model to return test data
      const testData = [{ name: 'Test User', email: 'test@example.com' }];
      // Create Sequelize model instances from test data
      const userModelInstances = testData.map(({ name, email }) => User.build({ name, email }));
      // Stub the findAll method of the User model
      sinon.stub(User, 'findAll').resolves(userModelInstances);

      // Send a GET request to the /users endpoint using chai-http
      const res = await chai.request(app).get('/users');

      // Assert that the response status is 200 and the body matches the test data
      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(testData);
    });
  });

  // Test the POST /users endpoint
  describe('POST /users', () => {
    it('should create a new user', async () => {
    // Define test user data
const userData = { name: 'Test User', email: 'test@example.com', password: 'password' };

// Create a Sequelize model instance from test data
const userInstance = User.build(userData);
// Stub the create method of the User model to return the Sequelize model instance
sinon.stub(User, 'create').resolves(userInstance);
      // Send a POST request to the /users endpoint using chai-http
      const res = await chai.request(app).post('/users').send(userData);

      // Assert that the response status is 201 and the body matches the test data
      expect(res).to.have.status(201);
      expect(res.body).to.deep.equal(userData);
    });
  });
});
