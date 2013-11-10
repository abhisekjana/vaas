var json_data;
var vital_readings;


$(document).ready(function(){

    $.ajaxSetup ({
        cache: false
    });

    init();

    $('body').click(function(){
        $('#mnuSearch').hide();
    });
});

function loadHealthCareProviders(){
    var tmplHEALTH_CARE_PROVIDERS_html   = $("#tmplHEALTH_CARE_PROVIDERS").html();
    var tmplHEALTH_CARE_PROVIDERS = Handlebars.compile(tmplHEALTH_CARE_PROVIDERS_html);

    var htmlData=tmplHEALTH_CARE_PROVIDERS(json_data.response['HEALTH CARE PROVIDERS']);
    $('#container').html(htmlData);
}

function loadTF(){
    var tmplTREATMENT_FACILITIEShtml   = $("#tmplTREATMENT_FACILITIES").html();
    var tmplTREATMENT_FACILITIE = Handlebars.compile(tmplTREATMENT_FACILITIEShtml);

    var htmlData=tmplTREATMENT_FACILITIE(json_data.response['TREATMENT FACILITIES']);
    $('#container').html(htmlData);
}

function loadHI(){
    var tmplHIhtml   = $("#tmplHI").html();
    var tmplHI = Handlebars.compile(tmplHIhtml);

    var htmlData=tmplHI(json_data.response['HEALTH INSURANCE']);
    $('#container').html(htmlData);
}


function tmplVAMH(){
    var html   = $("#tmplVAMH").html();
    var template = Handlebars.compile(html);

    var htmlData=template(json_data.response['VA MEDICATION HISTORY']);
    $('#container').html(htmlData);
}

function tmplMS(){
    var html   = $("#tmplMS").html();
    var template = Handlebars.compile(html);

    var htmlData=template(json_data.response['MEDICATIONS AND SUPPLEMENTS']);
    $('#container').html(htmlData);
}


function tmplVAA(){
    var html   = $("#tmplVAA").html();
    var template = Handlebars.compile(html);

    var htmlData=template(json_data.response['VA ALLERGIES']);
    $('#container').html(htmlData);
}

function tmplOA(){
    var html   = $("#tmplOA").html();
    var template = Handlebars.compile(html);

    var htmlData=template(json_data.response['ALLERGIES/ADVERSE REACTIONS']);
    $('#container').html(htmlData);
}

function tmplIMMU(){
    var html   = $("#tmplIMMU").html();
    var template = Handlebars.compile(html);

    var htmlData=template(json_data.response['IMMUNIZATIONS']);
    $('#container').html(htmlData);
}

function tmplLabs(){
    var html   = $("#tmplLabs").html();
    var template = Handlebars.compile(html);

    var htmlData=template(json_data.response['VA LABORATORY RESULTS']);
    $('#container').html(htmlData);
}

function tmplLT(){
    var html   = $("#tmplLT").html();
    var template = Handlebars.compile(html);

    var htmlData=template(json_data.response['LABS AND TESTS']);
    $('#container').html(htmlData);
}

function trimDateTime(date){
    var splitDate = date.split("@");
    return $.trim(splitDate[0]);
}

$('.appointmentCalendar').click(function(){
	loadppointmentCalendar();
});

// call this method to display appointments in calender format
function loadppointmentCalendar(){

    var vaAppointments = json_data.response['VA APPOINTMENTS'].Appointments;

    console.log(vaAppointments);
    var lookup = {};
    var result = [];
    var jsonString = "[";
    console.log("VAApp length:"+vaAppointments.length);
    $.each(vaAppointments, function(i, item) {
        console.log(item['Date/Time']);
        var dateTime = item['Date/Time'];
        var type = item['Type'];
        if(type == undefined){
            type = "Appointment";
        }
        //	jsonString = jsonString+"{title:'"+type+"',start:"+new Date(formatDate(trimDateTime(dateTime)))+"}";
        var jsonString1 = {title:type , start: new Date(formatDate(trimDateTime(dateTime)))};
        result.push(jsonString1);
        //var test={test:'test'};

// 		if(vaAppointments.length == (i+1)){
// 			jsonString = jsonString+"]";
// 		}else{
// 			jsonString = jsonString+",";
// 		}

    });
    console.log("jsonString:"+result);

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#container').fullCalendar({
        editable: true,
        events: result
    });

}


