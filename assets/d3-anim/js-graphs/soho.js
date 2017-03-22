/* global d3 */

var gc = gc || {};

gc.soho = gc.soho || {};

gc.soho.WIDTH = 600;
gc.soho.HEIGHT = 560;

gc.soho.init = function() {
  'use strict';
  //Import the svg
  d3.xml("assets/img/lec1/london_soho-slide.svg").mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var importedNode = document.importNode(xml.documentElement, true);
  //add it to the D3 scene
  d3.select('#soho_map').node().appendChild(importedNode)
  gc.soho.svg = d3.selectAll("#soho_map svg")
  gc.soho.svg
    .attr('width', gc.soho.WIDTH)
    .attr('height', gc.soho.HEIGHT)

  // gc.soho.svg.select("#pump")
  //   .attr("opacity", 0)
  });
};

gc.soho.zoomout = function(){
  gc.soho.svg = d3.selectAll("#soho_map svg")
  gc.soho.svg
    .transition()
    .duration(500)
    .attr('viewBox', "45 55 1900 1700");

  gc.soho.svg.selectAll("#workhouse, #brewery")
    .style("fill", "#BFBFBF");
};

gc.soho.zoomin = function(){
  gc.soho.svg
    .transition()
    .duration(500)
    .attr('viewBox', "660 520 740 800");

  gc.soho.svg.selectAll("#workhouse, #brewery")
    .style("fill", "#BFBFBF");
};

gc.soho.highligth_bg = function(){
  gc.soho.svg.selectAll("#workhouse, #brewery")
    .style("fill", "#FCECBEFF");
};
