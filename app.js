// use d3 to bring in samples.json and show it
function createdata(){
    // create dropdown menu
    var dropdownmenu = d3.select("#selDataset");
    //pull in the samples data 
    d3.json("samples.json").then(function(data){
        console.log(data);
        //bring sample ids into an array
        var sampleidarry = data.names;
        // loop through ids in the array to grab ids for selector
        sampleidarry.forEach(function(element){
            dropdownmenu.append("option").text(element).property("value",element);
        });
    });
};

//building charts
function buildcharts(bothchartsample){
    // pull in sample data
    d3.json("samples.json").then(function(data){
        //make a variable to filter on and then filter on ID to build array
        var allsampledata = data.samples;
        var filtereddata = allsampledata.filter(function(sampledata){
            return sampledata.id == bothchartsample;
        });
        var bothchartsampledata = filtereddata[0];

        //create values for charts from instructions
        var sample_values = bothchartsampledata.sample_values;
        // slice to only show 10 for x for bar chart
        var sample_values_x = sample_values.slice(0,10);
        var otu_ids = bothchartsampledata.otu_ids;
        var otu_labels = bothchartsampledata.otu_labels;

        //bubble chart trace
        var bubbletracedata = [{
            x: otu_ids,
            y: sample_values,
            type: "scatter",
            mode: "markers",
            marker:{
                size: sample_values,
                color: otu_ids,
                colorscale: "Viridis"
            },
            text: otu_labels
        }];

        //bubble chart layout
        bubblelayout = {
            xaxis:{title: "OTU ID's"},
            yaxis:{title: "Sample Values"},
            title:"Bubble chart that displays each sample"
        }
        //Plot the bubble chart
        Plotly.newPlot("bubble",bubbletracedata,bubblelayout);

        //bar chart trace
        var bartracedata = [{
            x: sample_values_x,
            //for y only slice 10 associated with the right value
            y: otu_ids.slice(0,10).map(function (otuID){
                return `OTU ${otuID}`
                }),
            type: "bar",
            orientation: 'h',
            text: otu_labels
        }];

        //bar chart layout
        barlayout = {
            xaxis:{title: "Sample Values"},
            yaxis:{title: "OTU IDs"},
            title:"Top 10 OTUs Found in Selected Individual"
        }
        // plot bar chart
        Plotly.newPlot("bar",bartracedata,barlayout);

    });
};

buildcharts(940);

//building sample metdata
function selectmetdata(selecteddatasample){
    //make a variable to add info card to html and then clear sample
    var samplemetadatacard = d3.select("#sample-metadata");
    samplemetadatacard.html("");
    d3.json("samples.json").then(function(data){
        // make an array of all sample metdata
        var allsamplemetdata = data.metadata;
        var filtereddata = allsamplemetdata.filter(function(samplemetadata){
            return samplemetadata.id == selecteddatasample;
        });
        var metaData = filtereddata[0];
        //run through the metadata
        for(const [key,value] of Object.entries(metaData)){
            //add metadata info to each key value pair
            samplemetadatacard.append("p").text(`${key}: ${value}`);
        }
    });
};

selectmetdata(940);

// selector changed function called out in html
function optionChanged (selecteddatasample){
    buildcharts(selecteddatasample);
    selectmetdata(selecteddatasample);
};

createdata();