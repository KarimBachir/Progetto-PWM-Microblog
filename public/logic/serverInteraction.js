function validateSignin(name, surname, email, birthday, username, password) {
  var output = {
    result: false,
    text: ''
  };
  //almeno 3 e massimo 16 caratteri, usato per name e surname
  let namePattern = new RegExp(/^[a-zA-Z]{3,16}$/);
  //emailregex http://emailregex.com/
  let emailPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  //formato accettato GG/MM/AAAA
  let datePattern = new RegExp(/^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/);
  //almeno 4 e massimo 16 caratteri, numeri o simboli
  let usernamePattern = new RegExp(/^[\w#\?!@\$%\^&\*-]{4,16}$/);
  /*
  -bisogna verificare che non ci siano spazi-
  minimo 8 e massimo 20 caratteri
  almeno una maiuscola
  almeno una minuscola
  almeno un numero
  almeno un simbolo tra #?!@$%^&*-
  */
  let passwordPattern = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#\?!@\$%\^&\*-]).{8,20}$/);
  //uno o più spazi
  let spacePattern = new RegExp(/[\s]+/);

  if (!namePattern.test(name)) {
    output.text = "nome non idoneo, verifica i requisiti...";
  } else if (!namePattern.test(surname)) {
    output.text = "cognome non idoneo, verifica i requisiti...";
  } else if (!emailPattern.test(email)) {
    output.text = "email non idonea, verifica i requisiti...";
  } else if (!datePattern.test(birthday)) {
    output.text = "data non idonea...";
  } else if (!usernamePattern.test(username)) {
    output.text = "username non idoneo, verifica i requisiti...";
  } else if (spacePattern.test(password)) {
    output.text = "la password non deve contenere spazi!";
  } else if (!passwordPattern.test(password)) {
    output.text = "password non idonea, verifica i requisiti...";
  } else {
    output.result = true;
  }
  return output;
}

function validateNewPost(title, text) {
  var output = {
    result: false,
    text: ''
  };
  if (!title.replace(/\s/g, '').length) {
    output.text = "titolo vuoto o con solo spazi";
  } else if (!text.replace(/\s/g, '').length) {
    output.text = "testo vuoto o con solo spazi";
  } else {
    output.result = true;
  }
  return output;
}

function validateNewComment(text) {
  var output = {
    result: false,
    text: ''
  };
  if (!text.replace(/\s/g, '').length) {
    output.text = "testo vuoto o con solo spazi";
  } else {
    output.result = true;
  }
  return output;
}
$(document).ready(function() {
  $('#status').on('click', function() {
    $("#status").fadeOut('fast');
  });
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

    var name = $('#name').val();
    var surname = $('#surname').val();
    var email = $('#email').val();
    var arBirthday = $('#birthday').val().split("-");
    var birthday = arBirthday[2] + "/" + arBirthday[1] + "/" + arBirthday[0];
    var username = $('#signinUsername').val();
    var password = $('#signinPassword').val();
    var validation = validateSignin(name, surname, email, birthday, username, password);

    if (validation.result) {

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

      var user = {
        name: name,
        surname: surname,
        email: email,
        birthday: birthday,
        username: username,
        password: password
      };
      var address = "/microblog/signin";
      xhttp.open("POST", address);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(user));

    } else {
      document.getElementById("status").innerHTML = validation.text;
      $("#status").fadeIn('fast');
      $("#status").effect("shake", {
        direction: "left",
        times: 2,
        distance: 10
      }, 250);
    }
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
    var title = $('#title').val();
    var text = $('#newPostText').val();
    var validation = validateNewPost(title, text);
    if (validation.result) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(response) {
        if (this.readyState === 4 && this.status === 201) {
          location.reload();
        } else if (this.readyState === 4 && this.status === 400) {
          document.getElementById("status").innerHTML = JSON.parse(this.responseText).text;
          $("#status").fadeIn('fast');
          $("#status").effect("shake", {
            direction: "left",
            times: 2,
            distance: 10
          }, 250);
        } else if (this.readyState === 4 && this.status === 401) {
          document.getElementById("loginNeededSection").style.height = "100%";
        }
      }
      var newPost = {
        title: title,
        text: text
      };

      var address = "/microblog/posts";
      xhttp.open("POST", address);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(newPost));
    } else {
      document.getElementById("status").innerHTML = validation.text;
      $("#status").fadeIn('fast');
      $("#status").effect("shake", {
        direction: "left",
        times: 2,
        distance: 10
      }, 250);
    }
  });

  //nuovo commento
  $('#newCommentButton').on('click', function() {
    var text = $('#newCommentText').val();
    var validation = validateNewComment(text);
    if (validation.result) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(response) {
        if (this.readyState === 4 && this.status === 201) {
          var iframe = document.getElementById('commentsIframe');
          var comments = iframe.contentWindow.document.getElementById('comments');
          var postId = document.getElementById('newCommentPostId').getAttribute('value');
          var newCommentHTML = response.srcElement.response;
          comments.innerHTML = newCommentHTML + iframe.contentWindow.document.getElementById('comments').innerHTML;
          document.getElementById('commentCounter' + postId).innerHTML++;

        } else if (this.readyState === 4 && this.status === 400) {
          document.getElementById("status").innerHTML = JSON.parse(this.responseText).text;
          $("#status").fadeIn('fast');
          $("#status").effect("shake", {
            direction: "left",
            times: 2,
            distance: 10
          }, 250);

        } else if (this.readyState === 4 && this.status === 401) {
          document.getElementById("loginNeededSection").style.height = "100%";
        }
      };

      var newComment = {
        text: text
      };
      var postId = document.getElementById('newCommentPostId').getAttribute('value');
      var address = "/microblog/posts/" + postId + "/comments";
      xhttp.open("POST", address);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(newComment));

    } else {
      document.getElementById("status").innerHTML = validation.text;
      $("#status").fadeIn('fast');
      $("#status").effect("shake", {
        direction: "left",
        times: 2,
        distance: 10
      }, 250);
    }
  });

});