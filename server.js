var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/public'));

app.get('/inventory', (req, res) => {
  res.sendFile(__dirname + '/views/user-inventory.html');
});

app.listen(process.env.PORT || 8080);

module.exports = {app};