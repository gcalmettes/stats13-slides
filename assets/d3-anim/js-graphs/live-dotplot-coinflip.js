/* global d3 */

var gc = gc || {};

gc.liveplotcoinflip = gc.liveplotcoinflip || {};

gc.liveplotcoinflip.init = function() {
  'use strict';

// Set the dimensions of the canvas / graph
var margin = {top: 10, right: 30, bottom: 80, left: 30},
    width = 550 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleLinear()
    .rangeRound([0, width])
    .domain([0, 16.5]);;
var y = d3.scaleLinear()
    .range([height, 0]);

// Adds the svg canvas
var svg = d3.select("#liveplotcoinflip .placeholder")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("#liveplotcoinflip .placeholder").append("div")
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
    var radius = 15//y((data.length/2)-1)/2

    // bins objects
    var bin_container = svg.selectAll("g .bins")
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

svg.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .style("font-size","0.5em")
  .call(d3.axisBottom(x));
svg.append("text")             
  .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (height + margin.top + 50) + ")")
  .style("text-anchor", "middle")
  .style("fill", "#d2d2d2")
  .text("Number of heads");

svg.selectAll(".domain")
  .styles({ fill:"none", stroke:"#d2d2d2",  "stroke-width":"2" });
      
svg.selectAll("g.tick text")
  .style("fill","#d2d2d2");

svg.selectAll("g.tick line")
  .styles({ fill:"none", stroke:"#d2d2d2",  "stroke-width":"2" });
      

update();
update();
update();

// check every 1 sec
d3.interval(function() {
  update();
  }, 5000);

};




gc.liveplotcoinflip.init2 = function() {
  'use strict';

// Set the dimensions of the canvas / graph
var margin2 = {top: 10, right: 30, bottom: 80, left: 30},
    width2 = 550 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// Set the ranges
var x2 = d3.scaleLinear()
    .rangeRound([0, width2])
    .domain([0, 16.5]);;
var y2 = d3.scaleLinear()
    .range([height2, 0]);

// Adds the svg canvas
var svg2 = d3.select("#liveplotcoinflip2 .placeholder")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform",
              "translate(" + margin2.left + "," + margin2.top + ")");

// add the tooltip area to the webpage
var tooltip2 = d3.select("#liveplotcoinflip2 .placeholder").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function update2(){

  var publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/1-Vy9Yy4l8FBkP3n-ev9Ntr8TkNpHtginv3sPEVkV_i4/pubhtml?gid=0&single=true";

  // var file = "https://docs.google.com/spreadsheets/d/1-Vy9Yy4l8FBkP3n-ev9Ntr8TkNpHtginv3sPEVkV_i4/gviz/tq?tqx=out:csv&sheet=Sheet1"
  // var file = "src/data/roster.csv"
    var tabletop2 = Tabletop.init( { key: publicSpreadsheetUrl,
                       callback: doGraph2,
                       simpleSheet: true } )

  // Get the data
  function doGraph2(data_or, tabletop) {
     var data2 = data_or
        .map(function(d){
          return {"Name": d.Name, "Value": +d.Value};
        });

    // Scale the range of the data
    // x.domain(d3.extent(data, function(d) { return d.Value; }));
    // y.domain([0, data.length]);
    y2.domain([0, data2.length/2]);


    // Set up the binning parameters for the histogram
    var nbins2 = data2.length;
    var histogram2 = d3.histogram()
      .domain(x2.domain())
      .thresholds(x2.ticks(nbins2))
      .value(function(d) { return d.Value;} )

    // Compute the histogram
    var bins2 = histogram2(data2);

    // radius dependent of data length
    var radius2 = y2((data2.length/2)-1)/2

    // bins objects
    var bin_container2 = svg2.selectAll("g .bins")
      .data(bins2);


    bin_container2.enter().append("g").attr("class", "bins")
      // .attr("transform", function(d) { return "translate(" + (x(d.x0)+(x(d.x1)-x(d.x0))/2) + "," + y(data.length) + ")"; });

    // JOIN new data with old elements.
    var dots2 = bin_container2.selectAll("circle")
      .data(function(d) {
        // return d.map(function(data, i){return {"idx": i, "name": data.Name, "value": data.Value, "xpos": x(d.x0)+(x(d.x1)-x(d.x0))/2};})
        return d.map(function(data, i){return {"idx": i, "name": data.Name, "value": data.Value, "xpos": x2(d.x0)};})
        });

    // EXIT old elements not present in new data.
    dots2.exit()
        .attr("class", "exit")
      .transition(1000)
        .attr("r", 0)
        .remove();

    // UPDATE old elements present in new data.
    dots2.attr("class", "update");

    // ENTER new elements present in new data.
    // var cdots = dots.enter().append("circle")
    dots2.enter().append("circle")
      .attr("class", "enter")
      .attr("fill", "#5bc0de")
      .attr("cx", function (d) {return d.xpos;})
      .attr("cy", function(d) {
          return y2(d.idx)-radius2; })
      // .attr("r", function(d) { return (d.length==0) ? 0 : radius; })
      .attr("r", function(d) {
          return (d.length==0) ? 0 : radius2; })
      //.style("fill", "steelblue")
      .merge(dots2);

    dots2.on("mouseover", function(d) {
        d3.select(this)
          .style("fill", "#d9534f")
        tooltip2.transition()
             .duration(200)
             .style("opacity", .9);
        tooltip2.html(d.name + "<br/> (" + d.value + ")")
          .style("left", d3.select(this).attr("cx") + "px")
          .style("top", (d3.select(this).attr("cy")-50) + "px")
          .style("font-size","0.5em");
      })
      .on("mouseout", function(d) {
        d3.select(this)
            .style("fill", "#5bc0de");
          tooltip2.transition()
               .duration(500)
               .style("opacity", 0);
      });
  };
}

update2();
update2();
update2();


svg2.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height2 + ")")
  .style("font-size","0.5em")
  .call(d3.axisBottom(x2));
svg2.append("text")             
  .attr("transform",
        "translate(" + (width2/2) + " ," + 
                       (height2 + margin2.top + 50) + ")")
  .style("text-anchor", "middle")
  .style("fill", "#d2d2d2")
  .text("Number of heads");

svg2.selectAll(".domain")
  .styles({ fill:"none", stroke:"#d2d2d2",  "stroke-width":"2" });
      
svg2.selectAll("g.tick text")
  .style("fill","#d2d2d2");

svg2.selectAll("g.tick line")
  .styles({ fill:"none", stroke:"#d2d2d2",  "stroke-width":"2" });
      



// check every 1 sec
d3.interval(function() {
  update2();
  }, 5000 );

};