function tmplVR(){
    var html   = $("#tmplVR").html();
    var template = Handlebars.compile(html);

    var htmlData=template(json_data.response['VITALS AND READINGS']);
    $('#container').html(htmlData);
}


function tmplFHH(){
    var html   = $("#tmplFHH").html();
    var template = Handlebars.compile(html);

    var htmlData=template(json_data.response['FAMILY HEALTH HISTORY']);
    $('#container').html(htmlData);
}




function init(){


    $('.search-result').hide();


    $('#bttnSearch').click(function(){

        $.getJSON('/search?field='+$('#txtSearch').val(),function(data){

            if(typeof data != 'undefined'){
                if(typeof data.error !='undefined'){
                    console.log(data.error);
                }else
                {
                    var row="";
                    var htmlSearch   = $.trim($('#tmplSearch').html());
                    $.each(data.response, function(key, value) {

                        htmlSearch=htmlSearch.replace(/{{data}}/,value['MY HEALTHEVET PERSONAL INFORMATION REPORT']['Name']+"<span style='color:#aaa'> [ "+
                        value['MY HEALTHEVET PERSONAL INFORMATION REPORT']['Date of Birth']+' ]</span>');

                        htmlSearch=htmlSearch.replace(/{{doc_id}}/,value.doc_id);

                        row+=htmlSearch;
                    });

                    $('#mnuSearch').html(row);

                    $('.search_menu').click(function(){
                            var doc_id= $(this).attr('id');

                            $.ajax({
                                url: "/update_profile",
                                type:'post',
                                data:'&doc_id='+doc_id,
                                complete: function() {
                                    window.open("/", '_self');
                                }
                            });


                    });

                    $('#mnuSearch').show();


                    //$('#mnuSearch').
                }
            }
        });

    });

    $('#mnuHealthCareProviders').click(function(){
        loadHealthCareProviders();
    });
    $('#mnuTF').click(function(){
        loadTF();
    });


    $('#mnuHI').click(function(){
        loadHI();
    });


    $('#mnuVAMH').click(function(){
        tmplVAMH();
    });

    $('#mnuMS').click(function(){
        tmplMS();
    });

    $('#mnuVAA').click(function(){
        tmplVAA();
    });

    $('#mnuOA').click(function(){
        tmplOA();
    });

    $('#mnuIMMU').click(function(){
        tmplIMMU();
    });

    $('#mnuLabs').click(function(){
        tmplLabs();
    });

    $('#mnuLT').click(function(){
        tmplLT();
    });

    $('#mnuVR').click(function(){
        tmplVR();
    });

    $('#mnuFHH').click(function(){
        tmplFHH();
    });


    $('#btnUpload').click(function(){

        window.open("/upload.html", '_blank', "height=200,width=200");

    });

    loadActivity();
    
}


function gup( name ){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
        return "";
    else
        return results[1];
}


function loadRemainderAlerts(data){

	 var tmplRmAlrthtml   = $("#tmplRemainderAlerts").html();
    var templateRmAlrt = Handlebars.compile(tmplRmAlrthtml);

    $('#remainderAlerts').html(templateRmAlrt(data.response['VA WELLNESS REMINDERS']));
    loadppointmentCalendar();
}

