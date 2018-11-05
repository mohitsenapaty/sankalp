
$(document).ready(function(){

  //here
  window.onscroll = function() {headerScroll()};

  var header = document.getElementById("myHeader");
  var sticky = header.offsetTop;
  function headerScroll() {
    if (window.pageYOffset >= sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

});
