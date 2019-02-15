
var express = require('express');
//var app = express();
var app;



// https://stackoverflow.com/questions/19046208/forwarding-http-to-https-in-node-js-express-app-using-ebs-elb-environment/19051185#19051185
function ensureSecure(req, res, next) {
    if (req.secure) {
        // OK, continue
        return next();
    };
    res.redirect('https://' + req.host + req.url); // handle port numbers if non 443
};


var port;
if (process.env.NODE_ENV == "Production") {
    // Use HTTPS
    port = 443;
    var privateKey = fs.readFileSync("keys/privatekey.pem");
    var certificate = fs.readFileSync("keys/certificate.pem");
    app = express({
        key: privateKey,
        cert: certificate
    });
    app.all('*', ensureSecure);
}
else {
    // Use HTTP
    port = 80;
    app = express();
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



app.listen(port, function() {
    console.log('listening on *:' + port);
});
