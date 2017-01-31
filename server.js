const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const jsonParser = require('body-parser').json();
const {InventoryItem} = require('./models');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/public'));

app.get('/inventory', (req, res) => {
  InventoryItem
  .find()
  .exec()
  .then(item => {
    res.json(item);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  });
});

app.post('/inventory', jsonParser, (req, res) => {
  const requiredFields = ['itemName', 'balanceOnHand', 'requestedInventoryLevel', 'vendor'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      res.status(400).json(
        {error: `Missing "${field}" in request body`});
    }
  });
  InventoryItem
  .create({
    itemName: req.body.itemName,
    unitPrice: req.body.unitPrice,
    retailPrice: req.body.retailPrice,
    balanceOnHand: req.body.balanceOnHand,
    requestedInventoryLevel: req.body.requestedInventoryLevel,
    sold: 0,
    vendor: req.body.vendor
  })
  .then(inventoryItem => res.status(201).json(inventoryItem))
  .catch(err => {
    console.log(err);
    res.status(500).json({error: 'Something went wrong'});
  });
});

app.put('/inventory/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  const updated = [];
  const updateableFields = ['itemName', 'unitPrice', 'retailPrice', 'balanceOnHand', 'requestedInventoryLevel', 'vendor'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  InventoryItem
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(updatedItem => res.status(201).json(updatedItem))
    .catch(err => {
      res.status(500).json({message: 'Something went wrong'});
    });
});

let server;
function runServer(databaseURL = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseURL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
