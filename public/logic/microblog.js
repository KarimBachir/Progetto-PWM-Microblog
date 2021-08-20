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
    var text = $('#text');
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
  $(".like").on('click', function() {
    var postId = $(this).attr('id');
    var address = "/microblog/posts/" + postId + '/likes';

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
      var likeImgElement = document.getElementById(postId);
      var likeCounterElement = document.getElementById('counter' + postId);

      if (this.readyState === 4 && this.status === 204) {
        //se toglie il like
        if (likeImgElement.getAttribute('src') === '/public/img/liked.png') {
          likeImgElement.setAttribute('src', '/public/img/like.png');
          likeCounterElement.innerHTML--;
        }
        //se mette il like
        else {
          likeImgElement.setAttribute('src', '/public/img/liked.png');
          likeCounterElement.innerHTML++;
        }
      }
    };

    xhttp.open("PATCH", address);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  });
});

//apre il form per creare un post
function openNav() {
  document.getElementById("myNav").style.height = "100%";
  //fa in modo che non si veda la scrollbar mentre si apre la tendina
  setTimeout(function() {
    document.getElementById("myNav").style.overflow = "auto"
  }, 500);
}
//chiude il form per creare un post
function closeNav() {
  document.getElementById("myNav").style.overflow = "hidden";
  document.getElementById("myNav").style.height = "0%";
}