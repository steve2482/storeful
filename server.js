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
  res.sendFile(__dirname + '/views/user-inventory.html');
});

app.post('/inventory', jsonParser, (req, res) => {
  const requiredFields = ['itemName', 'balanceOnHand', 'requestedInventoryLevel', 'vendor'];
  // requiredFields.forEach(field => {
  //   if (!(field in req.body)) {
  //     res.status(400).json(
  //       {error: `Missing "${field}" in request body`});
  //   }
  // });
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
