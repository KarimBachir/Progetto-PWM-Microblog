//imposta l'altezza corretta della sezione #blog
function setBlogHeight() {
  var footerH = $('#footer').outerHeight(true);
  var navBarH = $('#navBar').outerHeight(true);
  $('#blog').height($(window).height() - footerH - navBarH);
}

$(document).ready(function() {
  $(window).on('resize load', setBlogHeight);
  //quando l'evento open avviene il div status appare
  $('#status').bind('open', function() {
    $("#status").fadeIn('fast');
    $("#status").effect("shake", {
      direction: "left",
      times: 2,
      distance: 10
    }, 250);
  });

  $('#logoutButton').on('click', function() {
    sessionStorage.clear();
    window.location.href = "/microblog/logout";
  });

  //fa scomparire il div status al click su di esso
  $('#status').on('click', function() {
    $("#status").fadeOut('fast');
  });

  //fa vibrare il messaggio a comparsa di allerta login necessario
  $('#loginNeededSection').bind('open', function() {
    document.getElementById("loginNeededSection").style.height = "100%";
    $("#loginNeededContainer").effect("shake", {
      direction: "left",
      times: 2,
      distance: 10
    }, 250);
  });

  //chiude la sezione a comparsa di allerta login necessario
  $("#closeLoginNeededSectionButton, #loginNeededSection").on('click', function() {
    document.getElementById("loginNeededSection").style.height = "0%";
  });

  //apre il form per creare un post
  $("#newPostButton").on('click', function() {
    document.getElementById("newPostSection").style.height = "100%";
  });

  //chiude il form per creare un post
  $("#closeNewPostSectionButton").on('click', function() {
    $("#status").fadeOut('fast');
    document.getElementById("newPostSection").style.height = "0%";
  });

  //chiude la sezione commenti del post
  $("#closeCommentsSectionButton").on('click', function() {
    $("#status").fadeOut('fast');
    document.getElementById("commentsSection").style.height = "0%";
    document.getElementById("comments").remove();
  });

});
