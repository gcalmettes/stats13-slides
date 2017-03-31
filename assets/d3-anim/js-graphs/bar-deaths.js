/* global d3 */

var gc = gc || {};

gc.bardeaths = gc.bardeaths || {};

// Set the dimensions of the canvas / graph
gc.bardeaths.margin = { top: 10, right: 10, bottom: 60, left: 90 },
  gc.bardeaths.width = 550 - gc.bardeaths.margin.left - gc.bardeaths.margin.right,
  gc.bardeaths.height = 350 - gc.bardeaths.margin.top - gc.bardeaths.margin.bottom;

// Function to insert line for x axis label when <br> is inserted
gc.bardeaths.insertLinebreaks = function (d) {
  var el = d3.select(this);
  var words = d.split('<br>');
  el.text('');
  for (var i = 0; i < words.length; i++) {
      var tspan = el.append('tspan').text(words[i]);
      if (i > 0)
          tspan.attr('x', 0).attr('dy', '20');
  }
};

gc.bardeaths.ylabel = function(subject){
  return subject=="deaths_raw" ? " " : "(per 10,000 houses)"
};

gc.bardeaths.init = function(){
  
  //
  gc.bardeaths.data = [
    {name: 'Southwark<br>& Vauxhaull', deaths_raw: 1263,   deaths_norm: 315},
    {name: 'Lambeth<br>Waterworks', deaths_raw: 98,   deaths_norm: 37},
    {name: 'Rest of<br>London', deaths_raw: 1422,   deaths_norm: 59},
  ];
  
  gc.bardeaths.init_subject = 'deaths_raw';
  
  // Set the ranges
  gc.bardeaths.x = d3.scaleLinear()
    .rangeRound([0, gc.bardeaths.width])
    .domain([1, 15]);;
  gc.bardeaths.y = d3.scaleLinear()
    .range([gc.bardeaths.height, 0]);
  gc.bardeaths.xScale = d3.scaleBand()
    .domain(gc.bardeaths.data.map(d => d.name))
    .range([0, gc.bardeaths.width])
    .padding(0.2);
  gc.bardeaths.yScale = d3.scaleLinear()
    .domain([0, d3.max(gc.bardeaths.data, function(d) { return d[gc.bardeaths.subject]; })])
    .range([gc.bardeaths.height, 0]);
  
  gc.bardeaths.xAxis = d3.axisBottom(gc.bardeaths.xScale);
  gc.bardeaths.yAxis = d3.axisLeft(gc.bardeaths.yScale);
  
  gc.bardeaths.svg = d3.select('#bardeaths .placeholder')
    .append('svg')
      .attr('width', gc.bardeaths.width + gc.bardeaths.margin.left + gc.bardeaths.margin.right)
      .attr('height', gc.bardeaths.height + gc.bardeaths.margin.top + gc.bardeaths.margin.bottom)
    .append('g')
      .attr("transform",
                "translate(" + gc.bardeaths.margin.left + "," + gc.bardeaths.margin.top + ")");
  
  //xAxis
  gc.bardeaths.svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + gc.bardeaths.height + ")")
    .call(gc.bardeaths.xAxis)
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-size","2.2em")
      .style("font-family", "Raleway")
      .style("fill","white")
      .each(gc.bardeaths.insertLinebreaks);
  //yaxis
  gc.bardeaths.svg.append("g")
    .attr("class", "yaxis")
    .call(gc.bardeaths.yAxis)
      .selectAll("text")
      .style("font-size","1.5em")
      .style("font-family", "Raleway")
      .style("fill","white");
  
  // x and y axis white
  gc.bardeaths.svg.selectAll(".domain")
    .styles({ fill:"none", stroke:"white",  "stroke-width":"2" });
  gc.bardeaths.svg.selectAll("g.tick line")
    .styles({ fill:"none", stroke:"white",  "stroke-width":"2" });
  
  //initialize yaxis label in 2 lines
  gc.bardeaths.svg.append("text")
    .attr("class", "ylabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - gc.bardeaths.margin.left)
      .attr("x",0 - (gc.bardeaths.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","0.5em")
      .style("font-family", "Raleway")
      .style("fill","white")
      .text("Deaths");
  gc.bardeaths.svg.append("text")
    .attr("class", "ylabel2")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - gc.bardeaths.margin.left)
      .attr("x",0 - (gc.bardeaths.height / 2))
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .style("font-size","0.5em")
      .style("font-family", "Raleway")
      .style("fill","#f0ad4e")
      .text(gc.bardeaths.ylabel(gc.bardeaths.init_subject));
};


gc.bardeaths.draw_bar = function(subject) {
  gc.bardeaths.yScale
    .domain([0, d3.max(gc.bardeaths.data, function(d) { return d[subject]; })])
  gc.bardeaths.bars = gc.bardeaths.svg.selectAll('rect')
    .data(gc.bardeaths.data); // add all the data even if zero. Needed for transition
  gc.bardeaths.bars.exit()
    .remove();
  gc.bardeaths.bars.transition() // NEW
    .duration(100) // Also NEW
    .attr('y', d => gc.bardeaths.yScale(d[subject]))
    .attr('height', d => gc.bardeaths.height - gc.bardeaths.yScale(d[subject]));
  gc.bardeaths.bars.enter()
    .append('rect')
    .style('fill', '#5bc0de')
    .attr('x', d => gc.bardeaths.xScale(d.name))
    .attr('width', d => gc.bardeaths.xScale.bandwidth())
    .attr('y', d => gc.bardeaths.yScale(d[subject]))
    .attr('height', d => gc.bardeaths.height - gc.bardeaths.yScale(d[subject]));
  //update yaxis
  gc.bardeaths.svg.select(".yaxis")
    .transition()
    .duration(200)
    .call(gc.bardeaths.yAxis);
  //update yticks label font size
  gc.bardeaths.svg.select(".yaxis")
    .selectAll("text")
    .style("font-size","1.5em")
    .style("font-family", "Raleway")
    .style("fill","white");
  //update yaxis label
  gc.bardeaths.svg.select(".ylabel2")
    .text(gc.bardeaths.ylabel(subject));
  gc.bardeaths.svg.selectAll("g.tick line")
    .styles({ fill:"none", stroke:"white",  "stroke-width":"2" });
};


gc.bardeaths.bar_raw = function(subject) {
  gc.bardeaths.draw_bar("deaths_raw")
};


gc.bardeaths.bar_norm = function(subject) {
  gc.bardeaths.draw_bar("deaths_norm")
};

