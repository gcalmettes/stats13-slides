/* global d3 */
var gc = gc || {};

 // Dictionnary of all the slides ID containing a d3 visualization
 // and associated functions to be called in fragments
gc.slideIdToFunctions = {

  'example-bind-result': {
    'init': function() {
      'use strict';
      gc.exampleBind.init();
    },
    '-1': function() {
      'use strict';
      d3.json('../assets/d3graphs/data/example-2000.json', pt.exampleBind.update);
    },
    0: function() {
      'use strict';
      d3.json('../assets/d3graphs/data/example-2005.json', pt.exampleBind.update);
    }
  },

  'gestalt': {
    'init': function() {
      'use strict';
      gc.gestalt.init();
    },
    '-1': function() {
      'use strict';
      gc.gestalt.base();
    },
    0: function() {
      'use strict';
      gc.gestalt.similarity();
    },
    1: function() {
      'use strict';
      gc.gestalt.proximity();
    },
    2: function() {
      'use strict';
      gc.gestalt.enclosure();
    }
  },

  'liveplot': {
    'init': function() {
      'use strict';
      gc.liveplot.init();
    }
  },

  'soho': {
    'init': function() {
      'use strict';
      gc.soho.init();
    },
    '-1': function() {
      'use strict';
      gc.soho.zoomout();
    },
    0: function() {
      'use strict';
      gc.soho.zoomin();
    },
    1: function(){
      'use strict'
      gc.soho.highligth_bg();
    }
  },

  'cholera': {
    'init': function() {
      'use strict';
      gc.globe.init();
    },
     '-1': function() {
       'use strict';
       gc.globe.zoomout();
     },
     0: function() {
       'use strict';
       gc.globe.india();
     },
     1: function() {
       'use strict';
       gc.globe.russia();
     },
      2: function() {
       'use strict';
       gc.globe.zoomin();
     }
  },

  'london-waterworks': {
    'init': function() {
      'use strict';
      gc.waterworks.init();
    },
    '-1': function() {
       'use strict';
       gc.waterworks.zoomout();
     },
    0: function() {
       'use strict';
       gc.waterworks.lambeth_move();
     },
     1: function() {
       'use strict';
       gc.waterworks.zoomin();
     },
  },

  'histogram': {
    'init': function() {
      'use strict';
      gc.histogram.update();
    }
  },

  'bardeaths': {
    'init': function() {
      'use strict';
      gc.bardeaths.init();
    },
    '-1': function() {
      'use strict';
      gc.bardeaths.bar_raw();
    },
    0: function() {
      'use strict';
      gc.bardeaths.bar_raw();
    },
    1: function() {
      'use strict';
      gc.bardeaths.bar_raw();
    },
    2: function() {
      'use strict';
      gc.bardeaths.bar_norm();
    }
  },

};
