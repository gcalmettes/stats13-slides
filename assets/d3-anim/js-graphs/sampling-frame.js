/* global d3 */

var gc = gc || {};

gc.samplingframe = gc.samplingframe || {};

gc.samplingframe.init = function() {
  'use strict';
  d3.text("assets/d3-anim/js-graphs/js-graphs-data-src/words-sampling-frame.csv", function(data) {
    var parsedCSV = d3.csvParseRows(data);

    var container = d3.select("#samplingframe .placeholder")
      .append("table")
        .attr("width", "95%")
        .style("font-size", "0.42em")

      .selectAll("tr")
        .data(parsedCSV).enter()
        .append("tr")
        .attr("class", "table-leftalign")

      .selectAll("td")
        .data(function(d) { return d; }).enter()
        .append("td")
          .text(function(d) { return d; });
  });
};
