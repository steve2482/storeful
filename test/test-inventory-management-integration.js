const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {InventoryItem} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
chai.use(chaiHttp);

// generate an inventory item
function generateItem() {
  return {
    itemName: faker.commerce.productName(),
    unitPrice: faker.commerce.price(),
    retailPrice: faker.commerce.price(),
    balanceOnHand: faker.random.number(),
    requestedInventoryLevel: faker.random.number(),
    sold: 0,
    vendor: faker.company.companyName()
  };
}

// seed some data
function seedInventory() {
  console.log('Creating inventory data');
  const seedData = [];
  for (let i = 1; i < 10; i++) {
    seedData.push(generateItem());
  }
  return InventoryItem.insertMany(seedData);
}

// removes test data
function removeInventoryData() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('testing', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedInventory();
  });

  afterEach(function() {
    return removeInventoryData();
  });

  after(function() {
    return closeServer();
  });

  describe('Urls', function() {
    it('should show the main html and send a 200 status code', function() {
      return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      });
    });
  });

  describe('GET: getting all inventory results', function() {
    it('should get all inventory items, returning an array of objects and a 200 status code', function() {
      let res;
      return chai.request(app)
        .get('/inventory')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.body.should.be.array;
          res.body.length.should.be.of.at.least(1);
          return InventoryItem.count();
        })
        .then(function(count) {
          res.body.should.have.length.of(count);
        });
    });
  });

  describe('POST: creating a new inventory item', function() {
    it('should create a new item, returning a json object and a 201 status code', function() {
      // Item to test POST
      const newItem = generateItem();
      return chai.request(app)
        .post('/inventory')
        .send(newItem)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('_id', 'itemName', 'unitPrice', 'retailPrice', 'balanceOnHand', 'requestedInventoryLevel', 'sold', 'vendor');
          res.body.should.not.be.null;
          res.body.itemName.should.equal(newItem.itemName);
          res.body.unitPrice.toFixed(2).should.equal(newItem.unitPrice);
          res.body.retailPrice.toFixed(2).should.equal(newItem.retailPrice);
          res.body.balanceOnHand.should.equal(newItem.balanceOnHand);
          res.body.requestedInventoryLevel.should.equal(newItem.requestedInventoryLevel);
          res.body.sold.should.equal(newItem.sold);
          res.body.vendor.should.equal(newItem.vendor);
          return InventoryItem.findById(res.body._id);
        })
        .then(function(item) {
          item.itemName.should.equal(newItem.itemName);
          item.unitPrice.toFixed(2).should.equal(newItem.unitPrice);
          item.retailPrice.toFixed(2).should.equal(newItem.retailPrice);
          item.balanceOnHand.should.equal(newItem.balanceOnHand);
          item.requestedInventoryLevel.should.equal(newItem.requestedInventoryLevel);
          item.sold.should.equal(newItem.sold);
          item.vendor.should.equal(newItem.vendor);
        });
    });
  });
});
