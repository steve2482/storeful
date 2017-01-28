const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
chai.use(chaiHttp);

describe('checking URLs', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  describe('Root Url', function() {
    it('should show the main html and send a 200 status code', function() {
      return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      });
    });

    it('should show the user-inventory html and send a 200 status code', function() {
      return chai.request(app)
      .get('/inventory')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      });
    });
  });
});
