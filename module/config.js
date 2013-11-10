var fs=require('fs'),
	debug = require('debug')('express:application');

module.exports.config=function(){ return config};

var config=loadConfig();


function loadConfig(){
    try {
        debug("Reading config.json");
        var data=fs.readFileSync("./config.json")
        return JSON.parse(data);
    }catch(error){
        debug(error);
    }
};



