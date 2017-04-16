/* global d3 */

var gc = gc || {};

gc.samplingdist = gc.samplingdist || {};

// Set the dimensions of the canvas / graph
gc.samplingdist.margin = {top: 15, right: 30, bottom: 100, left: 30};
    
gc.samplingdist.width = 850 - gc.samplingdist.margin.left - gc.samplingdist.margin.right;
gc.samplingdist.height = 450 - gc.samplingdist.margin.top - gc.samplingdist.margin.bottom;


// initial dataset (array of size populationsize with proportion of 1)
gc.samplingdist.populationsize = 500
gc.samplingdist.proportion = 0.5
gc.samplingdist.samplesize = 25
gc.samplingdist.nsample = 100


// the svg container
gc.samplingdist.svg = d3.select("#samplingdist .placeholder").append("svg")
    .attr("width", gc.samplingdist.width + gc.samplingdist.margin.left + gc.samplingdist.margin.right)
    .attr("height", gc.samplingdist.height + gc.samplingdist.margin.top + gc.samplingdist.margin.bottom);
// histogram   
gc.samplingdist.hist_plot = gc.samplingdist.svg.append("g")
    .attr("transform", "translate(" + gc.samplingdist.margin.left + "," + gc.samplingdist.margin.top + ")");

gc.samplingdist.xscale = d3.scaleLinear()
        .range([0, gc.samplingdist.width]);
gc.samplingdist.yscale = d3.scaleLinear()
        .range([gc.samplingdist.height, 0]);

// x axis for histogram
gc.samplingdist.hist_plot.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + gc.samplingdist.height + ")")
    .call(d3.axisBottom(gc.samplingdist.xscale));
gc.samplingdist.hist_plot.append("text")             
  .attr("transform",
        "translate(" + (gc.samplingdist.width/2) + " ," + 
                       (gc.samplingdist.height + gc.samplingdist.margin.top + 50) + ")")
  .style("text-anchor", "middle")
  .style("fill", "#d2d2d2")
  .text("Proportion");

// axis in white
gc.samplingdist.svg.selectAll(".domain")
  .styles({ fill:"none", stroke:"white",  "stroke-width":"2" });
gc.samplingdist.svg.selectAll("g.tick text")
  .style("fill","white")
  .style("font-size", "2em");
gc.samplingdist.svg.selectAll("g.tick line")
  .styles({ fill:"none", stroke:"white",  "stroke-width":"2" });


gc.samplingdist.drawdata = function() {
  //Population data
  gc.samplingdist.population = d3.range(gc.samplingdist.populationsize)
    .map((v, index, array) => index < gc.samplingdist.proportion * array.length ? 1 : 0)
  //Sampling the population data
  gc.samplingdist.data = d3.range(gc.samplingdist.nsample)
    .map(v => {
        // create a random sample of size `samplesize`,
        const sample = d3.shuffle(gc.samplingdist.population).slice(0, gc.samplingdist.samplesize)
        // and return mean.
        return d3.mean(sample)
        })
}

// Main plot function
gc.samplingdist.update = function() {
  'use strict';

  //create the dataset
  gc.samplingdist.drawdata()

  // main histogram
  gc.samplingdist.bins = d3.histogram()
    .domain(gc.samplingdist.xscale.domain())
    .thresholds(gc.samplingdist.xscale.ticks(Math.min(100, gc.samplingdist.samplesize)))
    (gc.samplingdist.data);
 
  // gc.samplingdist.bins = gc.samplingdist.bins.filter(function (d) {return d.length>0})

  gc.samplingdist.hist_plot.selectAll(".bar").remove();
  gc.samplingdist.hist_plot.selectAll(".line").remove();
  
  // Set y-scale based on data. 
  gc.samplingdist.yscale.domain([0, d3.max(gc.samplingdist.bins, d => d.length)]);
  
  gc.samplingdist.bar = gc.samplingdist.hist_plot.selectAll(".bar")
    .data(gc.samplingdist.bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + gc.samplingdist.xscale(d.x0) + "," + gc.samplingdist.yscale(d.length) + ")"; });
  
  gc.samplingdist.bar.append("rect")
    .attr("fill", "steelblue")
    .attr("x", 1)
    .attr("width", gc.samplingdist.xscale(gc.samplingdist.bins[0].x1) - gc.samplingdist.xscale(gc.samplingdist.bins[0].x0) - 1)
    .attr("height", function(d) {return gc.samplingdist.height - gc.samplingdist.yscale(d.length); });

  gc.samplingdist.hist_plot
    .append("svg:line")
    .attr("class", "line")
      .attr("x1", gc.samplingdist.proportion*gc.samplingdist.width)
      .attr("y1", gc.samplingdist.height)
      .attr("x2", gc.samplingdist.proportion*gc.samplingdist.width)
      .attr("y2", 0)
      .style("stroke-width", 4)
      .style("stroke", "#d9534f")
      .style("fill", "none");

};

gc.samplingdist.update();

// Center
d3.select("#samplingdist #proportion")
  .on("input", function () {
    gc.samplingdist.proportion = +this.value;
    d3.select("#samplingdist #proportion-value").text(+this.value);
    gc.samplingdist.update();
});
// Population size
d3.select("#samplingdist #populationsize")
  .on("input", function () {
    gc.samplingdist.populationsize = +this.value;
    d3.select("#samplingdist #populationsize-value").text(+this.value);
    gc.samplingdist.update();
});
// Sample size
d3.select("#samplingdist #samplesize")
  .on("input", function () {
    gc.samplingdist.samplesize = +this.value;
    d3.select("#samplingdist #samplesize-value").text(+this.value);
    gc.samplingdist.update();
});
// Number of samples
d3.select("#samplingdist #nsample")
  .on("input", function () {
    gc.samplingdist.nsample = +this.value;
    d3.select("#samplingdist #nsample-value").text(+this.value);
    gc.samplingdist.update();
});

