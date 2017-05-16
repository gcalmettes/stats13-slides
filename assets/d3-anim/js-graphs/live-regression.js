/* global d3 */

var gc = gc || {};

gc.linreglive = gc.linreglive || {};

gc.linreglive.init = function() {
  'use strict';

  // Set the dimensions of the canvas / graph
  gc.linreglive.margin = {top: 10, right: 30, bottom: 50, left: 70},
  gc.linreglive.width = 680 - gc.linreglive.margin.left - gc.linreglive.margin.right,
  gc.linreglive.height = 480 - gc.linreglive.margin.top - gc.linreglive.margin.bottom;

  // Set the ranges
  gc.linreglive.x = d3.scaleLinear()
      .domain([4,15])
      .range([gc.linreglive.margin.left, gc.linreglive.width+gc.linreglive.margin.left]);
  gc.linreglive.y = d3.scaleLinear()
      .domain([54,83])
      .range([gc.linreglive.height, gc.linreglive.margin.top]);

  // Adds the svg canvas
  gc.linreglive.svg = d3.select("#linreglive .placeholder")
    .append("svg")
      .attr("width", gc.linreglive.width + gc.linreglive.margin.left + gc.linreglive.margin.right)
      .attr("height", gc.linreglive.height + gc.linreglive.margin.top + gc.linreglive.margin.bottom)


  // add the tooltip area to the webpage
  var tooltip = d3.select("#linreglive .placeholder").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  function update(){

    var t = d3.transition()
      .duration(1000);

    var publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/1W0ScHXmtnEDavmwJFuMfcHY6xILL03jDsPTxJA7x9h8/pubhtml";

    var tabletop = Tabletop.init( { key: publicSpreadsheetUrl,
                       callback: doGraph,
                       simpleSheet: true } )

  // Get the data
  function doGraph(data_or, tabletop) {
     var data = data_or
        .map(function(d){
          return {"Name": d.Name, "Height": +d.Height, "ShoeSize": +d.ShoeSize, "radius": 10};
        })
        .filter(function(d){
          return d["ShoeSize"] > 0 && d["Height"]>0;
        });

    //select each circle and append the data
      var selection = gc.linreglive.svg.selectAll("circle")
        .data(data)

      //exit selection
      selection.exit()
        .remove()

      //update selection and draw new circle
      selection.enter()
        .append("circle")
        .attr("cx",function(d) {return gc.linreglive.x(d.ShoeSize);})
        .attr("cy",function(d) {return gc.linreglive.y(d.Height);})
        .attr("r",function(d) {return d.radius;})
        .style("fill",function(d) {return "#5bc0de";})
        // .style("opacity", 1);

      

      if(data.length == 2){
        gc.linreglive.drawline(data);
      } else if(data.length > 2){
        gc.linreglive.transitionline(data);
      } else if (data.length < 2){
        d3.select('#linreglive #regline')
          .remove();
        d3.select("#m-coef").text(0);
        d3.select("#b-coef").text(0);
        gc.linreglive.lsCoefm = 0
        gc.linreglive.lsCoefb = 0
        d3.select("#linreglive #pred-height").text(0);
      }

    };
    } 

  // Draw axes
  gc.linreglive.svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + gc.linreglive.height + ")")
    .style("font-size","0.5em")
    .call(d3.axisBottom(gc.linreglive.x));

  gc.linreglive.svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + gc.linreglive.margin.left + ",0)")
    .style("font-size","0.5em")
    .call(d3.axisLeft(gc.linreglive.y));

  // Axis labels
  gc.linreglive.svg.append("text")
    .attr("class", "ylabel")
      .attr("transform", "rotate(-90)")
      .attr("y", -2)
      .attr("x", 0 -(gc.linreglive.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","0.5em")
      .style("font-family", "Raleway")
      .style("fill","#d2d2d2")
      .text("Height (in)");
  gc.linreglive.svg.append("text")
    .attr("class", "xlabel")
      .attr("y", gc.linreglive.height+25)
      .attr("x", gc.linreglive.x(10))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","0.5em")
      .style("font-family", "Raleway")
      .style("fill","#d2d2d2")
      .text("Shoe Size");
  
  // Axis in white
  gc.linreglive.svg.selectAll(".domain")
    .style("fill", "none")
    .style("stroke", "#d2d2d2")
    .style("stroke-width", "2");      
  gc.linreglive.svg.selectAll("g.tick text")
    .style("fill","#d2d2d2");
  gc.linreglive.svg.selectAll("g.tick line")
    .style("fill", "none")
    .style("stroke", "#d2d2d2")
    .style("stroke-width", "2" );
      
  //draw dashed lines
  gc.linreglive.svg.selectAll(".hlines")
    .data(d3.range(gc.linreglive.y.domain()[0],gc.linreglive.y.domain()[1],2))
    .enter()
      .append("line")
      .classed("hlines", 1)
      .attr("x1", gc.linreglive.margin.left)
      .attr("x2", gc.linreglive.width+gc.linreglive.margin.left)
      .attr("y1", gc.linreglive.y)
      .attr("y2", gc.linreglive.y)
      .style("stroke", "#d2d2d2")
      .style("stroke-dasharray", "4 4")
      .style("stroke-width", "1")
      .style("stroke-opacity", ".5");
  
  gc.linreglive.svg.selectAll(".vlines")
    .data(d3.range(gc.linreglive.x.domain()[0],gc.linreglive.x.domain()[1],2))
    .enter()
      .append("line")
      .classed("vlines", 1)
      .attr("y1", gc.linreglive.margin.top)
      .attr("y2", gc.linreglive.height)
      .attr("x1", gc.linreglive.x)
      .attr("x2", gc.linreglive.x)
      .style("stroke", "#d2d2d2")
      .style("stroke-dasharray", "4 4")
      .style("stroke-width", "1")
      .style("stroke-opacity", ".5");

  update();

  // // check every x msec
  d3.interval(function() {
    update();
  }, 10000);

};

gc.linreglive.drawline = function(data){
  // Initial regression line
  var xValues = data.map(function(d){return gc.linreglive.x(d.ShoeSize);});
  var yValues = data.map(function(d){return gc.linreglive.y(d.Height);});
  var lsCoef = [gc.linreglive.LeastSquares(xValues, yValues)];

  gc.linreglive.lsCoefm = gc.linreglive.x.invert(lsCoef[0].m)
  gc.linreglive.lsCoefb = gc.linreglive.y.invert(lsCoef[0].b)

  // console.log(lsCoef[0])
  // console.log(xValues.map(function(d){return gc.linreglive.x.invert(d)}))
  // console.log(yValues.map(function(d){return gc.linreglive.y.invert(d)}))


  var m = parseFloat(Math.round(gc.linreglive.x.invert(lsCoef[0].m) * 1000) / 1000).toFixed(3);
  var b = parseFloat(Math.round(gc.linreglive.y.invert(lsCoef[0].b) * 1000) / 1000).toFixed(3);
  d3.select("#m-coef").text(m);
  d3.select("#b-coef").text(b);
  
  var lineFunction = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

  var is_line = d3.select('#linreglive #regline')._groups[0][0]

  if(is_line == null){
    gc.linreglive.svg
      .append('path')
      .attr("d", lineFunction([
        {"x": gc.linreglive.x.range()[0], 
         "y": lsCoef[0].m * gc.linreglive.x.range()[0] + lsCoef[0].b},
        {"x": gc.linreglive.x.range()[1], 
         "y": lsCoef[0].m * gc.linreglive.x.range()[1] + lsCoef[0].b}]))
      .attr("stroke-width", 2)
      .attr("stroke", "#d2d2d2")
      .attr('id', 'regline');   
  } else {
    d3.select('#linreglive #regline')
    .transition()
    .attr('d', lineFunction([
      {"x": gc.linreglive.x.range()[0], 
       "y": lsCoef[0].m * gc.linreglive.x.range()[0] + lsCoef[0].b},
      {"x": gc.linreglive.x.range()[1], 
       "y": lsCoef[0].m * gc.linreglive.x.range()[1] + lsCoef[0].b}]))
  }

};

gc.linreglive.transitionline = function(data){
  // Update regression line
  var xValues = data.map(function(d){return gc.linreglive.x(d.ShoeSize);});
  var yValues = data.map(function(d){return gc.linreglive.y(d.Height);});
  var lsCoef = [gc.linreglive.LeastSquares(xValues, yValues)];

  gc.linreglive.lsCoefm = gc.linreglive.x.invert(lsCoef[0].m)
  gc.linreglive.lsCoefb = gc.linreglive.y.invert(lsCoef[0].b)

  // console.log(lsCoef[0])
  // console.log(xValues.map(function(d){return gc.linreglive.x.invert(d)}))
  // console.log(yValues.map(function(d){return gc.linreglive.y.invert(d)}))

  var m = parseFloat(Math.round(gc.linreglive.x.invert(lsCoef[0].m) * 1000) / 1000).toFixed(3);
  var b = parseFloat(Math.round(gc.linreglive.y.invert(lsCoef[0].b) * 1000) / 1000).toFixed(3);
  d3.select("#m-coef").text(m);
  d3.select("#b-coef").text(b);
  
  var lineFunction = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; });
  
  var is_line = d3.select('#linreglive #regline')._groups[0][0]

  if(is_line == null){
    gc.linreglive.svg
      .append('path')
      .attr("d", lineFunction([
        {"x": gc.linreglive.x.range()[0], 
         "y": lsCoef[0].m * gc.linreglive.x.range()[0] + lsCoef[0].b},
        {"x": gc.linreglive.x.range()[1], 
         "y": lsCoef[0].m * gc.linreglive.x.range()[1] + lsCoef[0].b}]))
      .attr("stroke-width", 2)
      .attr("stroke", "#d2d2d2")
      .attr('id', 'regline');   
  } else {
    d3.select('#linreglive #regline')
    .transition()
    .attr('d', lineFunction([
      {"x": gc.linreglive.x.range()[0], 
       "y": lsCoef[0].m * gc.linreglive.x.range()[0] + lsCoef[0].b},
      {"x": gc.linreglive.x.range()[1], 
       "y": lsCoef[0].m * gc.linreglive.x.range()[1] + lsCoef[0].b}]))
  }

};

