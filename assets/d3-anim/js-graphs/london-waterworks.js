/* global d3 */

var gc = gc || {};
gc.waterworks = gc.waterworks || {};

gc.waterworks.WIDTH = 600;
gc.waterworks.HEIGHT = 560;

gc.waterworks.init = function() {
  'use strict';
  //Import the svg
  d3.xml("assets/img/lec/london-waterworks.svg").mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var importedNode = document.importNode(xml.documentElement, true);
  //add it to the D3 scene
  d3.select('#waterworks').node().appendChild(importedNode)
  gc.waterworks.svg = d3.selectAll("#waterworks svg")
  gc.waterworks.svg
    .attr('width', gc.waterworks.WIDTH)
    .attr('height', gc.waterworks.HEIGHT)
    .attr('viewBox', "0 0 1425 1140");

  gc.waterworks.svg.selectAll("#legend, #lambeth1852, #lambeth, #sv, #wards")
    .attr('opacity', 0);
  });
};

gc.waterworks.lambeth_move = function() {
  'use strict';
  gc.waterworks.svg = d3.selectAll("#waterworks svg");

  gc.waterworks.svg
    .transition()
    .duration(1000)
    .attr('viewBox', "0 0 1425 1140");

  gc.waterworks.svg.selectAll("#lambeth1852, #central, #sv1852, #lambeth1839")
    .transition()
    .duration(200)
    .attr('opacity', 1);

  gc.waterworks.svg.selectAll("#legend, #lambeth, #sv, #wards")
    .transition()
    .duration(400)
    .attr('opacity', 0);
};

gc.waterworks.zoomin = function() {
  'use strict';
  gc.waterworks.svg = d3.selectAll("#waterworks svg");

  gc.waterworks.svg
    .transition()
    .duration(1000)
    .attr('viewBox', "450 500 400 300");

  gc.waterworks.svg.selectAll("#legend, #lambeth, #sv, #wards")
    .transition()
    .duration(800)
    .attr('opacity', 1);

  gc.waterworks.svg.selectAll("#lambeth1852, #central, #sv1852, #lambeth1839")
    .transition()
    .duration(400)
    .attr('opacity', 0);
};

gc.waterworks.zoomout = function() {
  'use strict';
  gc.waterworks.svg = d3.selectAll("#waterworks svg");
  gc.waterworks.svg
    .transition()
    .duration(500)
    .attr('viewBox', "0 0 1425 1140");

  gc.waterworks.svg.selectAll("#legend, #lambeth1852, #lambeth, #sv, #wards")
    .transition()
    .duration(100)
    .attr('opacity', 0);

  gc.waterworks.svg.selectAll("#central, #sv1852, #lambeth1839")
    .transition()
    .duration(300)
    .attr('opacity', 1);
};
