/* global d3 */

var gc = gc || {};

gc.livesamplingwords = gc.livesamplingwords || {};

gc.livesamplingwords.init = function() {
  'use strict';

// Set the dimensions of the canvas / graph
var margin = {top: 10, right: 30, bottom: 80, left: 30},
    width = 550 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

gc.livesamplingwords.width = width;
gc.livesamplingwords.height = height;

// Set the ranges
var x = d3.scaleLinear()
    .rangeRound([0, width])
    .domain([1, 11.5]);
var y = d3.scaleLinear()
    .range([height, 0]);

// Adds the svg canvas
gc.livesamplingwords.svg = d3.select("#livesamplingwords .placeholder")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("class", "meangraph")
    .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("#livesamplingwords .placeholder").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function update(){

  var t = d3.transition()
      .duration(1000);

  var publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/1-Vy9Yy4l8FBkP3n-ev9Ntr8TkNpHtginv3sPEVkV_i4/pubhtml?gid=0&single=true";

  // var file = "https://docs.google.com/spreadsheets/d/1-Vy9Yy4l8FBkP3n-ev9Ntr8TkNpHtginv3sPEVkV_i4/gviz/tq?tqx=out:csv&sheet=Sheet1"
  // var file = "src/data/roster.csv"
    var tabletop = Tabletop.init( { key: publicSpreadsheetUrl,
                       callback: doGraph,
                       simpleSheet: true } )

  // Get the data
  function doGraph(data_or, tabletop) {
     var data = data_or
        .map(function(d){
          return {"Name": d.Name, "Value": +d.Value};
        });

    // Scale the range of the data
    // x.domain(d3.extent(data, function(d) { return d.Value; }));
    // y.domain([0, data.length]);
    y.domain([0, data.length/2]);


    // Set up the binning parameters for the histogram
    var nbins = data.length;
    var histogram = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(nbins))
      .value(function(d) { return d.Value;} )

    // Compute the histogram
    var bins = histogram(data);

    // radius dependent of data length
    var radius = y((data.length/2)-1)/2

    // bins objects
    var bin_container = gc.livesamplingwords.svg.selectAll("g .bins")
      .data(bins);


    bin_container.enter().append("g").attr("class", "bins")
      // .attr("transform", function(d) { return "translate(" + (x(d.x0)+(x(d.x1)-x(d.x0))/2) + "," + y(data.length) + ")"; });

    // JOIN new data with old elements.
    var dots = bin_container.selectAll("circle")
      .data(function(d) {
        // return d.map(function(data, i){return {"idx": i, "name": data.Name, "value": data.Value, "xpos": x(d.x0)+(x(d.x1)-x(d.x0))/2};})
        return d.map(function(data, i){return {"idx": i, "name": data.Name, "value": data.Value, "xpos": x(d.x0)};})
        });

    // EXIT old elements not present in new data.
    dots.exit()
        .attr("class", "exit")
      .transition(t)
        .attr("r", 0)
        .remove();

    // UPDATE old elements present in new data.
    dots.attr("class", "update");

    // ENTER new elements present in new data.
    // var cdots = dots.enter().append("circle")
    dots.enter().append("circle")
      .attr("class", "enter")
      .attr("fill", "#5bc0de")
      .attr("cx", function (d) {return d.xpos;})
      .attr("cy", function(d) {
          return y(d.idx)-radius; })
      // .attr("r", function(d) { return (d.length==0) ? 0 : radius; })
      .attr("r", 0)
      //.style("fill", "steelblue")
      .merge(dots);


    dots.transition()
        .duration(500)
        .attr("r", function(d) {
          return (d.length==0) ? 0 : radius; });
        // .style("fill", "black");

    dots.on("mouseover", function(d) {
        d3.select(this)
          .style("fill", "#d9534f")
        tooltip.transition()
             .duration(200)
             .style("opacity", .9);
        tooltip.html(d.name + "<br/> (" + d.value + ")")
          .style("left", d3.select(this).attr("cx") + "px")
          .style("top", (d3.select(this).attr("cy")-50) + "px")
          .style("font-size","0.5em");
      })
      .on("mouseout", function(d) {
        d3.select(this)
            .style("fill", "#5bc0de");
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
  };
}

gc.livesamplingwords.svg.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .style("font-size","0.5em")
  .call(d3.axisBottom(x));
gc.livesamplingwords.svg.append("text")             
  .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (height + margin.top + 50) + ")")
  .style("text-anchor", "middle")
  .style("fill", "#d2d2d2")
  .style("font-size","0.7em")
  .text("Words length (mean)");

gc.livesamplingwords.svg.selectAll(".domain")
  .styles({ fill:"none", stroke:"#d2d2d2",  "stroke-width":"2" });
      
gc.livesamplingwords.svg.selectAll("g.tick text")
  .style("fill","#d2d2d2");

gc.livesamplingwords.svg.selectAll("g.tick line")
  .styles({ fill:"none", stroke:"#d2d2d2",  "stroke-width":"2" });

update();
update();
update();

// check every 1 sec
d3.interval(function() {
  update();
  }, 5000);

};

// sort data in data points plot
gc.livesamplingwords.show_mean = function() {
  if(d3.select("#checkbox_showmean").property("checked")){
    var x = d3.scaleLinear()
      .range([0, gc.livesamplingwords.width])
      .domain([1, 11.5]);
    gc.livesamplingwords.svg
      .append("svg:line")
        .attr("class", "line")
        .attr("x1", x(4.29))
        .attr("y1", gc.livesamplingwords.height)
        .attr("x2", x(4.29))
        .attr("y2", 0)
        .style("stroke-width", 4)
        .style("stroke", "#d9534f")
        .style("fill", "none");
    gc.livesamplingwords.svg
      .append("text")
        .attr("class", "textline")
        .attr("x", x(4.4)) //a bit shifted to the right
        .attr("y", 20)
        .style("fill", "#d9534f")
        .style("font-size","0.7em")
        .text("4.29");
        
  } else {
    gc.livesamplingwords.svg.selectAll(".line").remove();
    gc.livesamplingwords.svg.selectAll(".textline").remove();
  }
};

// sort data in data points plot
d3.select('#livesamplingwords #checkbox_showmean')
  .on("change", gc.livesamplingwords.show_mean);



