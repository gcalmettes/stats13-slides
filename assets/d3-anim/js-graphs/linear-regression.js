/* global d3 */

var gc = gc || {};

gc.linreg = gc.linreg || {};

gc.linreg.init = function() {
  'use strict';

  // Set the dimensions of the canvas / graph
  gc.linreg.margin = {top: 10, right: 30, bottom: 50, left: 50},
  gc.linreg.width = 550 - gc.linreg.margin.left - gc.linreg.margin.right,
  gc.linreg.height = 480 - gc.linreg.margin.top - gc.linreg.margin.bottom;
  
  // Set the ranges
  gc.linreg.x = d3.scaleLinear()
      .domain([0,10])
      .range([gc.linreg.margin.left, gc.linreg.width+gc.linreg.margin.left]);
  gc.linreg.y = d3.scaleLinear()
      .domain([0,10])
      .range([gc.linreg.height, gc.linreg.margin.top]);

  // Adds the svg canvas
  gc.linreg.svg = d3.select("#linreg .placeholder")
    .append("svg")
      .attr("width", gc.linreg.width + gc.linreg.margin.left + gc.linreg.margin.right)
      .attr("height", gc.linreg.height + gc.linreg.margin.top + gc.linreg.margin.bottom)
      .attr("id", "#linregsvg")

  // Draw axis
  gc.linreg.svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + gc.linreg.height + ")")
    .style("font-size","0.5em")
    .call(d3.axisBottom(gc.linreg.x));

  gc.linreg.svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + gc.linreg.margin.left + ",0)")
    .style("font-size","0.5em")
    .call(d3.axisLeft(gc.linreg.y));

  // Axis labels
  gc.linreg.svg.append("text")
    .attr("class", "ylabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 0-gc.linreg.margin.left/4)
      .attr("x", 0 -(gc.linreg.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","0.5em")
      .style("font-family", "Raleway")
      .style("fill","#d2d2d2")
      .text("y");
  gc.linreg.svg.append("text")
    .attr("class", "xlabel")
      .attr("y", gc.linreg.height+25)
      .attr("x", (gc.linreg.width / 2))
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
    .data(d3.range(gc.linreg.y.domain()[0],gc.linreg.y.domain()[1],2))
    .enter()
      .append("line")
      .classed("hlines", 1)
      .attr("x1", gc.linreg.margin.left)
      .attr("x2", gc.linreg.width+gc.linreg.margin.left)
      .attr("y1", gc.linreg.y)
      .attr("y2", gc.linreg.y)
      .style("stroke", "#d2d2d2")
      .style("stroke-dasharray", "4 4")
      .style("stroke-width", "1")
      .style("stroke-opacity", ".5");
  
  gc.linreg.svg.selectAll(".vlines")
    .data(d3.range(gc.linreg.x.domain()[0],gc.linreg.x.domain()[1],2))
    .enter()
      .append("line")
      .classed("vlines", 1)
      .attr("y1", gc.linreg.margin.top)
      .attr("y2", gc.linreg.height)
      .attr("x1", gc.linreg.x)
      .attr("x2", gc.linreg.x)
      .style("stroke", "#d2d2d2")
      .style("stroke-dasharray", "4 4")
      .style("stroke-width", "1")
      .style("stroke-opacity", ".5");

  // Datasets    
  gc.linreg.data = [];
  gc.linreg.resids = [];
  gc.linreg.residview = false;
  gc.linreg.radius = 10

  //click event: draw new circle
  gc.linreg.svg.on('click', function(){
    if(d3.mouse(this)[0] > gc.linreg.x.range()[0]
      && d3.mouse(this)[0] < gc.linreg.x.range()[1]
      && d3.mouse(this)[1] > gc.linreg.y.range()[1]
      && d3.mouse(this)[1] < gc.linreg.y.range()[0]){
      //push new data point to data array
      gc.linreg.data.push(
        {"x": d3.event.offsetX, //d3.mouse(this)[0],
         "y": d3.event.offsetY, //d3.mouse(this)[1],
         "radius": gc.linreg.radius
        });

      //console.log(gc.linreg.x.invert(d3.event.offsetX), gc.linreg.y.invert(d3.event.offsetY))

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
          return 1;
          }
        })

      //exit selection
      selection.exit()
        .remove()

      if(gc.linreg.data.length == 2){
        gc.linreg.drawline(gc.linreg.data);
      } else if(gc.linreg.data.length > 2){
        gc.linreg.transitionline(gc.linreg.data);
      if(gc.linreg.residview){
        gc.linreg.resids = gc.linreg.drawresiduals(gc.linreg.data);
      }
      }
    }
  })


