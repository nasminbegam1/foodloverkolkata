var express             = require('express');
var app                 = express();
var http                = require('http').Server(app);
var engine 		= require('ejs');
var expressValidator    = require('express-validator');
global.expressSession   = require('express-session');
const bodyParser        = require('body-parser');

require('dotenv').config();

app.use(express.static(__dirname + '/public'));

app.engine('html', engine.renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({ extended: false,
    parameterLimit: 1000000,
 limit: '50mb'}));

app.use(expressValidator());
app.use(global.expressSession( {secret : 'max', saveUnintialize : false, resave : false }));
app.use(require('./routes/web'));

var db 	= require('./config/db');
global.bookshelf = db.connection();

http.listen(process.env.PORT, function(req, res){
    console.log('server  create');
});