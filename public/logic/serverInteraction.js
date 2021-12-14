function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
  }
}

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
  $('#page').fadeIn(700);
  var sendDataWorker;
  var checkServerOn = false;
  var checkServerWorker;

  if (storageAvailable('sessionStorage')) {
    console.log('sessionStorage disponibile!');
    if (!sessionStorage.getItem('likes')) {
      sessionStorage.setItem('likes', '[]');
    }
    if (window.Worker) {
      sendDataWorker = new Worker('/public/logic/workers/sendDataWorker.js');
      checkServerWorker = new Worker('/public/logic/workers/checkServerWorker.js');
    } else {
      console.log('worker non disponibile');
    }
  } else {
    console.log("sessionStorage non disponibile!");
  }

  sendDataWorker.onmessage = function(e) {
    var likeImgElement;
    var likeCounterElement;
    if (e.data[0] === 1) {
      for (var i = e.data[1].length - 1; i >= 0; i--) {
        likeImgElement = $('#' + e.data[1][i].postId + ' img:first');
        likeCounterElement = document.getElementById('likeCounter' + e.data[1][i].postId);
        //se toglie il like
        if (likeImgElement.attr('src') === '/public/img/liked.png') {
          likeImgElement.attr('src', '/public/img/like.png');
          likeImgElement.attr('alt', 'click to like');
          likeCounterElement.innerHTML--;
        }
        //se mette il like
        else {
          likeImgElement.attr('src', '/public/img/liked.png');
          likeImgElement.attr('alt', 'already liked');
          likeCounterElement.innerHTML++;
        }
        e.data[1].splice(i, 1);
      }

      sessionStorage.setItem('likes', JSON.stringify(e.data[1]));
    } else if (e.data[0] === 0) {
      sessionStorage.setItem('likes', JSON.stringify(e.data[1]));
      checkServerWorker.postMessage(null);
    }
  };

  checkServerWorker.onmessage = function(e) {
    checkServerOn = false;
    var likes = JSON.parse(sessionStorage.getItem('likes'));
    sendDataWorker.postMessage(likes);
  };

  //login
  $('#loginButton').on('click', function() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
      if (this.readyState === 4 && this.status === 200) {
        $('#page').fadeOut(() => {
          location.assign('/microblog/blog');
        });
      } else if (this.readyState === 4 && this.status === 404) {
        $('#status').text('utente non trovato!');
        $("#status").trigger('open');
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

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(response) {
        if (this.readyState === 4 && this.status === 201) {
          $('#page').fadeOut(() => {
            location.assign('/microblog/blog');
          });
        } else if (this.readyState === 4 && this.status === 400) {
          $('#status').text(JSON.parse(this.responseText).text);
          $("#status").trigger('open');
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
      $('#status').text(validation.text);
      $("#status").trigger('open');
    }
  });

  //guest
  $('#guestButton').on('click', function() {
    $('#page').fadeOut(() => {
      location.assign('/microblog/guest');
    });
  });

  //like
  $('body').on('click', '.likeImg', function() {
    var postId = $(this).parent().parent().attr('id');
    var likeImgElement = $(this);
    var address = "/microblog/posts/" + postId + '/likes';
    var likeCounterElement = document.getElementById('likeCounter' + postId);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {

      if (this.readyState === 4) {
        if (this.status === 204) {
          //se toglie il like
          if (likeImgElement.attr('src') === '/public/img/liked.png') {
            likeImgElement.attr('alt', 'click to like');
            likeImgElement.attr('src', '/public/img/like.png');
            likeCounterElement.innerHTML--;
          }
          //se mette il like
          else {
            likeImgElement.attr('src', '/public/img/liked.png');
            likeImgElement.attr('alt', 'already liked');
            likeCounterElement.innerHTML++;
          }
        } else if (this.status === 400) {
          $('#status').text('errore');
          $("#status").trigger('open');
        } else if (this.status === 401) {
          $('#loginNeededSection').trigger('open');
        } else {
          if (window.Worker) {
            //se toglie il like
            if (likeImgElement.attr('src') === '/public/img/liked.png') {
              likeImgElement.attr('alt', 'click to like');
              likeCounterElement.innerHTML--;
              likeImgElement.attr('src', '/public/img/like.png');
            }
            //se mette il like
            else {
              likeImgElement.attr('alt', 'already liked');
              likeCounterElement.innerHTML++;
              likeImgElement.attr('src', '/public/img/liked.png');
            }
            var like = {
              postId: postId
            };
            var likes = JSON.parse(sessionStorage.getItem('likes'));
            likes.push(like);
            sessionStorage.setItem('likes', JSON.stringify(likes));
            console.log('aggiunto: ' + like);
            if (!checkServerOn) {
              checkServerOn = true;
              checkServerWorker.postMessage(null);
            }
          } else {
            console.log('worker non disponibile');
          }
        }
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
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(response) {
        if (this.readyState === 4 && this.status === 201) {
          //chiude il form
          $("#closeNewPostSectionButton").trigger('click', [this.responseText]);
        } else if (this.readyState === 4 && this.status === 400) {
          $('#status').text(JSON.parse(this.responseText).text);
          $("#status").trigger('open');
        } else if (this.readyState === 4 && this.status === 401) {
          $('#loginNeededSection').trigger('open');
        }
      };
      var newPost = {
        title: title,
        text: text
      };

      var address = "/microblog/posts";
      xhttp.open("POST", address);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(newPost));
    } else {
      $('#status').text(validation.text);
      $("#status").trigger('open');
    }
  });

  //ottiene la lista dei commenti di un post e apre la sezione corrispondente
  $('body').on('click', '.commentImg', function() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
      if (this.readyState === 4 && this.status === 200) {
        $('#comments').empty();
        $('#comments').append(this.responseText);
        document.getElementById('newCommentPostId').setAttribute('value', postId);
        //apre la sezione commenti del post
        $('#commentsSection').slideDown('slow', () => {
          $('#comments').fadeIn(200);
        });
      } else if (this.readyState === 4 && this.status === 400) {
        $('#status').text('errore');
        $("#status").trigger('open');
      }
    };

    var postId = $(this).parent().parent().attr('id');
    var address = "/microblog/posts/" + postId + "/comments";
    xhttp.open("GET", address);
    xhttp.send();
  });

  //nuovo commento
  $('#newCommentButton').on('click', function() {
    var text = $('#newCommentText').val();
    var validation = validateNewComment(text);
    if (validation.result) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(response) {
        if (this.readyState === 4 && this.status === 201) {
          //aggiunge il commento senza ricaricare la pagina
          $("#comments").prepend(this.responseText);
          if ($('#comments').scrollTop() === 0)
            $("#comments").children(':first').hide().show(600);
          else
            $('#comments').animate({
              scrollTop: "0"
            }, 800, () => {
              $("#comments").children(':first').hide().show(600);
            });
          //incrementa di 1 il counter dei commenti
          document.getElementById('commentCounter' + postId).innerHTML++;

        } else if (this.readyState === 4 && this.status === 400) {
          $('#status').text(JSON.parse(this.responseText).text);
          $("#status").trigger('open');

        } else if (this.readyState === 4 && this.status === 401) {
          $('#loginNeededSection').trigger('open');
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
      $('#status').text(validation.text);
      $("#status").trigger('open');
    }
  });
});
