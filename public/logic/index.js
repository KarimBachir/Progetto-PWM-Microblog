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

      } else if (this.readyState === 4 && this.status === 404) {

        document.getElementById("status").innerHTML =
          'username o password non validi!';

      }
    };
    var name = $('#name');
    var surname = $('#surname');
    var email = $('#email');
    var dateOfBirth = $('#dateOfBirth');
    var username = $('#signinUsername');
    var password = $('#signinPassword');
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
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setPage1Width(width) {
  $("#page1").css('width', width);
}

function checkPage2Content() {
  if ($("#login").css('display') === 'none' && $("#signin").css('display') === 'none') {
    document.getElementById("status").innerHTML = '';
    setPage1Width('100%');
  }
}

async function triggerLoginForm() {
  if ($("#page1").css('width') === $(window).width() + 'px') {
    setPage1Width('50%');
    await sleep(600);
  }
  $("#signin").fadeOut('fast', function() {
    $("#login").fadeToggle('fast', function() {
      checkPage2Content()
    });
  });
}

async function triggerSigninForm() {
  if ($("#page1").css('width') === $(window).width() + 'px') {
    setPage1Width('50%');
    await sleep(600);
  }
  $("#login").fadeOut('fast', function() {
    $("#signin").fadeToggle('fast', function() {
      checkPage2Content()
    });
  });
}