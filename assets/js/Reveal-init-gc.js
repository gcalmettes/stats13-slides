// More info https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
  width: 960,
  height: 700,
  // margin: 0.05, // Factor of the display size that should remain empty around the content
  controls: false, // Display controls in the bottom right corner
  progress: true, // Display a presentation progress bar
  slideNumber: false, // Display the page number of the current slide
  history: true, // Push each slide change to the browser history
  keyboard: true, // Enable keyboard shortcuts for navigation
  center: false, // Vertical centering of slide
  overview: true,
  transition: 'slide', // Transition style: none/fade/slide/convex/concave/zoom
  transitionSpeed: 'default', // Transition speed: default/fast/slow

  keyboard: {
    80: function() {
      if (! window.location.search.match( /print-pdf/gi )) {
        var uri = window.location.toString().split("#")
        window.location.replace(uri[0] + "?print-pdf");
      }
    }
  },

  math: {
    mathjax: 'https://cdn.mathjax.org/mathjax/latest/MathJax.js',
    // mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js',
		config: 'TeX-AMS_HTML-full'  // See http://docs.mathjax.org/en/latest/config-files.html
      },

  menu: {
    // Specifies which side of the presentation the menu will
    // be shown. Use 'left' or 'right'.
    side: 'left',
    // Add slide numbers to the titles in the slide list.
    // Use 'true' or format string (same as reveal.js slide numbers)
    numbers: false,
    // Specifies which slide elements will be used for generating
    // the slide titles in the menu. The default selects the first
    // heading element found in the slide, but you can specify any
    // valid css selector and the text from the first matching
    // element will be used.
    // Note: that a section data-menu-title attribute or an element
    // with a menu-title class will take precedence over this option
    titleSelector: 'h1, h2, h3, h4, h5, h6',
    // Hide slides from the menu that do not have a title.
    // Set to 'true' to only list slides with titles.
    hideMissingTitles: false,
    // Add markers to the slide titles to indicate the
    // progress through the presentation
    markers: true,
    // Specify custom panels to be included in the menu, by
    // providing an array of objects with 'title', 'icon'
    // properties, and either a 'src' or 'content' property.
    custom: false,
    // Specifies the themes that will be available in the themes
    // menu panel. Set to 'false' to hide themes panel.
    themes: [
      { name: 'Black', theme: 'assets/reveal.js-master/css/theme/black.css' },
      { name: 'White', theme: 'assets/reveal.js-master/css/theme/white.css' },
      { name: 'League', theme: 'assets/reveal.js-master/css/theme/league.css' },
      { name: 'Sky', theme: 'assets/reveal.js-master/css/theme/sky.css' },
      { name: 'Beige', theme: 'assets/reveal.js-master/css/theme/beige.css' },
      { name: 'Simple', theme: 'assets/reveal.js-master/css/theme/simple.css' },
      { name: 'Serif', theme: 'assets/reveal.js-master/css/theme/serif.css' },
      { name: 'Blood', theme: 'assets/reveal.js-master/css/theme/blood.css' },
      { name: 'Night', theme: 'assets/reveal.js-master/css/theme/night.css' },
      { name: 'Moon', theme: 'assets/reveal.js-master/css/theme/moon.css' },
      { name: 'Solarized', theme: 'assets/reveal.js-master/css/theme/solarized.css' }
          ],
    // Specifies if the transitions menu panel will be shown.
    transitions: true,
    // Adds a menu button to the slides to open the menu panel.
    // Set to 'false' to hide the button.
    openButton: true,
    // If 'true' allows the slide number in the presentation to
    // open the menu panel. The reveal.js slideNumber option must
    // be displayed for this to take effect
    openSlideNumber: false,
    // If true allows the user to open and navigate the menu using
    // the keyboard. Standard keyboard interaction with reveal
    // will be disabled while the menu is open.
    keyboard: true
  },


  // More info https://github.com/hakimel/reveal.js#dependencies
  dependencies: [
    { src: 'assets/reveal.js-master/lib/js/classList.js', condition: function() { return !document.body.classList; } },
    //{ src: 'assets/reveal.js-master/plugin/markdown/marked.js' },
    //{ src: 'assets/reveal.js-master/plugin/markdown/markdown.js' },
    { src: 'assets/reveal.js-master/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },

    //No need of Maths.js since I am using a modified version (see below)
    // { src: 'assets/reveal.js-master/plugin/math/math.js', async: true },

    { src: 'assets/plugins/reveal.js-plugins-master/menu/menu.js' },
  ],
});

