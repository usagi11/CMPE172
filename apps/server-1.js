var express = require('express');
var morgan = require('morgan');
var hostname = 'localhost';
var port = 8080;

var app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname +'/public'));

app.listen(port, hostname, function(){
	console.log(`Server running at http://${hostname}:${port}/index4.html`);
});
