

var mongo=require('mongodb'),
	debug = require('debug')('express:application'),
	config=require('./config.js').config();

var db=new mongo.Db(config.db.name,new mongo.Server(config.db.host,config.db.port,{auto_reconnect: true}));

module.exports.db=function(){
    return db;
};

db.open(function(error){
    if(error){
        debug(error);
    }else{
        debug("Connected");
    }
});





