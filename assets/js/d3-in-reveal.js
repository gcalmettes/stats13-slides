/* global Reveal */

var gc = gc || {};

gc.handleEvent = function(isSlideEvent) {
  'use strict';

  var currentSlideId = Reveal.getCurrentSlide().id;
  var currentFragment = Reveal.getIndices().f;

  // Don't go any further if the slide has no ID (i.e. the string is empty).
  if (!currentSlideId) {
    return;
  }

  // If there is no entry corresponding to the current slide in the map, don't go further.
  var functions = gc.slideIdToFunctions[currentSlideId];
  if (functions == null) {
    return;
  }

  // Call the init function when arriving on a slide for the first time.
  if (isSlideEvent) {
    var initFunction = functions.init;
    if (initFunction != null) {
      initFunction();
      // Make sure we don't call the init function again.
      functions.init = null;
    }
  }

  var fragmentFunction = functions[currentFragment];
  if (fragmentFunction != null) {
    fragmentFunction();
  }
};

gc.handleSlideEvent = function() {
  'use strict';
  gc.handleEvent(true);
};

gc.handleFragmentEvent = function() {
  'use strict';
  gc.handleEvent(false);
};

Reveal.addEventListener('slidechanged', gc.handleSlideEvent);

Reveal.addEventListener('fragmentshown', gc.handleFragmentEvent);

Reveal.addEventListener('fragmenthidden', gc.handleFragmentEvent);
