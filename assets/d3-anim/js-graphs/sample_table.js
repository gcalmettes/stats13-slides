/* global d3 */

var gc = gc || {};

gc.sampletable = gc.sampletable || {};

gc.sampletable.init = function() {
  'use strict';
  d3.text("assets/d3-anim/js-graphs/js-graphs-data-src/salaries-ucla-sample.csv", function(data) {
    var parsedCSV = d3.csvParseRows(data);

    var container = d3.select("#sampletable .placeholder")
      .append("table")
      .attr("width", "90%")
      .style("font-size", "0.6em")

      .selectAll("tr")
      .data(parsedCSV).enter()
      .append("tr")

      .selectAll("td")
      .data(function(d) { return d; }).enter()
      .append("td")
      .text(function(d) { return d; });
  });
};
