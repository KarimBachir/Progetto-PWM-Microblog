$(document).ready(function() {

  //login
  $('#loginButton').on('click', function() {

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
      if (this.readyState === 4 && this.status === 200) {
        location.assign('/microblog/blog');
      } else if (this.readyState === 4 && this.status === 404) {
        document.getElementById("status").innerHTML =
          'utente non trovato!';
        $("#status").fadeIn('fast');
        $("#status").effect("shake", {
          direction: "left",
          times: 2,
          distance: 10
        }, 250);
      }
    };

    var username = $('#loginUsername');
    var password = $('#loginPassword');
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

        location.assign('/microblog/blog');

      } else if (this.readyState === 4 && this.status === 400) {
        document.getElementById("status").innerHTML =
          JSON.parse(this.responseText).text;
        $("#status").fadeIn('fast');
        $("#status").effect("shake", {
          direction: "left",
          times: 2,
          distance: 10
        }, 250);
      }
    };
    var name = $('#name');
    var surname = $('#surname');
    var email = $('#email');
    var arBirthday = $('#birthday').val().split("-");
    var birthday = arBirthday[2] + "/" + arBirthday[1] + "/" + arBirthday[0];
    var username = $('#signinUsername');
    var password = $('#signinPassword');
    var user = {
      name: name.val(),
      surname: surname.val(),
      email: email.val(),
      birthday: birthday,
      username: username.val(),
      password: password.val()
    };

    var address = "/microblog/signin";
    xhttp.open("POST", address);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));

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
      } else if (this.readyState === 4 && this.status === 401) {
        document.getElementById("loginNeededSection").style.height = "100%";
      }
    };

    xhttp.open("PATCH", address);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  });

  //nuovo post
  $('#postButton').on('click', function() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
      if (this.readyState === 4 && this.status === 201) {
        location.reload();
      } else if (this.readyState === 4 && this.status === 401) {
        document.getElementById("loginNeededSection").style.height = "100%";
      };
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
      } else if (this.readyState === 4 && this.status === 401) {
        document.getElementById("loginNeededSection").style.height = "100%";
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

});