const express = require("express");
const liri = require("liri");
var port = process.env.PORT || 3000;
var app = express();
app.get('/', function (req, res) {
 res.send(liri);
});
app.listen(port, function () {
 console.log(`Example app listening on port !`);
});