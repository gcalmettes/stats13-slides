/* global d3 */

var gc = gc || {};

gc.bootstrap = gc.bootstrap || {};

gc.bootstrap.WIDTH = 380;
gc.bootstrap.HEIGHT = 420;
gc.bootstrap.svg = null;

gc.bootstrap.sampleSize = 100;
gc.bootstrap.populationSize = 100;

gc.bootstrap.pointRadius = 10;
gc.bootstrap.red = "#d9534f";


gc.bootstrap.init = function() {
  'use strict';

  gc.bootstrap.xScale = d3.scaleLinear()
    .domain([0,10])
    .range([gc.bootstrap.pointRadius*2, gc.bootstrap.WIDTH]);
  gc.bootstrap.yScale = d3.scaleLinear()
    .domain([0,10])
    .range([gc.bootstrap.pointRadius*2, gc.bootstrap.HEIGHT]);

  gc.bootstrap.svg = d3.select('#bootstrap .placeholder')
    .append('svg')
    .attr('width', gc.bootstrap.WIDTH)
    .attr('height', gc.bootstrap.HEIGHT)
    // .style('background', 'white');

  gc.bootstrap.circles = gc.bootstrap.svg.selectAll("circle")
      .data(d3.range(gc.bootstrap.populationSize).map(function(d,i) {return {x: i%10, y: Math.floor(i/10)}}))
      .enter()
      .append("circle");

  gc.bootstrap.circles
        .attr("cx", function(d) {return gc.bootstrap.xScale(d.x)})
        .attr("cy", function(d) {return gc.bootstrap.yScale(d.y)})
        .attr("r", gc.bootstrap.pointRadius)
        .style("fill", "lightgray")
        .style("stroke", "black")
        .style("stroke-width", "1px");

};

gc.bootstrap.select_sample_single_color = function(){

  gc.bootstrap.svg.selectAll(".selected_point_fill").remove();
  gc.bootstrap.svg.selectAll(".selected_point_stroke").remove();

  var chosen_circles = []

  for (var i = 0; i < gc.bootstrap.sampleSize; i++){
    index_in_circles = Math.floor(Math.random()*gc.bootstrap.circles._groups[0].length);
    selected_point = d3.select(gc.bootstrap.circles._groups[0][index_in_circles])

    chosen_circles.push(index_in_circles);

    gc.bootstrap.svg
      .append("circle")
        .attr("class", "selected_point_fill")
        .attr("cx", selected_point.attr("cx"))
        .attr("cy", selected_point.attr("cy"))
        .attr("r", gc.bootstrap.pointRadius)
        .style("fill", gc.bootstrap.red);

    gc.bootstrap.svg.append("circle")
      .attr("class", "selected_point_stroke")
      .attr("cx", selected_point.attr("cx"))
      .attr("cy", selected_point.attr("cy"))
      .attr("r", gc.bootstrap.pointRadius + (2/3)*gc.bootstrap.pointRadius)
      .style("fill-opacity", 0)
      .style("stroke-width",1)
      .style("stroke",gc.bootstrap.red);
  }
};

gc.bootstrap.select_sample_multi_color = function(){
  //attribute colors based on number of time point has been 
  //selected
  gc.bootstrap.svg.selectAll(".selected_point_fill").remove();
  gc.bootstrap.svg.selectAll(".selected_point_stroke").remove();

  var chosen_circles = []

  for (var i = 0; i < gc.bootstrap.sampleSize; i++){
    index_in_circles = Math.floor(Math.random()*gc.bootstrap.circles._groups[0].length);
    selected_point = d3.select(gc.bootstrap.circles._groups[0][index_in_circles])

    chosen_circles.push(index_in_circles);
  };

  var selected_idx = gc.bootstrap.count_frequency(chosen_circles);
  for (var i = 0; i < selected_idx.length; i++){

    selected_point = d3.select(gc.bootstrap.circles._groups[0][selected_idx[i].idx])

    if (selected_idx[i].freq == 1){
      var color = "#d9534f"
    }
    else if (selected_idx[i].freq == 2) {
      var color = "#5bc0de"
    }
    else {
      var color = "#f0ad4e"
    };
    
    gc.bootstrap.svg
      .append("circle")
        .attr("class", "selected_point_fill")
        .attr("cx", selected_point.attr("cx"))
        .attr("cy", selected_point.attr("cy"))
        .attr("r", gc.bootstrap.pointRadius)
        .style("fill", color);

    gc.bootstrap.svg.append("circle")
      .attr("class", "selected_point_stroke")
      .attr("cx", selected_point.attr("cx"))
      .attr("cy", selected_point.attr("cy"))
      .attr("r", gc.bootstrap.pointRadius + (2/3)*gc.bootstrap.pointRadius)
      .style("fill-opacity", 0)
      .style("stroke-width",1)
      .style("stroke",color);

  }

};

gc.bootstrap.reset_color = function(){
  //attribute colors based on number of time point has been 
  //selected
  gc.bootstrap.svg.selectAll(".selected_point_fill").remove();
  gc.bootstrap.svg.selectAll(".selected_point_stroke").remove();

};

gc.bootstrap.count_frequency = function(arr) {
    var a = [], b = [], prev;
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
      if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
      } else {
        b[b.length-1]++;
      }
      prev = arr[i];
    }

    var data_idx = []
    for ( var i = 0; i < a.length; i++ ) {
      data_idx.push({idx: a[i], freq: b[i]})
    }
  return data_idx;
}


