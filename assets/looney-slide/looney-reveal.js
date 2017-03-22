Reveal.addEventListener( 'looney', function() {
  var target_slide = document.getElementById("looney")
  // initiate looney circles
  var link = document.createElement("link")
  link.type = "text/css"
  link.rel = "stylesheet"
  target_slide.appendChild(link)
  link.href = "assets/looney-slide/looney.css";

 });
