/**
 * Module dependencies.
 */
var env = process.env.NODE_ENV || 'development';

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    passport = require('passport'),
    path = require('path'),
    search = require('./routes/search'),
    config = require('./module/config.js').config(),
    authentication=require('./module/authentication'),
    debug = require('debug')('express:application'),
    index = require('./routes/index'),
    upload=require('./routes/upload'),
    user = require('./routes/user');


var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || config.app.port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.set('env', process.env.NODE_ENV || 'development');
    //app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.session({secret: '1234567890QWERTY'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.bodyParser({
        keepExtensions: true,
        uploadDir: __dirname + '/tmp',
        limit: '2mb'
    }));
    app.use(express.methodOverride());
    // Remember Me function
    app.use(function (req, res, next) {
        if (req.method == 'POST' && req.url == '/login') {
            if (req.body.rememberme) {
                req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
            } else {
                req.session.cookie.expires = false;
            }
        }
        next();
    });
    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', ensureAuthenticated, index.home);

app.post('/upload',ensureAuthenticated, upload.upload);

app.get('/data',ensureAuthenticated,search.getData);

app.post('/registerUser',user.registerUser);

app.get('/search',ensureAuthenticated,search.searchUser);
app.get('/getVAHistory',ensureAuthenticated,search.getVAHistory);


app.get('/update_profile',ensureAuthenticated,search.update_profile);

app.get('/logoff',ensureAuthenticated,search.logoff);



app.get('/login', function (req, res) {
    res.render('login', { user: req.user, message: req.session.messages });
});

app.get('/upload', ensureAuthenticated,function (req, res) {
    res.render('upload', { user: req.user, message: req.session.messages });
});



// POST /login
app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            req.session.messages = [info.message];
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            req.session.user_profile=user._doc;

            return res.redirect('/');
        });

    })(req, res, next);

});

app.get('/logoff', function (req, res) {
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


http.createServer(app).listen(app.get('port'), function () {
    debug("Express server listening on port " + app.get('port'));
});