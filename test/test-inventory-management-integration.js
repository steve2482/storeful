const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const {app, express} = require('../server');

chai.use(chaiHttp);

describe('Root Url', function() {
  it('should show the main html and send a 200 status code', function() {
    return chai.request(app)
    .get('/')
    .then(function(res) {
      res.should.have.status(200);
      // res.should.include('html');
    });
  });

  it('should show the user-inventory html and send a 200 status code', function() {
    return chai.request(app)
    .get('/inventory')
    .then(function(res) {
      res.should.have.status(200);
      // HTML test code here
    });
  });
});
