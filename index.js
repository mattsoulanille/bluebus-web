var port = 80;
var express = require('express');
var app = express();



var server;
if (process.env.NODE_ENV == "Production") {
    // Use HTTPS
    var privateKey = fs.readFileSync("keys/privatekey.pem");
    var certificate = fs.readFileSync("keys/certificate.pem");
    server = require('https').createServer({
        key: privateKey,
        cert: certificate
    });
}
else {
    // Use HTTP
    server = require('http').Server(app);
}


var rp = require("request-promise");
const favicon = require("express-favicon");
var path = require("path");
const getBusData = require("./server/getBusData.js");

app.use(favicon(path.join(__dirname, 'favicon.ico')));



app.use(express.static(path.join(__dirname, "static")));



// Temporary
getBusData("http://www.brynmawr.edu/transportation/bico.shtml");

app.get("/busdata.json", async function(req, res) {
    var data = await getBusData("http://www.brynmawr.edu/transportation/bico.shtml");
    res.send(data);

});



server.listen(port, function() {
    console.log('listening on *:' + port);
});
