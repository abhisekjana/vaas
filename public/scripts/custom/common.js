

function populateFilter(data,field){
    var filterData={};
    try{

        $.each(data,function(index,value){
            var keys = $.map( filterData, function( value, key ) {
                return key;
            });
            if($.inArray(value[field],keys)!=-1){
                filterData[value[field]]+=1;
            }else{
                filterData[value[field]]=1;
            }

        });

        console.log(filterData);

    }catch(error){
        console.log(error);
    }

    return filterData;

}

var DateFormats = {
    short: "DD MMMM - YYYY",
    long: "dddd DD.MM.YYYY HH:mm"
};

/*Handlebars.registerHelper("formatDate", function(datetime, format) {
    if (moment) {
        f = DateFormats[format];
        return moment(datetime).format(f);
    }
    else {
        return datetime;
    }
});*/

function formatJsonDate(jsonDt)
{
    var MIN_DATE = -62135578800000; // const
    if(jsonDt !=null && jsonDt!= "" && jsonDt!=undefined)
    {
        //var date = new Date(parseInt(jsonDt.substr(6, jsonDt.length-8)));

        var intVal = parseInt(jsonDt);
        if(intVal <31312013)
            return jsonDt;

        var date = new Date(parseInt(jsonDt));


        if(!(isNaN(date.getMonth()) || isNaN(date.getDate()) || isNaN(date.getFullYear())))
        {
            return date.toString() == new Date(MIN_DATE).toString() ? "" : (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        }
        else
        {
            return jsonDt;
        }
    }
    else
    {
        return "";
    }
}

function formatJsonDateToFull(jsonDt)
{
    var MIN_DATE = -62135578800000; // const
    if(jsonDt !=null && jsonDt!= "" && jsonDt!=undefined)
    {
        //var date = new Date(parseInt(jsonDt.substr(6, jsonDt.length-8)));

        var intVal = parseInt(jsonDt);
        if(intVal <31312013)
            return jsonDt;

        var date = new Date(parseInt(jsonDt));


        if(!(isNaN(date.getMonth()) || isNaN(date.getDate()) || isNaN(date.getFullYear())))
        {

            var hours = date.getHours() == 0 ? "12" : date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
            var minutes = (date.getMinutes() < 9 ? "0" : "") + date.getMinutes();
            var ampm = date.getHours() < 12 ? "AM" : "PM";
            var formattedTime = hours + ":" + minutes + " " + ampm;

            return date.toString() == new Date(MIN_DATE).toString() ? "" : (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear()+" "+formattedTime;
        }
        else
        {
            return jsonDt;
        }
    }
    else
    {
        return "";
    }
}