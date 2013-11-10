




var debug = require('debug'),
    sanitizer = require('sanitizer'),
    childProcess = require('child_process'),
    ObjectID = require('mongodb').ObjectID,
    fs=require('fs'),
    S=require('string'),
    conn=require('../module/database');

exports.upload=upload;

function upload(req,res){
    var file = req.files.ccda.path;
    var filextn = file.substr(file.length-4,4);
    if (filextn == '.txt') {
        console.log('Uploading text file');
        parseDocument(req,res);
    } else if (filextn == 'json') {
        console.log('Uploading json file');
        upload_file(req,res,req.files.ccda.path);
    } else {
        res.send({error:{msg:'Upload failed!. Unknown File Extension'}});
    }
}

function parseDocument(req,res){
    var child = childProcess.exec('jruby -S C:\\dev\\blue_button_parser-master\\test\\command.rb '+ req.files.ccda.path+' '+req.files.ccda.path+'.json', function (error, stdout, stderr) {
        console.log(req.files.ccda.path,req.files.ccda.path);
        if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
            console.log('Child Process STDOUT: '+stdout);
            console.log('Child Process STDERR: '+stderr);
        }
        console.log('Child Process STDOUT: '+stdout);
        console.log('Child Process STDERR: '+stderr);
    });
    child.on('exit', function (code) {
        console.log('Child Process STDOUT: '+child.stdout);
        console.log('Child Process STDERR: '+child.stderr);
        upload_file(req,res,req.files.ccda.path+".json");
    });
};


function upload_file(req,res,jsonfile){
    debug("Upload starting");
    /**	parser = spawn('jruby -S C:\\dev\\blue_button_parser-master\\testcommand.rb', [req.files.ccda.path,req.files.ccda.path+".json"]);
     grep.on('close', function (code, signal) {
		if (code == 0){
			insertBlueButtonFiletoDB(req,res);
		}
	}); **/

    var data=fs.readFileSync(jsonfile);

    conn.db().collection("bluebutton",function(error,collection){

        if(error){
            debug(error);
            throw new error;
        }else{
            //data.replaceAll();
            var semicleanString = S(data).replaceAll('=>', ':').s;
            var cleanString = S(semicleanString).replaceAll(':nil', ':""').s;
            console.log(cleanString);
            data = cleanString;

            collection.insert(JSON.parse(data), {safe: true},function(error,records){
                if (error) {
                    res.send({error:{msg:'Upload failed!'}});
                } else {

                    console.log(records[0]._id);
                    var user_obj_id=req.session.user_profile._id;
                    //var user_obj_id='5274a5920bb49e2c29000001';
                    conn.db().collection("users",function(error,collection){
                        if(error){
                            debug(error);
                            throw new error;
                        }else{
                            collection.update({_id:new ObjectID(user_obj_id)},{$push: {documents: {docid: records[0]._id}}},res,function(error,result){
                                console.log("error"+error);
                                console.log("result"+result);
                                if(error){
                                    debug(error);
                                    debug("bluebutton : "+ JSON.stringify(error));
                                    res.send({error:{msg:'Upload failed!'}});
                                    throw new error;
                                }else{
                                   res.redirect("/");
                                }
                            });
                        };
                    });
                }
            });
        };
    });

};