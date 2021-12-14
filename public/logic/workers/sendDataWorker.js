onmessage = function(e) {
  sendData(e.data);
}

async function sendData(likes) {
  var likes = likes;
  var i = likes.length - 1;
  var postId;
  //console.log('lunghezza: ' + likes.length);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(response) {
    if (this.readyState === 4) {
      if (this.status === 204) {
        //console.log('status ' + this.status);
        //console.log(i + ' rimosso ' + likes[i].postId);
        likes.splice(i, 1);
        i--;
        if (i - 1 == -2) {
          //console.log('fine');
          postMessage([1, likes]);
        } else {
          postId = likes[i].postId;
          //console.log('id del post inviato ' + postId);
          xhttp.open("PATCH", '/microblog/posts/' + postId + '/likes');
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        }
      } else if (this.status === 400 || this.status === 401) {
        console.log('status ' + this.status);
        i--;
        if (i - 1 == -2) {
          //console.log('fine');
          postMessage([1, likes]);
        } else {
          postId = likes[i].postId;
          //console.log('id del post inviato ' + postId);
          xhttp.open("PATCH", '/microblog/posts/' + postId + '/likes');
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        }
      } else {
        //console.log('errore');
        postMessage([0, likes]);
      }
    }
  };
  postId = likes[i].postId;
  //console.log('id del post inviato ' + postId);
  xhttp.open("PATCH", '/microblog/posts/' + postId + '/likes');
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}
