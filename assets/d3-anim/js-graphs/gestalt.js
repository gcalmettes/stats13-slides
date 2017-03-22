/* global d3 */

var gc = gc || {};

gc.gestalt = gc.gestalt || {};

gc.gestalt.WIDTH = 490;
gc.gestalt.HEIGHT = 420;
gc.gestalt.svg = null;

gc.gestalt.init = function() {
  'use strict';

  gc.gestalt.xScale = d3.scaleLinear().domain([0,10]).range([40,560]);
  gc.gestalt.yScale = d3.scaleLinear().domain([0,10]).range([40,860]);

  gc.gestalt.svg = d3.select('#gestalt .placeholder')
    .append('svg')
    .attr('width', gc.gestalt.WIDTH)
    .attr('height', gc.gestalt.HEIGHT)
    // .style('background', 'white');

  gc.gestalt.svg.selectAll("circle")
      .data(d3.range(40).map(function(d,i) {return {x: i%8, y: Math.floor(i/8)}}))
      .enter()
      .append("circle")
        .attr("cx", function(d) {return gc.gestalt.xScale(d.x)})
        .attr("cy", function(d) {return gc.gestalt.yScale(d.y)})
        .attr("r", 15)
        .style("fill", "lightgray")
        .style("stroke", "black")
        .style("stroke-width", "1px");

    gc.gestalt.svg.selectAll("rect")
      .data([0,1])
      .enter()
      .append("rect")
        .attr("class", "enclosure")
        .attr("height", 370)
        .attr("width", function(d,i) {return i == 0 ? 190 : 250})
        .attr("x", function(d,i) {return i == 0 ? 20 : 220})
        .attr("y", 20)
        .attr("ry", 10)
        .style("fill", "none")
        .style("stroke", "steelblue")
        .style("stroke-width", "3px")
        .style("stroke-opacity", 0);
};

gc.gestalt.base = function(){
  gc.gestalt.svg.selectAll("circle")
    .transition()
      .duration(100)
      .attr("cx", function(d) {return gc.gestalt.xScale(d.x)})
      .attr("cy", function(d) {return gc.gestalt.yScale(d.y)})
      .style("fill", "lightgray")
};

gc.gestalt.similarity = function() {
  gc.gestalt.svg.selectAll("circle")
    .transition()
      .duration(100)
      .attr("cx", function(d) {return gc.gestalt.xScale(d.x)})
      .attr("cy", function(d) {return gc.gestalt.yScale(d.y)})
      .style("fill", function(d) {return d.x%2 == 1 ? "#E64949" : "lightgray"})
}

gc.gestalt.proximity = function() {
  gc.gestalt.svg.selectAll("circle")
    .transition()
      .duration(100)
      .attr("cx", function(d) {return d.x < 2 ? gc.gestalt.xScale(d.x) : gc.gestalt.xScale(d.x) + 45})
      .attr("cy", function(d) {return gc.gestalt.yScale(d.y)})
      .style("fill", function(d) {return d.x%2 == 1 ? "#E64949" : "lightgray"})

  gc.gestalt.svg.selectAll("rect.enclosure")
    .transition()
      .duration(100)
      .style("stroke-opacity", 0);

}

gc.gestalt.enclosure = function() {
  gc.gestalt.svg.selectAll("circle")
    .transition()
    .duration(500)
    .attr("cx", function(d) {return d.x < 2 ? gc.gestalt.xScale(d.x) : gc.gestalt.xScale(d.x) + 45})
    .attr("cy", function(d) {return gc.gestalt.yScale(d.y)})
    .style("fill", function(d) {return d.x%2 == 1 ? "#E64949" : "lightgray"});

  gc.gestalt.svg.selectAll("rect.enclosure")
    .transition()
    .duration(500)
    .style("stroke-opacity", 1);

}
