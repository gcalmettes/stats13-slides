/* global d3 */

var gc = gc || {};

gc.histogram = gc.histogram || {};

// Set the dimensions of the canvas / graph
gc.histogram.margin = {top: 15, right: 30, bottom: 140, left: 30};
gc.histogram.margin2 = {top: 360, right: 30, bottom: 30, left: 30};
    
gc.histogram.width = 850 - gc.histogram.margin.left - gc.histogram.margin.right;
gc.histogram.height = 450 - gc.histogram.margin.top - gc.histogram.margin.bottom;
gc.histogram.height2 = 450 - gc.histogram.margin2.top - gc.histogram.margin2.bottom;

gc.histogram.nsample = 500;

// possible distributions to plot
gc.histogram.dist = [
  {name: 'normal', data: d3.range(gc.histogram.nsample).map(d3.randomNormal(0.5, 0.1))},
  {name: 'random', data: d3.range(gc.histogram.nsample).map(d3.randomUniform(0, 1))},
  {name: 'exponential', data: d3.range(gc.histogram.nsample).map(d3.randomExponential(9))},
  {name: 'lognormal', data: d3.range(gc.histogram.nsample).map(d3.randomLogNormal(-1.5,0.5))}
];

// initial dataset and subset of dataset (data)
gc.histogram.dataset = gc.histogram.dist.filter(function (d) {
  return d.name==d3.select('#histogram #dist_select').property('value')
  })
  .map(function (d) {
    return d.data
  })[0];
gc.histogram.data = gc.histogram.dataset;
// initial bounds for brush
gc.histogram.minBound = 0;
gc.histogram.maxBound = gc.histogram.data.length;
// initial histogram setup
gc.histogram.nbins = 10;
gc.histogram.ymax = gc.histogram.data.length;
// format of text on histogram bars
gc.histogram.formatCount = d3.format(",.0f");

// the svg container
gc.histogram.svg = d3.select("#histogram .placeholder").append("svg")
    .attr("width", gc.histogram.width + gc.histogram.margin.left + gc.histogram.margin.right)
    .attr("height", gc.histogram.height + gc.histogram.margin.top + gc.histogram.margin.bottom);
// histogram   
gc.histogram.hist_plot = gc.histogram.svg.append("g")
    .attr("transform", "translate(" + gc.histogram.margin.left + "," + gc.histogram.margin.top + ")");
// individual data plot
gc.histogram.data_plot = gc.histogram.svg.append("g")
    .attr("transform", "translate(" + gc.histogram.margin2.left + "," + gc.histogram.margin2.top + ")");

gc.histogram.xscale = d3.scaleLinear()
        .rangeRound([0, gc.histogram.width]);
gc.histogram.xscale2 = d3.scaleLinear()
        .domain([0, gc.histogram.data.length])
        .rangeRound([0, gc.histogram.width])

// x axis for histogram
gc.histogram.hist_plot.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + gc.histogram.height + ")")
    .call(d3.axisBottom(gc.histogram.xscale));

// x axis for data points plot
gc.histogram.data_plot.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + gc.histogram.height2 + ")")
    .call(d3.axisBottom(gc.histogram.xscale2));

// axis in white
gc.histogram.svg.selectAll(".domain")
  .styles({ fill:"none", stroke:"white",  "stroke-width":"2" });
gc.histogram.svg.selectAll("g.tick text")
  .style("fill","white")
  .style("font-size", "1.5em");
gc.histogram.svg.selectAll("g.tick line")
  .styles({ fill:"none", stroke:"white",  "stroke-width":"2" });


