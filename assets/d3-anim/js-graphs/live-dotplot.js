/* global d3 */

var gc = gc || {};

gc.liveplot = gc.liveplot || {};

gc.liveplot.init = function() {
  'use strict';

// Set the dimensions of the canvas / graph
var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = 550 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleLinear()
    .rangeRound([0, width])
    .domain([1, 15]);;
var y = d3.scaleLinear()
    .range([height, 0]);

// Adds the svg canvas
var svg = d3.select("#liveplot .placeholder")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("#liveplot .placeholder").append("div")
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
    y.domain([0, data.length]);


    // Set up the binning parameters for the histogram
    var nbins = data.length;
    var histogram = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(nbins))
      .value(function(d) { return d.Value;} )

    // Compute the histogram
    var bins = histogram(data);

    // radius dependent of data length
    var radius = y(data.length-1)/2

    // bins objects
    var bin_container = svg.selectAll("g .bins")
      .data(bins);


    bin_container.enter().append("g").attr("class", "bins")
      // .attr("transform", function(d) { return "translate(" + (x(d.x0)+(x(d.x1)-x(d.x0))/2) + "," + y(data.length) + ")"; });

    // JOIN new data with old elements.
    var dots = bin_container.selectAll("circle")
      .data(function(d) {
        return d.map(function(data, i){return {"idx": i, "name": data.Name, "value": data.Value, "xpos": x(d.x0)+(x(d.x1)-x(d.x0))/2};})
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
      .attr("fill", "yellow")
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
          .style("fill", "red")
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
            .style("fill", "yellow");
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

svg.selectAll(".domain")
  .styles({ fill:"none", stroke:"white",  "stroke-width":"2" });
      
svg.selectAll("g.tick text")
  .style("fill","white");

svg.selectAll("g.tick line")
  .styles({ fill:"none", stroke:"white",  "stroke-width":"2" });
      

update();
update();
update();

// check every 1 sec
d3.interval(function() {
  update();
}, 10000
);


};