function loadActivity(){


        $.getJSON('/data',function(data){

            if(typeof data != 'undefined' && typeof data.response != 'undefined'){
                    // Success
                    json_data=data;

                    var tmplRAhtml   = $("#tmplRA").html();
                    var templateRA = Handlebars.compile(tmplRAhtml);

                    $('#appRA').html(templateRA(json_data.response['VA APPOINTMENTS']['Appointments'][0]));

                    var tmplMHHhtml   = $("#tmplMHH").html();
                    var templateMHH = Handlebars.compile(tmplMHHhtml);

                    $('#appMHH').html(templateMHH(json_data.response['MILITARY HEALTH HISTORY']));


                    var tmplDemo1html   = $("#tmplDemo1").html();
                    var templateDemo1 = Handlebars.compile(tmplDemo1html);

                    $('#demo1').html(templateDemo1(json_data.response['DEMOGRAPHICS']));

                    var familyHealth = json_data.response['VITALS AND READINGS'].Reading;

                    console.log(familyHealth);
                    var lookup = {};
                    var result = [];
                    $.each(familyHealth, function(i, item) {
                        console.log(item['Measurement Type']);
                        var name = item['Measurement Type'];

                        if (!(name in lookup)) {
                            lookup[name] = 1;
                            result.push(name);
                        }
                    });
                    console.log(result);
                    vital_readings = result;
            	loadRemainderAlerts(json_data);
                    $('#mnuHealthCareProviders').children(':first-child').children(':first-child').next().html(json_data.response['HEALTH CARE PROVIDERS']['Providers'].length);
                    $('#mnuTF').children(':first-child').children(':first-child').next().html(json_data.response['TREATMENT FACILITIES']['Facilities'].length);
                    $('#mnuHI').children(':first-child').children(':first-child').next().html(json_data.response['HEALTH INSURANCE']['Companies'].length);
                    $('#mnuMH').children(':first-child').next().html(json_data.response['VA MEDICATION HISTORY']['Medications'].length+json_data.response['MEDICATIONS AND SUPPLEMENTS']['Medications'].length);
                    $('#mnuAL').children(':first-child').next().html(json_data.response['VA ALLERGIES']['Allergies'].length+json_data.response['ALLERGIES/ADVERSE REACTIONS']['Allergies'].length);
                    $('#mnuIMMU').children(':first-child').children(':first-child').next().html(json_data.response['IMMUNIZATIONS']['Immunizations'].length);
                    $('#mnuLT').children(':first-child').next().html(json_data.response['VA LABORATORY RESULTS']['Labs'].length
                                                        +json_data.response['LABS AND TESTS']['Labs'].length+json_data.response['VITALS AND READINGS']['Reading'].length);

                    $('#mnuFHH').children(':first-child').children(':first-child').next().html(json_data.response['FAMILY HEALTH HISTORY']['Relation'].length);


            }else if(typeof data.error !='undefined'){
                console.log(data.error);
            }else{
               window.open("/upload", '_self');
            }
        });

}



Handlebars.registerHelper("getDate", function(date) {

    if(typeof date!='undefined'){
        if($.trim(date)!=''){
            var arr=date.split(" ");
            return arr[0];
        }
    }

    return 01;

});

Handlebars.registerHelper("getMonth", function(date) {

    if(typeof date!='undefined'){
        if($.trim(date)!=''){
            var arr=date.split(" ");
            if(arr.length>1)
                return arr[1];
            else
                return "Jan";
        }
    }

    return "Jan";

});

Handlebars.registerHelper("getYear", function(date) {
    console.log(date);
    if(typeof date!='undefined'){
        if($.trim(date)!=''){
            var arr=date.split(" ");
            if(arr.length>2)
                return arr[2];
            else
                return "2010";
        }
    }
    return "2010";
});
Handlebars.registerHelper("formatTime", function(time) {

    if(typeof time!='undefined'){
        if($.trim(time)!=''){

            return time.substr(0,2)+':'+time.substr(2,3);
        }
    }
    return "";
});

function loadHealthHistory(){
    var tmplHEALTH_HISTORY_html   = $("#tmpl_MIL_HEALTH_HISTORY").html();
    var tmplHEALTH_HISTORY = Handlebars.compile(tmplHEALTH_HISTORY_html);
    var htmlData=tmplHEALTH_HISTORY(json_data.response['FAMILY HEALTH HISTORY']);
    $('#container').html(htmlData);
    //loadGraph("");
}

$(document).ready(function(){$('#vital_readings_list').on('change','select',function() {
	alert('In');
    nwval =  $(this).val();
    console.log("selected value:"+nwval);
    loadGraph(nwval);
});
$('.callGraph').click(function(){
	loadGraph(undefined);
    var strSel = '<select id="vital_readings_list" class="graphSelectClass" onchange="javascript:abc()">';
    for(var j = 0 ; j < vital_readings.length ; ){
    	strSel = strSel+"<option>"+vital_readings[j]+"</option>" ;
        j++;
    }
    strSel = strSel+"</select>";
	$("#graphDropDown").html(strSel);
});
});