gc.linreglive.LeastSquares = function(values_x, values_y) {
  //Linear regression in javascript
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var count = 0;

  // We'll use those variables for faster read/write access.
  var x = 0;
  var y = 0;
  var values_length = values_x.length;

  if (values_length != values_y.length) {
      throw new Error('The parameters values_x and values_y need to have same size!');
  }
  // Nothing to do.
  if (values_length === 0) {
      return [ [], [] ];
  }
  // Calculate the sum for each of the parts necessary.
  for (var v = 0; v < values_length; v++) {
      x = values_x[v];
      y = values_y[v];
      sum_x += x;
      sum_y += y;
      sum_xx += x*x;
      sum_xy += x*y;
      count++;
  }
  // Calculate m and b for the formular:
  // y = x * m + b
  var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
  var b = (sum_y/count) - (m*sum_x)/count;
  // return the slope and intercept
  return {'b': b, 'm': m};
};

d3.select("#linreglive #shoeSubmit")
  .on("click", function () {
    if (d3.select("#linreglive #usr-shoe").property("value")==""){
      predictedSize = 0;
    } else {
      predictedSize = parseFloat(Math.round((gc.linreglive.lsCoefm * d3.select("#linreglive #usr-shoe").property("value") + gc.linreglive.lsCoefb) * 1000) / 1000).toFixed(3);
    }
    d3.select("#linreglive #pred-height").text(predictedSize);
    // console.log(predictedSize)
});