// var element = document.getElementById('#linregsvg');
// //console.log(log)

// function a0(element, pageX, pageY) {
//   return window.webkitConvertPointFromPageToNode != undefined ? window.webkitConvertPointFromPageToNode(element, new WebKitPoint(pageX, pageY)) : {x: undefined, y: undefined};
// }

// function a1(element, pageX, pageY) {
//   return {x: pageX, y: pageY};
// }

// function a2(element, pageX, pageY) {
//   return window.convertPointFromPageToNode != undefined ? window.convertPointFromPageToNode(element, pageX, pageY) : {x: undefined, y: undefined};
// }

// function b0(element, offsetX, offsetY) {
//   return window.webkitConvertPointFromNodeToPage != undefined ? window.webkitConvertPointFromNodeToPage(element, new WebKitPoint(offsetX, offsetY)) : {x: undefined, y: undefined};
// }

// function b1(element, offsetX, offsetY) {
//   return {x: offsetX, y: offsetY};
// }

// function b2(element, offsetX, offsetY) {
//   return window.convertPointFromNodeToPage != undefined ? window.convertPointFromNodeToPage(element, offsetX, offsetY) : {x: undefined, y: undefined};
// }

// function onMouseMove(event) {
//   console.log(b1(element, gc.linreg.x.invert(event.offsetX), gc.linreg.y.invert(event.offsetY)))
//   //console.log(a0(element, gc.linreg.x.invert(event.pageX),   gc.linreg.y.invert(event.pageY)))
//   //console.log(a2(element, gc.linreg.x.invert(event.pageX),   gc.linreg.y.invert(event.pageY)))
//   //console.log(a1(element, gc.linreg.x.invert(event.pageX),   gc.linreg.y.invert(event.pageY)))
//   //console.log(b0(element, gc.linreg.x.invert(event.offsetX), gc.linreg.y.invert(event.offsetY)))
//   //console.log(b2(element, gc.linreg.x.invert(event.offsetX), gc.linreg.y.invert(event.offsetY)))

// }

// document.addEventListener("mousemove", onMouseMove, false);




};

gc.linreg.drawline = function(data){
  // Initial regression line
  var xValues = data.map(function(d){return d.x;});
  var yValues = data.map(function(d){return d.y;});
  var lsCoef = [gc.linreg.LeastSquares(xValues, yValues)];

  var lineFunction = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

  gc.linreg.svg
    .append('path')
    .attr("d", lineFunction([
      {"x": gc.linreg.margin.left, 
       "y": lsCoef[0].m * gc.linreg.margin.left + lsCoef[0].b},
      {"x": gc.linreg.width+gc.linreg.margin.left, 
       "y": lsCoef[0].m * (gc.linreg.width+gc.linreg.margin.left) + lsCoef[0].b}]))
    .attr("stroke-width", 2)
    .attr("stroke", "#d2d2d2")
    .attr('id', 'regline');
}

gc.linreg.transitionline = function(data){
  // Update regression line
  var xValues = data.map(function(d){return d.x;});
  var yValues = data.map(function(d){return d.y;});
  var lsCoef = [gc.linreg.LeastSquares(xValues, yValues)];

  var lineFunction = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; });
  
  d3.select('#regline')
    .transition()
    .attr('d', lineFunction([
      {"x": gc.linreg.margin.left, 
       "y": lsCoef[0].m * gc.linreg.margin.left + lsCoef[0].b},
      {"x": gc.linreg.width+gc.linreg.margin.left, 
       "y": lsCoef[0].m * (gc.linreg.width+gc.linreg.margin.left) + lsCoef[0].b}]));
}

