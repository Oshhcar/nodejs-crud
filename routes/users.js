var express = require('express');
var router = express.Router();
var client = require('../lib/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  client.execute('SELECT key FROM system.local', function (err, result) {
    if (err) return console.error(err);
    const row = result.first();
    console.log(row['key']);
  });
  res.send('respond with a resource');
});

module.exports = router;
