'use strict';

function loadDataSrcSVG() {
  var svgsToLoad = document.querySelectorAll('svg[data-src]');

  var loadSVGs = Array.map.call(svgsToLoad, function (svg) {
    fetch(svg.getAttribute('data-src')).then(function (response) {
      return response.text();
    }).then(function (svgCode) {
      var svgDoc = new DOMParser().parseFromString(svgCode, 'image/svg+xml');
      var newSVG = svgDoc.documentElement;
      for (var i = 0; i < svg.attributes.length; i++) {
        var attr = svg.attributes[i];
        newSVG.setAttribute(attr.name, attr.value);
      }
      svg.parentNode.replaceChild(newSVG, svg);
    });
  });

  Promise.all(loadSVGs).then(function (val) {
    var stretchSVGs = document.querySelectorAll('svg.stretch:not([preserveAspectRatio])');
    Array.map.call(stretchSVGs, function (svg) {
      if (!svg.hasAttribute('viewBox')) {
        var w = svg.getAttribute('width');
        var h = svg.getAttribute('height');
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    });
  });
}
