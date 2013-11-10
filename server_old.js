
/**
 * Module dependencies.
 */

var express = require('express'),
  routes =require('./routes'),
  http = require('http'),
  path = require('path'),
  search = require('./routes/search'),
  index = require('./routes/index'),
  config=require('./module/config.js').config();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || config.app.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.session({secret: '1234567890QWERTY'}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/searchAgreement', search.searchAgreement);
//app.get('/agreementList', search.getAgreementList);
app.get('/work', search.getWork);

app.get("/",index.home);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
