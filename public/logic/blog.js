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

  //logout
  $('#logoutButton').on('click', function() {
    $('#navBar, #blog').fadeOut(() => {
      sessionStorage.clear();
      window.location.href = "/microblog/logout";
    });
  });

  //fa scomparire il div status al click su di esso
  $('#status').on('click', function() {
    $("#status").fadeOut('fast');
  });

  //fa vibrare il messaggio a comparsa di allerta login necessario
  $('#loginNeededSection').bind('open', function() {
    $('#loginNeededSection').show(0, () => {
      $("#loginNeededContainer").effect("shake", {
        direction: "left",
        times: 2,
        distance: 10
      }, 250);
    });

  });

  //apre il form per creare un post
  $("#newPostButton").on('click', function() {
    $('#newPostSection').slideDown('slow');
  });

  //chiude la sezione a schermo intero
  $(".closebtn").on('click', function() {
    $("#status").fadeOut('fast');
    $(this).parent().slideUp('slow', () => {
      if ($(this).parent().attr('id') === 'commentsSection') {
        $('#comments').fadeOut('fast');
      }
    });
  });
});
