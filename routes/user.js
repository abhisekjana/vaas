/**
 * Created by Abhisek on 11/1/13.
 */
var debug = require('debug')('express:application'),
    sanitizer = require('sanitizer'),
    authentication=require('../module/authentication'),
    conn=require('../module/database.js');

exports.registerUser=registerUser;


function registerUser(req,res){

    console.log(req.body);

    var strDisplayName = sanitizer.sanitize(req.body.username);
    var strEmail = sanitizer.sanitize(req.body.email);
    var strPass=sanitizer.sanitize(req.body.password);
    var strType=sanitizer.sanitize(req.body.radio_type);

    var document={
        email:strEmail,
        username:strEmail,
        display_name:strDisplayName,
        password:strPass,
        type:strType
    };
    debug("before save : "+ JSON.stringify(document));

    try{
        conn.db().collection("users",function(error,collection){
            if(error){
                debug(error);
                throw new error;
            }else{
                collection.findOne({email:{ $regex: strEmail, $options: 'i' }},function(error,result){

                    if (result) {
                        debug("bluebutton : "+ JSON.stringify(result));
                        res.send({error:{msg:'User '+strEmail+' already present !'}});
                    } else {
                        // Add User
                        authentication.saveUser(document,res);
                    }
                });
            }
        });

    }catch(error){
        debug(error);
        res.send({error:{msg:error}});
    }


}

