var dbQuerys = require('./database/dbQueries');

async function validateSignin(name, surname, email, birthday, username, password) {
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

  var user = await dbQuerys.findUserByUsername(username);

  if (!namePattern.test(name)) {
    output.text = "nome non idoneo, verifica i requisiti...";
  } else if (!namePattern.test(surname)) {
    output.text = "cognome non idoneo, verifica i requisiti...";
  } else if (!emailPattern.test(email)) {
    output.text = "email non idonea, verifica i requisiti...";
  } else if (!datePattern.test(birthday)) {
    output.text = "data non idonea...";
  } else if (user) {
    output.text = "username già utilizzato da un altro utente...";
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

module.exports = {
  validateSignin,
  validateNewPost,
  validateNewComment,
};
