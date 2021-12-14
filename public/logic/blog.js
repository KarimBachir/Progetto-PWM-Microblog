//imposta l'altezza corretta della sezione #blog
function setBlogHeight() {
  var footerH = $('#footer').outerHeight(true);
  var navBarH = $('#navBar').outerHeight(true);
  $('#blog').height($(window).height() - footerH - navBarH);
}

$(document).ready(function() {
  $(window).on('resize load', setBlogHeight);

  //mostra e fa vibrare il div status
  $('#status').bind('open', function() {
    $("#status").fadeIn('fast', () => {
      $("#status").effect("shake", {
        direction: "left",
        times: 2,
        distance: 10
      }, 250);
    });
  });

  //fa scomparire il div status al click su di esso
  $('#status').on('click', function() {
    $("#status").fadeOut('fast');
  });

  //mostra e fa vibrare il messaggio a comparsa di allerta login necessario
  $('#loginNeededSection').bind('open', function() {
    $('#loginNeededSection').show(0, () => {
      $("#loginNeededContainer").effect("shake", {
        direction: "left",
        times: 2,
        distance: 10
      }, 250);
    });
  });

  //chiude la sezione a schermo intero
  $(".closebtn").on('click', function(e, newPost) {
    $("#status").fadeOut('fast');
    $(this).parent().slideUp('slow', () => {
      //se è stata chiusa la sezione dei commenti
      if ($(this).parent().attr('id') === 'commentsSection') {
        $('#comments').fadeOut('fast');
      }
      if (newPost) {
        //aggiunge il post senza ricaricare la pagina
        $('#posts').prepend(newPost);
        if ($('#blog').scrollTop() === 0)
          $('#posts').children(':first').hide().show(600);
        else
          $('#blog').animate({
            scrollTop: "0"
          }, 800, () => {
            $('#posts').children(':first').hide().show(600);
          });
      }
    });
  });

  //apre il form per creare un post
  $("#newPostButton").on('click', function() {
    $('#newPostSection').slideDown('slow');
  });

  //logout
  $('#logoutButton').on('click', function() {
    $('#navBar, #blog').fadeOut(() => {
      sessionStorage.clear();
      window.location.href = "/microblog/logout";
    });
  });
});
