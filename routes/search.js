/**
 * Created by Abhisek on 10/30/13.
 */
var debug = require('debug')('express:application'),
	sanitizer = require('sanitizer'),
    ObjectID = require('mongodb').ObjectID,
	conn=require('../module/database.js');
    var mongo=require('mongodb');

exports.searchUser=searchUser;

exports.getData=getData;
exports.getVAHistory=getVAHistory;

function getVAHistory(req,res){

    console.log(req.session.user_profile._id);

    if(req.session.user_profile.type=='v'){

        try{
            conn.db().collection("users",function(error,collection){
                if(error){
                    debug(error);
                    throw new error;
                }else{
                    var query={username:req.session.user_profile.username};

                    console.log(query);

                    collection.find(query,function(error,cursor){

                        if(cursor){
                            cursor.toArray(function(error,users){
                                debug("bluebutton : "+ JSON.stringify(users));

                                console.log(users[0].documents.length);



                                if(users[0].documents.length>1){

                                    conn.db().collection("bluebutton",function(error,collection){
                                        if(error){
                                            debug(error);
                                            throw new error;
                                        }else{

                                            var query={'doc_id': users[0].documents[1].docid};
                                            console.log(query);
                                            collection.findOne(query,function(error,data){
                                                if(error){
                                                    debug(error);
                                                }

                                                console.log("bluebutton : "+ JSON.stringify(data));
                                                res.send({response: data});
                                            });
                                        }
                                    });

                                }

                            });
                        }else{

                        }

                    });
                }
            });
        }catch(error){
            debug(error);
            res.send({error:{msg:'Search type not available'}});
        }

    }

}



function getData(req,res){
    try{
        conn.db().collection("users",function(error,collection){
            if(error){
                debug(error);
                throw new error;
            }else{
                var query={username:req.session.user_profile.username};

                console.log(query);

                collection.find(query,function(error,cursor){
                    if(cursor){
                        cursor.toArray(function(error,users){
                            debug("bluebutton : "+ JSON.stringify(users));

                            if(error){
                                debug(error);
                                res.send({error:{msg:'Search type not available'}});
                            }

                            if(typeof users.length!='undefined' && users.length>0 && typeof users[0].documents !='undefined' && users[0].documents.length>0){

                                try{
                                    conn.db().collection("bluebutton",function(error,collection){
                                        if(error){
                                            debug(error);
                                            throw new error;
                                        }else{

                                            var query={'doc_id': users[0].documents[0].docid};
                                            console.log(query);
                                            collection.findOne(query,function(error,data){
                                                if(error){
                                                    debug(error);
                                                }

                                                console.log("bluebutton : "+ JSON.stringify(data));
                                                res.send({response: data});
                                            });
                                        }
                                    });
                                }catch(error){
                                    debug(error);
                                    res.send({error:{msg:'Search type not available'}});
                                }

                            }

                        });
                    }else{

                    }

                });
            }
        });
    }catch(error){
        debug(error);
        res.send({error:{msg:'Search type not available'}});
    }


}

exports.update_profile=update_profile;


exports.logoff=function(req,res){
        req.session.user_profile=null;
        res.redirect("/login");
};


function update_profile(req,res){

    console.log(req.query.doc_id);

    var data=parseInt(req.query.doc_id);



    conn.db().collection("bluebutton",function(error,collection){
        if(error){
            debug(error);
            throw new error;
        }else{
            collection.findOne({doc_id:data},function(error,result){
                   res.send({response: result});
            });
        }
    });



 }

function searchUser(req,res){
    debug(req.query.field);

	var query_field = sanitizer.sanitize(req.query.field);

    try{


        var query= {$or:[{"MY HEALTHEVET PERSONAL INFORMATION REPORT.Name":{ $regex:".*"+query_field+".*", $options:"i" }},
                {"MY HEALTHEVET PERSONAL INFORMATION REPORT.Date of Birth":{ $regex: ".*"+query_field+".*", $options: "i" }}]};

        console.log(query)

        conn.db().collection("bluebutton",function(error,collection){
            if(error){
                debug(error);
                throw new error;
            }else{
                collection.find(query,function(error,cursor){

                    if(cursor){
                        cursor.toArray(function(error,users){
                            debug("VA : "+ JSON.stringify(users));
                            res.send({response: users});
                        });
                    }else{
                        res.send({});
                    }
                });
            }
        });




        /*var id=new ObjectID(req.session.user_profile._id);

        conn.db().collection("users",function(error,collection){
            if(error){
                debug(error);
                throw new error;
            }else{
                collection.findOne({_id:id},{documents:1},function(error,result){

                    if(result && typeof result.documents!='undefined' && result.documents.length>0){
                            var userIds="";
                            var query= {$or:[{"MY HEALTHEVET PERSONAL INFORMATION REPORT.Name":{ $regex:".*one.*", $options:"i" }}, {"MY HEALTHEVET PERSONAL INFORMATION REPORT.Date of Birth":{ $regex: ".*one.*", $options: "i" }}];

                            for(var j=0;j<result.documents.length;++j){
                                if(userIds!='')
                                    userIds+=','
                                userIds+="\"ObjectId('"+result.documents[j].docid+"')\"";
                            }

                            console.log(userIds);
                            query+=userIds;
                            query+=']}}';

                            debug(query);

                            debug(JSON.parse(query));





                    }else{
                        res.send({});
                    }
                });
            }
        });*/



    }catch(error){
        debug(error);
        res.send({error:{msg:'Search type not available'}});
    }
}



