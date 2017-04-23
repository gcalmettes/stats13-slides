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

  'liveplotcoinflip': {
    'init': function() {
      'use strict';
      gc.liveplotcoinflip.init();
    }
  },
  'liveplotcoinflip2': {
    'init': function() {
      'use strict';
      gc.liveplotcoinflip.init2();
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

  'samplingdist': {
    'init': function() {
      'use strict';
      gc.samplingdist.update();
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

  'livesamplingwords': {
    'init': function() {
      'use strict';
      gc.livesamplingwords.init();
    }
  },

  'sampletable': {
    'init': function() {
      'use strict';
      gc.sampletable.init();
    }
  },

  'samplingframe': {
    'init': function() {
      'use strict';
      gc.samplingframe.init();
    }
  },

  'simplerandomsample': {
    'init': function() {
      'use strict';
      gc.simplerandomsample.init();
    }
  },

  'bootstrap': {
    'init': function() {
      'use strict';
      gc.bootstrap.init();
    },
    '-1': function() {
      'use strict';
      gc.bootstrap.reset_color();
    },
    0: function() {
      'use strict';
      gc.bootstrap.select_sample_multi_color();
    },
    1: function() {
      'use strict';
      gc.bootstrap.select_sample_multi_color();
    },
    2: function() {
      'use strict';
      gc.bootstrap.select_sample_multi_color();
    },
    3: function() {
      'use strict';
      gc.bootstrap.select_sample_multi_color();
    },
    4: function() {
      'use strict';
      gc.bootstrap.select_sample_multi_color();
    },
    5: function() {
      'use strict';
      gc.bootstrap.select_sample_multi_color();
    },
    6: function() {
      'use strict';
      gc.bootstrap.select_sample_multi_color();
    },
  },

  'bootstrap2': {
    'init': function() {
      'use strict';
      gc.bootstrap.init2();
    },
    '-1': function() {
      'use strict';
      gc.bootstrap.reset_color2();
    },
    0: function() {
      'use strict';
      gc.bootstrap.select_sample_multi_color2();
    },
    1: function() {
      'use strict';
      gc.bootstrap.select_sample_multi_color2();
    }
  },


  'shuffling': {
    'init': function() {
      'use strict';
      gc.shuffling.init();
    },
    '-1': function() {
      'use strict';
      gc.shuffling.reset_color();
    },
    0: function() {
      'use strict';
      gc.shuffling.shuffle();
    },
    1: function() {
      'use strict';
      gc.shuffling.shuffle();
    },
    2: function() {
      'use strict';
      gc.shuffling.shuffle();
    },
    3: function() {
      'use strict';
      gc.shuffling.shuffle();
    },
    4: function() {
      'use strict';
      gc.shuffling.shuffle();
    },
    5: function() {
      'use strict';
      gc.shuffling.shuffle();
    },
    6: function() {
      'use strict';
      gc.shuffling.shuffle();
    },
  },

};
