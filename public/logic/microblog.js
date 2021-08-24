$(document).ready(function() {
  //login
  $('#loginButton').on('click', function() {

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
      if (this.readyState === 4 && this.status === 200) {

        location.assign('/microblog/blog');

      } else if (this.readyState === 4 && this.status === 404) {

        document.getElementById("status").innerHTML =
          'username o password non validi!';

      }
    };

    var username = $('#username');
    var password = $('#password');
    var user = {
      username: username.val(),
      password: password.val()
    };

    var address = "/microblog/login";
    xhttp.open("POST", address);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));

  });

  //registrazione
  $('#signInButton').on('click', function() {

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
      if (this.readyState === 4 && this.status === 201) {

        location.assign('/microblog/login');

      } else if (this.readyState === 4 && this.status === 404) {

        document.getElementById("status").innerHTML =
          'username o password non validi!';

      }
    };
    var name = $('#name');
    var surname = $('#surname');
    var email = $('#email');
    var dateOfBirth = $('#dateOfBirth');
    var username = $('#username');
    var password = $('#password');
    var user = {
      name: name.val(),
      surname: surname.val(),
      email: email.val(),
      dateOfBirth: dateOfBirth.val(),
      username: username.val(),
      password: password.val()
    };

    var address = "/microblog/signin";
    xhttp.open("POST", address);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));

  });

  //nuovo post
  $('#postButton').on('click', function() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
      if (this.readyState === 4 && this.status === 201) {
        location.reload();
      }
    };

    var title = $('#title');
    var text = $('#newPostText');
    var newPost = {
      title: title.val(),
      text: text.val()
    };

    var address = "/microblog/posts";
    xhttp.open("POST", address);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newPost));
  });

  //like
  $(".likeImg").on('click', function() {
    var postId = $(this).parent().parent().attr('id');
    var likeImgElement = $(this);
    var address = "/microblog/posts/" + postId + '/likes';
    var likeCounterElement = document.getElementById('likeCounter' + postId);

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {

      if (this.readyState === 4 && this.status === 204) {
        //se toglie il like
        if (likeImgElement.attr('src') === '/public/img/liked.png') {
          likeImgElement.attr('src', '/public/img/like.png');
          likeCounterElement.innerHTML--;
        }
        //se mette il like
        else {
          likeImgElement.attr('src', '/public/img/liked.png');
          likeCounterElement.innerHTML++;
        }
      }
    };

    xhttp.open("PATCH", address);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  });

  //nuovo commento
  $('#newCommentButton').on('click', function() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
      if (this.readyState === 4 && this.status === 201) {
        var iframe = document.getElementById('commentsIframe');
        var comments = iframe.contentWindow.document.getElementById('comments');
        var postId = document.getElementById('newCommentPostId').getAttribute('value');
        var newCommentHTML = response.srcElement.response;
        comments.innerHTML = newCommentHTML + iframe.contentWindow.document.getElementById('comments').innerHTML;

        document.getElementById('commentCounter' + postId).innerHTML++;
      }
    };

    var text = $('#newCommentText');
    var newComment = {
      text: text.val()
    };
    var postId = document.getElementById('newCommentPostId').getAttribute('value');
    var address = "/microblog/posts/" + postId + "/comments";
    xhttp.open("POST", address);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newComment));
  });

  //apre la sezione commenti del post
  $(".commentImg").on('click', function() {
    var postId = $(this).parent().parent().attr('id');

    document.getElementById('commentsIframe').setAttribute('src', "/microblog/posts/" + postId + '/comments');
    document.getElementById('newCommentPostId').setAttribute('value', postId);

    document.body.style.overflow = "hidden";
    var offset = window.pageYOffset;
    for (var i = 0; i < document.getElementsByClassName("fullscreenSection").length; i++) {
      var bb = document.getElementsByClassName("fullscreenSection")[i].style.top + offset;
      document.getElementsByClassName("fullscreenSection")[i].style.top = offset + "px";
    };
    document.getElementById("commentsSection").style.height = "100%";
    setTimeout(function() {
      document.getElementById("commentsSection").style.overflow = "overlay"
    }, 500);
  });
});

//apre il form per creare un post
function openNewPostSection() {
  document.body.style.overflow = "hidden";
  document.getElementById("newPostSection").style.height = "100%";
  //fa in modo che non si veda la scrollbar mentre si apre la tendina
  setTimeout(function() {
    document.getElementById("newPostSection").style.overflow = "overlay"
  }, 500);
}

function closeCommentsSection() {
  document.getElementById("commentsSection").style.height = "0%";
  document.getElementById("commentsSection").style.overflow = "hidden";
  setTimeout(function() {
    document.body.style.overflow = "overlay";
  }, 500);
  for (var i = 0; i < document.getElementsByClassName("fullscreenSection").length; i++) {
    document.getElementsByClassName("fullscreenSection")[i].style.top = "0";
  };
}
//chiude il form per creare un post
function closeNewPostSection() {
  document.getElementById("newPostSection").style.height = "0%";
  document.getElementById("newPostSection").style.overflow = "hidden"
  setTimeout(function() {
    document.body.style.overflow = "overlay";
  }, 500);
}