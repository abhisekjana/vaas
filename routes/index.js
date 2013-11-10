var debug = require('debug')('express:application'),
    sanitizer = require('sanitizer'),
    ObjectID = require('mongodb').ObjectID,
    conn=require('../module/database.js');

exports.home = function(req, res){



    var rov={};

    if(typeof req.session.user_profile=='undefined' || typeof req.session.user_profile.type=='undefined'){
        res.redirect('/login');
    }else{
        if(req.session.user_profile.type=='d'){
            rov={show:'none',search:'block'};
        }else{
            rov={show:'block',search:'none'};
        }

        res.render('index', rov);
    }
};