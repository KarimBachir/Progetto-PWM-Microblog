$(document).ready(function() {

  //fa vibrare il messaggio a comparsa di allerta login necessario
  $('#loginNeededSection').on('click', function() {
    $("#loginNeededContainer").effect("shake", {
      direction: "left",
      times: 2,
      distance: 10
    }, 250);
  });

  //chiude la sezione a comparsa di allerta login necessario
  $("#closeLoginNeededSectionButton").on('click', function() {
    document.getElementById("loginNeededSection").style.height = "0%";
  });

  //apre il form per creare un post
  $("#newPostButton").on('click', function() {
    document.getElementById("newPostSection").style.height = "100%";
    //fa in modo che non si veda la scrollbar mentre si apre la tendina
    setTimeout(function() {
      document.getElementById("newPostSection").style.overflow = "overlay"
    }, 500);
  });

  //chiude il form per creare un post
  $("#closeNewPostSectionButton").on('click', function() {
    document.getElementById("newPostSection").style.height = "0%";
    document.getElementById("newPostSection").style.overflow = "hidden";
  });

  //apre la sezione commenti del post
  $(".commentImg").on('click', function() {
    var postId = $(this).parent().parent().attr('id');

    document.getElementById('commentsIframe').setAttribute('src', "/microblog/posts/" + postId + '/comments');
    document.getElementById('newCommentPostId').setAttribute('value', postId);
    document.getElementById("commentsSection").style.height = "100%";
    //fa in modo che non si veda la scrollbar mentre si apre la tendina
    setTimeout(function() {
      document.getElementById("commentsSection").style.overflow = "overlay"
    }, 500);
  });

  //chiude la sezione commenti del post
  $("#closeCommentsSectionButton").on('click', function() {
    document.getElementById("commentsSection").style.height = "0%";
    document.getElementById("commentsSection").style.overflow = "hidden";

    for (var i = 0; i < document.getElementsByClassName("fullscreenSection").length; i++) {
      document.getElementsByClassName("fullscreenSection")[i].style.top = "0";
    };
  });

});
