onmessage = function(e) {
  checkServerStatus();
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkServerStatus() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = async function(response) {
    if (this.readyState === 4) {
      if (this.status === 200) {
        console.log('SERVER/WEBSITE IS UP');
        postMessage(null);
      } else {
        console.log('SERVER/WEBSITE IS DOWN');
        await sleep(3000);
        xhttp.open("GET", 'http://127.0.0.1:3000/microblog');
        xhttp.send();
      }
    }
  };
  xhttp.open("GET", 'http://127.0.0.1:3000/microblog');
  xhttp.send();
}
