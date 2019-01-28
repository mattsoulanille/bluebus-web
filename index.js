var port = 80;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var rp = require("request-promise");
const favicon = require("express-favicon");
var path = require("path");
const getBusData = require("./server/getBusData.js");

app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.use(express.static(__dirname));

// Temporary
getBusData("http://www.brynmawr.edu/transportation/bico.shtml");

app.get("/busdata.json", async function(req, res) {
    var data = await getBusData("http://www.brynmawr.edu/transportation/bico.shtml");
    res.send(data);
    
});



http.listen(port, function() {
    console.log('listening on *:'+port);
});
