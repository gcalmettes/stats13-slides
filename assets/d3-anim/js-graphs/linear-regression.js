/* global d3 */

var gc = gc || {};

gc.linreg = gc.linreg || {};

gc.linreg.init = function() {
  'use strict';

  // Set the dimensions of the canvas / graph
  var margin = {top: 10, right: 30, bottom: 50, left: 50},
      width = 550 - margin.left - margin.right,
      height = 480 - margin.top - margin.bottom;
  
  // Set the ranges
  var x = d3.scaleLinear()
      .domain([0,10])
      .range([margin.left, width+margin.left]);
  var y = d3.scaleLinear()
      .domain([0,10])
      .range([height, margin.top]);
  var r = d3.scaleLinear()
      .domain([0,500])
      .range([0,20]);
  var o = d3.scaleLinear()
      .domain([10000,100000])
      .range([.5,1]);

  // Adds the svg canvas
  gc.linreg.svg = d3.select("#linreg .placeholder")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    
  // gc.linreg.svg.append("rect")
  //   .attr("width", "100%")
  //   .attr("height", "100%")
  //   .attr("fill", "black");
    
  // gc.linreg.svg.append("g")
  //     .attr("transform",
  //               "translate(" + margin.left + "," + margin.top + ")");

  // Draw axis
  gc.linreg.svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .style("font-size","0.5em")
    .call(d3.axisBottom(x));

  gc.linreg.svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + margin.left + ",0)")
    .style("font-size","0.5em")
    .call(d3.axisLeft(y));

  // Axis labels
  gc.linreg.svg.append("text")
    .attr("class", "ylabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 0-margin.left/4)
      .attr("x", 0 -(height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","0.5em")
      .style("font-family", "Raleway")
      .style("fill","#d2d2d2")
      .text("y");
  gc.linreg.svg.append("text")
    .attr("class", "xlabel")
      .attr("y", height+25)
      .attr("x", (width / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","0.5em")
      .style("font-family", "Raleway")
      .style("fill","#d2d2d2")
      .text("x");
  
  // Axis in white
  gc.linreg.svg.selectAll(".domain")
    .style("fill", "none")
    .style("stroke", "#d2d2d2")
    .style("stroke-width", "2");      
  gc.linreg.svg.selectAll("g.tick text")
    .style("fill","#d2d2d2");
  gc.linreg.svg.selectAll("g.tick line")
    .style("fill", "none")
    .style("stroke", "#d2d2d2")
    .style("stroke-width", "2" );
      
  //draw dashed lines
  gc.linreg.svg.selectAll(".hlines")
    .data(d3.range(0,10,2))
    .enter()
      .append("line")
      .classed("hlines", 1)
      .attr("x1", margin.left)
      .attr("x2", width+margin.left)
      .attr("y1", y)
      .attr("y2", y)
      .style("stroke", "#d2d2d2")
      .style("stroke-dasharray", "4 4")
      .style("stroke-width", "1")
      .style("stroke-opacity", ".5");
  
  gc.linreg.svg.selectAll(".vlines")
    .data(d3.range(0,10,2))
    .enter()
      .append("line")
      .classed("vlines", 1)
      .attr("y1", margin.top)
      .attr("y2", height)
      .attr("x1", x)
      .attr("x2", x)
      .style("stroke", "#d2d2d2")
      .style("stroke-dasharray", "4 4")
      .style("stroke-width", "1")
      .style("stroke-opacity", ".5");

  // Datasets    
  gc.linreg.data = [];
  gc.linreg.resids = [];
  gc.linreg.residview = false;


  // gc.linreg.svg.on('mousemove', function () {
  //  console.log(d3.mouse(this)[0], d3.mouse(this)[1]);         
  // });

  //click event: draw new circle
  gc.linreg.svg.on('click', function(){
    if(d3.mouse(this)[0] > margin.left
      && d3.mouse(this)[0] < width+margin.left+margin.right
      && d3.mouse(this)[1] > 0
      && d3.mouse(this)[1] < height){
      //push new data point to data array
      gc.linreg.data.push(
        {"x": d3.mouse(this)[0],
         "y": d3.mouse(this)[1],
         "radius": 10,
         "opacity": 90000
        });
      // console.log(d3.mouse(this)[0], d3.mouse(this)[1])

      //select each circle and append the data
      var selection = gc.linreg.svg.selectAll("circle")
        .data(gc.linreg.data)

      //update selection and draw new circle
      selection.enter()
        .append("circle")
        .attr("cx",function(d) {return d.x;})
        .attr("cy",function(d) {return d.y;})
        .attr("r",function(d) {return d.radius;})
        .style("fill",function(d) {return "#5bc0de";})
        .style("opacity",function(d) {
          if(gc.linreg.residview){
            return 0;
          } else {
          return o(+d.opacity);
          }
        })

      //exit selection
      selection.exit().remove()

      if(gc.linreg.data.length == 2){
        drawline(gc.linreg.data);
      } else if(gc.linreg.data.length > 2){
        transitionline(gc.linreg.data);
      if(gc.linreg.residview){
        gc.linreg.resids = drawresiduals(gc.linreg.data);
      }
    }
  }
})


};


// normalization of histogram bars height
d3.select('#linreg #checkbox_resid')
  .on("change", function() {
    if ( gc.linreg.residview ) {
        gc.linreg.svg.selectAll('path.resline').remove();
        gc.linreg.svg.selectAll('path.halfcirc').remove();
        gc.linreg.svg.selectAll("circle")
          .style("opacity", 1)
        gc.linreg.residview = false;
    } else {
        gc.linreg.svg.selectAll("circle")
          .style("opacity", 0)
        gc.linreg.residview = true;
        gc.linreg.drawresiduals(gc.linreg.data);
    }        
});

d3.select('#resid_button').on('click', function() {
    if ( gc.linreg.residview ) {
        gc.linreg.svg.selectAll('path.resline').remove();
        gc.linreg.svg.selectAll('path.halfcirc').remove();
        gc.linreg.svg.selectAll("circle")
          .style("opacity", 1)
        gc.linreg.residview = false;
    } else {
        gc.linreg.svg.selectAll("circle")
          .style("opacity", 0)
        gc.linreg.residview = true;
        gc.linreg.drawresiduals(gc.linreg.data);
    }        
});

d3.select('#reset_button').on('click', function() {
        gc.linreg.svg.selectAll('path.resline')
          .remove();
        gc.linreg.svg.selectAll('path.halfcirc')
          .remove();
        gc.linreg.svg.selectAll('circle')
          .remove();
        gc.linreg.svg.selectAll('path')
          .remove();
        gc.linreg.residview = false;
        gc.linreg.data = []
        gc.linreg.resids = []
});  

