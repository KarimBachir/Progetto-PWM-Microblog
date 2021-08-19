$(document).ready(function() {
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
    xhttp.open("POST", address, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));

  });
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
    xhttp.open("POST", address, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));

  });
});

function openNav() {
  document.getElementById("myNav").style.height = "100%";
  //fa in modo che non si veda la scrollbar mentre si apre la tendina
  setTimeout(function() {
    document.getElementById("myNav").style.overflow = "auto"
  }, 500);
}

function closeNav() {
  document.getElementById("myNav").style.overflow = "hidden";
  document.getElementById("myNav").style.height = "0%";
}