gc.linreg.LeastSquares = function(values_x, values_y) {
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
}

gc.linreg.drawresiduals = function(data){
//get least squares coeffs, draw red paths
  var xValues = data.map(function(d){return d.x;});
  var yValues = data.map(function(d){return d.y;});
  var lsCoef = [gc.linreg.LeastSquares(xValues, yValues)];

  var lineFunction = d3.line()
    .y(function(d) { return d.y;
    })
    .x(function(d) { return d.x; });

  gc.linreg.resids = data.map(function(d){
    return {"x0": d.x, 
            "y0": d.y, 
            "x1": d.x , 
            "y1": lsCoef[0].m * d.x + lsCoef[0].b}
  })

  var halfcircles = function(d){
    // Draw half circles for residuals view
    var radius = gc.linreg.radius,
        padding = 10,
        radians = Math.PI;

    var dimension = (2 * radius) + (2 * padding),
        points = 50;

    var angle = d3.scaleLinear()
        .domain([0, points-1])
        .range([ 0, radians]);

    var fullangle = d3.scaleLinear()
        .domain([0, points-1])
        .range([ 0, 2*radians]);

    var line = d3.radialLine()
        .curve(d3.curveBasis)
        .radius(radius)
        .angle(function(e, i) { 
          if(d.y0-d.y1 < -gc.linreg.radius) {
            return angle(i) + Math.PI/2; 
          } else if (d.y0 - d.y1 > gc.linreg.radius){
            return angle(i) + Math.PI*(3/2);
          } else {
            return fullangle(i);
          }
        })

    gc.linreg.svg.append("path")
      .datum(d3.range(points))
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", 'none')
        .attr("transform", "translate(" + (d.x0) + ", " + (d.y0) + ")")
        .style("stroke-dasharray", ("2, 2"))
        .style("stroke", function(e){
          if( d.y0-d.y1 > -gc.linreg.radius && d.y0 - d.y1 < gc.linreg.radius){
            return "#5cb85c";
          } else {
            return "#d9534f";
          }
        })
        .style("stroke-width", 4)
        .attr("class", "halfcirc");
    }

  gc.linreg.svg.selectAll('path.resline').remove();
  gc.linreg.svg.selectAll('path.halfcirc').remove();
  var selection = gc.linreg.svg.selectAll('.resline')
      .data(gc.linreg.resids)
    
  selection.enter()
    .append('path')
    .transition()
    .attr("d", function(d){
      if(d.y0-d.y1 < -gc.linreg.radius) {
        return lineFunction([
          {"x": d.x0, "y": d.y0 + gc.linreg.radius},
          {"x": d.x1, "y": d.y1}]); 
      } else if (d.y0 - d.y1 > gc.linreg.radius){
        return lineFunction([
          {"x": d.x0, "y": d.y0 - gc.linreg.radius},
          {"x": d.x1, "y": d.y1}]);
      } 
    })
    .attr("stroke-width", 3)
    .attr("stroke", "#d9534f")
    .attr('class', 'resline')

  selection.exit().remove()

  selection.enter()
    .each(function(d){
      halfcircles(d);
    })

  return gc.linreg.resids;
}


d3.select('#linreg #checkbox_resid')
  // residuals/data points view switch
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

d3.select('#reset_button').on('click', function() {
  // Remove the elements on the graph
  gc.linreg.svg.selectAll('path.resline')
    .remove();
  gc.linreg.svg.selectAll('path.halfcirc')
    .remove();
  gc.linreg.svg.selectAll('circle')
    .remove();
  gc.linreg.svg.selectAll('#regline')
    .remove();
  // gc.linreg.svg.selectAll('path')
  //   .remove();
  gc.linreg.residview = false;
  gc.linreg.data = []
  gc.linreg.resids = []
});  