/* ====================== SCRIPT for HEADERs & FOOTERs ====================== */
Reveal.addEventListener('slidechanged', function (event) {
  //event.previousSlide, event.currentSlide, event.indexh, event.indexv
  if (event.currentSlide.dataset.header && event.currentSlide.dataset.state=='showHeaderRight') {
    myHeadRight.innerHTML = event.currentSlide.dataset.header;}
  if (event.currentSlide.dataset.header && event.currentSlide.dataset.state=='showHeaderLeft') {
    myHeadLeft.innerHTML = event.currentSlide.dataset.header;}
  if (event.currentSlide.dataset.footer && event.currentSlide.dataset.state=='showFooterRight') {
    myFootRight.innerHTML = event.currentSlide.dataset.footer;}
  if (event.currentSlide.dataset.footer && event.currentSlide.dataset.state=='showFooterLeft') {
    myFootLeft.innerHTML = event.currentSlide.dataset.footer;}
});
/* ====================== SCRIPT for HEADERs & FOOTERs ====================== */

// <!-- Printing and PDF exports -->
var linkpdf = document.createElement( 'link' );
linkpdf.rel = 'stylesheet';
linkpdf.type = 'text/css';
linkpdf.href = window.location.search.match( /print-pdf/gi ) ? 'assets/reveal.js-master/css/print/pdf.css' : 'assets/reveal.js-master/css/print/paper.css';
document.getElementsByTagName( 'head' )[0].appendChild( linkpdf );


//==========================================
//======== MODIFICATION OF MATHS.JS PLUGIN TO HAVE FRAGMENTS IN MATHJAX
//==========================================

var RevealMath = window.RevealMath || (function(){

  var options = Reveal.getConfig().math || {};
  options.mathjax = options.mathjax || 'https://cdn.mathjax.org/mathjax/latest/MathJax.js';
  options.config = options.config || 'TeX-AMS_HTML-full';

  loadScript( options.mathjax + '?config=' + options.config, function() {

    MathJax.Hub.Config({
      messageStyle: 'none',
      tex2jax: {
        inlineMath: [['$','$'],['\\(','\\)']] ,
        skipTags: ['script','noscript','style','textarea','pre']
      },
      skipStartupTypeset: true
    });

    // Typeset followed by an immediate reveal.js layout since
    // the typesetting process could affect slide height
    MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub ] );
    MathJax.Hub.Queue( Reveal.layout );

    //=====================================
    // Fragments in Mathjax equations
    // usage \fragment{1}{x_1} and \fraglight{highlight-blue}{x_1}
    // and \fragindex{1}{\fraglight{highlight-blue}{x_1}}

        MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
            var TEX = MathJax.InputJax.TeX;

            TEX.Definitions.Add({macros: {'fragment': 'FRAGMENT_INDEX_attribute'}}); // regular fragments
            TEX.Definitions.Add({macros: {'fraglight': 'FRAGMENT_highlight'}}); // highlighted fragments
            TEX.Definitions.Add({macros: {'fragindex': 'FRAGMENT_add_INDEX'}}); // add fragment index to highlighted fragments

            TEX.Parse.Augment({
             FRAGMENT_INDEX_attribute: function (name) {
                 var index = this.GetArgument(name);
                 var arg   = this.ParseArg(name);
                 this.Push(arg.With({
                    'class': 'fragment',
                    attrNames: ['data-fragment-index'],
                    attr: {'data-fragment-index':index}
                 }));
             },
             FRAGMENT_highlight: function (name) {
                 var highlight_kind = this.GetArgument(name);
                 var arg   = this.ParseArg(name);
                 this.Push(arg.With({
                    'class': 'fragment ' + highlight_kind
                 }));
             },
             FRAGMENT_add_INDEX: function (name) {
                 var index = this.GetArgument(name);
                 var arg   = this.ParseArg(name);
                 this.Push(arg.With({
                    attrNames: ['data-fragment-index'],
                    attr: {'data-fragment-index':index}
                 }));
              }
            });
        });

    //=====================================


    // Reprocess equations in slides when they turn visible
    Reveal.addEventListener( 'slidechanged', function( event ) {

      MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub, event.currentSlide ] );

    } );

  } );

  function loadScript( url, callback ) {

    var head = document.querySelector( 'head' );
    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src = url;

    // Wrapper for callback to make sure it only fires once
    var finish = function() {
      if( typeof callback === 'function' ) {
        callback.call();
        callback = null;
      }
    }

    script.onload = finish;

    // IE
    script.onreadystatechange = function() {
      if ( this.readyState === 'loaded' ) {
        finish();
      }
    }

    // Normal browsers
    head.appendChild( script );

  }

})();
