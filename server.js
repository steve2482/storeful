const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/public'));

app.get('/inventory', (req, res) => {
  res.sendFile(__dirname + '/views/user-inventory.html');
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
};

module.exports = {app, runServer, closeServer};
