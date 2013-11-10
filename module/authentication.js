/**
 * Created by Abhisek on 10/30/13.
 */

var config = require('./config.js').config(),
    mongodb = require('mongodb'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    debug = require('debug')('express:application'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs');

exports.saveUser=saveUser;

var SALT_WORK_FACTOR = config.app.auth.SALT_WORK_FACTOR;

mongoose.connect('mongodb://' + config.app.auth.db.host + ':' + config.app.auth.db.port + '/' + config.app.auth.db.name);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    debug('Connected to DB');
});



// User Schema
var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    accessToken: { type: String }, // Used for Remember Me
    type:{type: String,required: true},
    display_name:{type: String,required: true}
});


// Bcrypt middleware
userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Password verification
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Remember Me implementation helper method
userSchema.methods.generateRandomToken = function () {
    var user = this,
        chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        token = new Date().getTime() + '_';
    for (var x = 0; x < 16; x++) {
        var i = Math.floor(Math.random() * 62);
        token += chars.charAt(i);
    }
    return token;
};

var User = mongoose.model('User', userSchema);


function saveUser(document,res) {
    debug("document : "+ JSON.stringify(document));
    //var usr = new User({ username: 'bob', email: 'bob@example.com', password: 'secret' });
    var usr = new User(document);
    usr.save(function (err) {
        if (err) {
            debug(err);
            return {error:{msg:err}};
        } else {
            console.log("User Added");
            res.send({response:"User Added"});

        }
        res.send({response:"User Added"});

    });

}


passport.serializeUser(function (user, done) {
    var createAccessToken = function () {
        var token = user.generateRandomToken();
        User.findOne({ accessToken: token }, function (err, existingUser) {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                createAccessToken(); // Run the function again - the token has to be unique!
            } else {
                user.set('accessToken', token);
                user.save(function (err) {
                    if (err) return done(err);
                    return done(null, user.get('accessToken'));
                })
            }
        });
    };

    if (user._id) {
        createAccessToken();
    }
});

passport.deserializeUser(function (token, done) {
    User.findOne({accessToken: token }, function (err, user) {
        done(err, user);
    });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Unknown user ' + username });
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) return done(err);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    });
}));
