$(document).ready(function() {
  $('#loginButton').on('click', function() {

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
      if (this.readyState === 4 && this.status === 200) {

        location.assign('/microblog/blog');

      } else if (this.readyState === 4 && this.status === 404) {

        document.getElementById("loginStatus").innerHTML =
          'username o password non validi!';

      }
    };

    var username = $('#loginUsername');
    var password = $('#loginPassword');
    var user = {
      username: username.val(),
      password: password.val()
    };

    var address = "/microblog/login";
    xhttp.open("POST", address, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));

  });

});