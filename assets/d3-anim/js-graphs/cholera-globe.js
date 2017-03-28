/* global d3 */

var gc = gc || {};

gc.globe = gc.globe || {};

gc.globe.WIDTH = 600;
gc.globe.HEIGHT = 560;

gc.globe.init = function() {
  'use strict';
  //Import the svg
  d3.xml("assets/img/lec/cholera-globe.svg").mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var importedNode = document.importNode(xml.documentElement, true);
  //add it to the D3 scene
  d3.select('#cholera_globe').node().appendChild(importedNode)
  gc.globe.svg = d3.selectAll("#cholera_globe svg")
  gc.globe.svg
    .attr('width', gc.globe.WIDTH)
    .attr('height', gc.globe.HEIGHT)
    .attr('viewBox', "0 0 536.58 536.395");

  gc.globe.svg.selectAll("#india, #indiatext, #russia, #russiatext, #london")
    .attr('opacity', 0);
  });
};

gc.globe.zoomout = function(){
  gc.globe.svg = d3.selectAll("#cholera_globe svg")
  gc.globe.svg
    .transition()
    .duration(1000)
    .attr('viewBox', "0 0 536.58 536.395");

  gc.globe.svg.selectAll("#india, #indiatext, #russia, #russiatext, #london")
    .attr('opacity', 0);

  gc.globe.svg.selectAll("#meridien")
    .attr('opacity', 1);
};

gc.globe.india = function(){
  gc.globe.svg.selectAll("#india")
    .transition()
    .duration(300)
    .attr('opacity', 0.5);
  gc.globe.svg.selectAll("#indiatext")
    .transition()
    .duration(300)
    .attr('opacity', 1);

  gc.globe.svg.selectAll("#russia, #russiatext")
    .transition()
    .duration(100)
    .attr('opacity', 0);
};

gc.globe.russia = function(){
  gc.globe.svg
    .transition()
    .duration(1000)
    .attr('viewBox', "0 0 536.58 536.395");

  gc.globe.svg.selectAll("#india, #indiatext")
    .transition()
    .duration(100)
    .attr('opacity', 0);

  gc.globe.svg.selectAll("#london")
    .transition()
    .duration(1000)
    .attr('opacity', 0);

  gc.globe.svg.selectAll("#russia")
    .transition()
    .duration(300)
    .attr('opacity', 0.5);
  gc.globe.svg.selectAll("#russiatext")
    .transition()
    .duration(300)
    .attr('opacity', 1);
};

gc.globe.zoomin = function(){
  gc.globe.svg.selectAll("#russia")
    .transition()
    .duration(500)
    .attr('opacity', 0);

  gc.globe.svg.selectAll("#india, #indiatext")
    .transition()
    .duration(100)
    .attr('opacity', 0);

  gc.globe.svg.selectAll("#meridien")
    .transition()
    .duration(1500)
    .attr('opacity', 0.);

  gc.globe.svg.selectAll("#london")
    .transition()
    .duration(1500)
    .attr('opacity', 1);

  gc.globe.svg
    .transition()
    .duration(2000)
    .attr('viewBox', "210 274 4 4");
};