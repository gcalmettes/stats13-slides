/* global d3 */

var gc = gc || {};

gc.shuffling = gc.shuffling || {};

gc.shuffling.WIDTH = 380;
gc.shuffling.HEIGHT = 360;
gc.shuffling.svg = null;

gc.shuffling.sizeTopGroup = 26;
gc.shuffling.sizeBottomGroup = 30;
gc.shuffling.sizeSpace = 24;
gc.shuffling.totalSize = gc.shuffling.sizeTopGroup+gc.shuffling.sizeSpace+gc.shuffling.sizeBottomGroup;
gc.shuffling.rectSize = 30;



gc.shuffling.create_coords = function(d1, d2) {
  var arr = []
  for ( var i = 0; i < gc.shuffling.totalSize; i++ ) {
        if ( i < gc.shuffling.sizeTopGroup ) {
            arr.push({x: i%10, y: 1+Math.floor(i/10)})
      } if ( i > gc.shuffling.sizeTopGroup && i < (gc.shuffling.sizeTopGroup+gc.shuffling.sizeSpace)) {
      } else if ( i >= (gc.shuffling.sizeTopGroup+gc.shuffling.sizeSpace)){
        arr.push({x: i%10, y: 1+Math.floor(i/10)})
      }
    }
    return arr
};

gc.shuffling.dataset = gc.shuffling.create_coords(gc.shuffling.sizeTopGroup, gc.shuffling.sizeBottomGroup);



gc.shuffling.init = function() {
  'use strict';

  gc.shuffling.xScale = d3.scaleLinear()
    .domain([0,10])
    .range([gc.shuffling.rectSize/2, gc.shuffling.WIDTH]);
  gc.shuffling.yScale = d3.scaleLinear()
    .domain([0,10])
    .range([gc.shuffling.rectSize/2, gc.shuffling.HEIGHT]);

  gc.shuffling.svg = d3.select('#shuffling .placeholder')
    .append('svg')
    .attr('width', gc.shuffling.WIDTH)
    .attr('height', gc.shuffling.HEIGHT);

  gc.shuffling.rect = gc.shuffling.svg.selectAll("rect")
      .data(gc.shuffling.dataset)
      .enter()
      .append("rect");
      console.log(gc.shuffling.coord);

  gc.shuffling.rect
        .attr("x", function(d) {return gc.shuffling.xScale(d.x)})
        .attr("y", function(d) {return gc.shuffling.yScale(d.y)})
        .attr("width", gc.shuffling.rectSize)
        .attr("height", gc.shuffling.rectSize)
        .style("fill", function(d,i) {return i < gc.shuffling.sizeTopGroup ? "#5bc0de" : "#f0ad4e"});

  gc.shuffling.svg
      .append("text")
        .attr("class", "textline")
        .attr("x", 0) //a bit shifted to the right
        .attr("y", 30)
        .style("fill", "lightgray")
        .style("font-size","0.7em")
        .text("Carbon frame (n=26)");
  gc.shuffling.svg
      .append("text")
        .attr("class", "textline")
        .attr("x", 0) //a bit shifted to the right
        .attr("y", 205)
        .style("fill", "lightgray")
        .style("font-size","0.7em")
        .text("Steel frame (n=30)");
};


gc.shuffling.shuffle = function(){

  var indices = d3.shuffle(d3.range(gc.shuffling.sizeBottomGroup+gc.shuffling.sizeTopGroup))
  var indices_grp1 = indices.slice(0, gc.shuffling.sizeTopGroup)

  gc.shuffling.rect
    .style("fill", function(d,i) {return indices_grp1.includes(i) ? "#5bc0de" : "#f0ad4e"});
};

gc.shuffling.reset_color = function(){

  gc.shuffling.rect
    .style("fill", function(d,i) {return i < gc.shuffling.sizeTopGroup? "#5bc0de" : "#f0ad4e"});

};



gc.shuffling.init2 = function() {
  'use strict';

  gc.shuffling.xScale = d3.scaleLinear()
    .domain([0,10])
    .range([gc.shuffling.rectSize/2, gc.shuffling.WIDTH]);
  gc.shuffling.yScale = d3.scaleLinear()
    .domain([0,10])
    .range([gc.shuffling.rectSize/2, gc.shuffling.HEIGHT]);

  gc.shuffling.svg2 = d3.select('#shuffling2 .placeholder')
    .append('svg')
    .attr('width', gc.shuffling.WIDTH)
    .attr('height', gc.shuffling.HEIGHT);

  gc.shuffling.rect2 = gc.shuffling.svg2.selectAll("rect")
      .data(gc.shuffling.dataset)
      .enter()
      .append("rect");
      console.log(gc.shuffling.coord);

  gc.shuffling.rect2
        .attr("x", function(d) {return gc.shuffling.xScale(d.x)})
        .attr("y", function(d) {return gc.shuffling.yScale(d.y)})
        .attr("width", gc.shuffling.rectSize)
        .attr("height", gc.shuffling.rectSize)
        .style("fill", function(d,i) {return i < gc.shuffling.sizeTopGroup ? "#5bc0de" : "#f0ad4e"});

  gc.shuffling.svg2
      .append("text")
        .attr("class", "textline")
        .attr("x", 0) //a bit shifted to the right
        .attr("y", 30)
        .style("fill", "lightgray")
        .style("font-size","0.7em")
        .text("Carbon frame (n=26)");
  gc.shuffling.svg2
      .append("text")
        .attr("class", "textline")
        .attr("x", 0) //a bit shifted to the right
        .attr("y", 205)
        .style("fill", "lightgray")
        .style("font-size","0.7em")
        .text("Steel frame (n=30)");
};


gc.shuffling.shuffle2 = function(){

  var indices = d3.shuffle(d3.range(gc.shuffling.sizeBottomGroup+gc.shuffling.sizeTopGroup))
  var indices_grp1 = indices.slice(0, gc.shuffling.sizeTopGroup)

  gc.shuffling.rect2
    .style("fill", function(d,i) {return indices_grp1.includes(i) ? "#5bc0de" : "#f0ad4e"});
};

gc.shuffling.reset_color2 = function(){

  gc.shuffling.rect2
    .style("fill", function(d,i) {return i < gc.shuffling.sizeTopGroup? "#5bc0de" : "#f0ad4e"});

};