// Main plot function
gc.histogram.update = function() {
  'use strict';
  // main histogram
  gc.histogram.bins = d3.histogram()
    .domain(gc.histogram.xscale.domain())
    .thresholds(d3.range(gc.histogram.xscale.domain()[0], gc.histogram.xscale.domain()[1], (gc.histogram.xscale.domain()[1]-gc.histogram.xscale.domain()[0])/gc.histogram.nbins))
    (gc.histogram.data);
  
  gc.histogram.bins = gc.histogram.bins.filter(function (d) {return d.length>0})

  gc.histogram.hist_plot.selectAll(".bar").remove();
  gc.histogram.data_plot.selectAll(".bar").remove();
  
  gc.histogram.yscale = d3.scaleLinear()
    .domain([0, gc.histogram.ymax])
    .range([gc.histogram.height, 0]);
  
  gc.histogram.bar = gc.histogram.hist_plot.selectAll(".bar")
    .data(gc.histogram.bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + gc.histogram.xscale(d.x0) + "," + gc.histogram.yscale(d.length) + ")"; });
  
  gc.histogram.bar.append("rect")
    .attr("fill", "steelblue")
    .attr("x", 1)
    .attr("width", gc.histogram.xscale(gc.histogram.bins[0].x1) - gc.histogram.xscale(gc.histogram.bins[0].x0) - 1)
    .attr("height", function(d) {return gc.histogram.height - gc.histogram.yscale(d.length); });
  
  gc.histogram.bar.append("text")
    .style("fill", "white")
    .style("font-size", "0.3em")
    .attr("dy", ".75em")
    .attr("y", -14)
    .attr("x", (gc.histogram.xscale(gc.histogram.bins[0].x1) - gc.histogram.xscale(gc.histogram.bins[0].x0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return gc.histogram.formatCount(d.length); });
  
  // individual data
  gc.histogram.yscale2 = d3.scaleLinear()
    .domain([0, d3.max(gc.histogram.dataset)*1.2])
    .range([gc.histogram.height2, 0])
  
  gc.histogram.databars = gc.histogram.data_plot.selectAll(".bar")
    .data(gc.histogram.dataset)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("fill", "steelblue")
      .attr("x", function(d,i){return gc.histogram.xscale2(i);})
      .attr("y", function(d){return gc.histogram.yscale2(d);})
      .attr("width", gc.histogram.xscale2(1))
      .attr("height", function(d){return gc.histogram.height2-gc.histogram.yscale2(d);});
};

// normalize height of bars in histogram
gc.histogram.normalize_bars = function () {
  if(d3.select("#histogram #checkbox_norm").property("checked")){
    gc.histogram.bins = d3.histogram()
      .domain(gc.histogram.xscale.domain())
      .thresholds(d3.range(gc.histogram.xscale.domain()[0], gc.histogram.xscale.domain()[1], (gc.histogram.xscale.domain()[1]-gc.histogram.xscale.domain()[0])/gc.histogram.nbins))
      (gc.histogram.data)
    gc.histogram.ymax = d3.max(gc.histogram.bins, function(d) { return d.length; });
  } else {
    gc.histogram.ymax = gc.histogram.data.length;         
  }  
  gc.histogram.update();
};

// sort data in data points plot
gc.histogram.sort_data = function() {
  if(d3.select("#checkbox_sort").property("checked")){
      gc.histogram.dataset.sort(function(a, b){return a-b});
  } else {
      d3.shuffle(gc.histogram.dataset);
  }
  gc.histogram.data = gc.histogram.dataset.slice(gc.histogram.minBound, gc.histogram.maxBound);
  gc.histogram.normalize_bars();
  gc.histogram.update();
};

// Refresh histogram based on selectd data
gc.histogram.selectData = function(ds, start, end) {
  gc.histogram.data = ds.slice(start, end);
  // data = ds.filter(function(d,i){
  //     return (i <= end) && (i >= start);
  // })
  gc.histogram.update();
};

// brush-select data to be plotted in histogram
gc.histogram.brushed = function() {
  gc.histogram.Bounds = d3.event.selection.map(gc.histogram.xscale2.invert),
    roundedBounds = gc.histogram.Bounds.map(Math.round);
  gc.histogram.selectData(gc.histogram.dataset, roundedBounds[0], roundedBounds[1]);
  gc.histogram.normalize_bars();
  gc.histogram.update();
  gc.histogram.minBound = roundedBounds[0];
  gc.histogram.maxBound = roundedBounds[1];
};

//brush to select data
gc.histogram.brush = d3.brushX()
    .extent([[0, 0], [gc.histogram.width, gc.histogram.height2]])
    .on("brush", gc.histogram.brushed);

gc.histogram.data_plot.append("g")
    .attr("class", "brush")
    .call(gc.histogram.brush)
    .call(gc.histogram.brush.move, gc.histogram.xscale2.range());

// INPUT FUNCTIONS
// dataset distribution
d3.select("#histogram #dist_select")
  .on("input", function () {
    selectedDist = d3.select('#histogram #dist_select').property('value');
    gc.histogram.dataset = gc.histogram.dist.filter(function (d) {
      return d.name==selectedDist
      })
      .map(function (d) {
          return d.data
          })[0];
    gc.histogram.sort_data();
    gc.histogram.data = gc.histogram.dataset.slice(gc.histogram.minBound, gc.histogram.maxBound);
    gc.histogram.normalize_bars();
    gc.histogram.update();
});
// number of bins
d3.select("#histogram #nbins")
  .on("input", function () {
    gc.histogram.nbins = +this.value;
    d3.select("#histogram #nbins-value").text(+this.value);
    gc.histogram.normalize_bars();
    gc.histogram.update();
});

// normalization of histogram bars height
d3.select('#histogram #checkbox_norm')
  .on("change", gc.histogram.normalize_bars);

// sort data in data points plot
d3.select('#histogram #checkbox_sort')
  .on("change", gc.histogram.sort_data);