function abc(){

	var selected = document.getElementById("vital_readings_list");
	var strUser = selected.options[selected.selectedIndex].value;
	loadGraph(strUser);
}

function loadGraph(itemType){
	var familyHealth = json_data.response['VITALS AND READINGS'].Reading;
//
//	console.log(familyHealth);
//	var lookup = {};
	var result = vital_readings;
//	$.each(familyHealth, function(i, item) {
//		console.log(item['Measurement Type']);
//		var name = item['Measurement Type'];
//
//		  if (!(name in lookup)) {
//		    lookup[name] = 1;
//		    result.push(name);
//		  }
//	});
	console.log(result);
	var dataElem2 = [];
	var dataElem1 = [];
	var itemUnit = "";
	if(itemType == null || itemType == undefined || itemType == ""){
		itemType = result[0];
	}
	$.each(result,function(i,item){

		$.each(familyHealth,function(j,fh){

			if(item == fh['Measurement Type'] && item == itemType){
				console.log(item);
				var dataElem = [];
				dataElem.push(formatDate(fh['Date']));
				 if(item == "Heart rate"){
					dataElem.push(parseInt(fh['Heart Rate']));
					itemUnit="Heart Rate";
				}else if(item == "Body weight"){
					dataElem.push(parseInt(fh['Body Weight']));
					itemUnit="Body Weight";
				}else if(item == "Pain"){
					dataElem.push(parseInt(fh['Pain Level']));
					itemUnit="Pain Level";
				}else if(item == "Cholesterol"){
					dataElem.push(parseInt(fh['Total cholesterol']));
					itemUnit="Total cholesterol";
				}else if(item == "Blood sugar"){
					dataElem.push(parseInt(fh['Blood sugar count']));
					itemUnit="Blood sugar count";
				}else if(item == "Blood pressure"){
					dataElem.push(parseInt(fh['Systolic']));
					itemUnit="Systolic";
				}else{
					dataElem.push(fh[item]);
					itemUnit = item;
				}

				dataElem1.push(dataElem);
			}else if(item == "Blood pressure"){

			}
		});
//		if(item == itemType){
//			dataElem2.push(dataElem1);
//			console.log(dataElem2);
//		}


	});
	console.log(">>>"+dataElem1.length);
	console.log(">>>"+dataElem1);
	createGraph(itemUnit,itemType,dataElem1);
}

function formatDate(date){
	var x = 0;
	var res = date.split(" ");
	var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	for(var i=0 ; i<12;i++){
		if(res[1] == month[i]){
			x = i;
			break;
		}
	}
	//var monthNum = x;
	var dd = Date.UTC(res[2],x,res[0]);
	console.log(date +"----:"+ dd)
	return dd;
}

function createGraph(itemUnit,itemType , dataElements){

	$(function () {
	    $('#graphContainer').highcharts({
	        chart: {
	            type: 'spline'
	        },
	        title: {
	            text: itemType
	        },
	        subtitle: {
	            text: ''
	        },
	        xAxis: {
	            type: 'datetime',
	            dateTimeLabelFormats: { // don't display the dummy year
	                month: '%e. %b',
	                year: '%b'
	            }
	        },
	        yAxis: {
	            title: {
	                text: itemUnit
	            },
	            min: 0
	        },
	        tooltip: {
	            formatter: function() {
	            	console.log('<b>'+ this.series.name +'</b><br/>'+Highcharts.dateFormat('%e. %b', this.x) +': '+ this.y +' m');
	                    return '<b>'+ this.series.name +'</b><br/>'+
	                    Highcharts.dateFormat('%e. %b', this.x) +': '+ this.y +' m';
	            }
	        },

	        series: [{
	            name: itemType,
	           // data: [[[1270166400000, 246], [1272758400000, 244], [1275436800000, 242]]]
	            data:dataElements
	        }]
	    });
	});
}
