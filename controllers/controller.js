var mongoose = require('mongoose');
var userModel = require('../models/userModel');
var postModel = require('../models/postModel');
var posts = [{
  id: 1,
  author: 'admin',
  title: 'Ho fame',
  text: 'Ho molta fame, cosa mi consigliate di mangiare?',
  date: '19/8/2021, 16:12:21',
  likes: ['admin', 'jellylama'],
  comments: [{
    author: 'admin',
    text: 'nessuno risponde?',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '19/8/2021, 16:12:21'
  }]
}, {
  id: 2,
  author: 'admin',
  title: 'Ho sete',
  text: 'Ho molta sete, cosa mi consigliate di bere?',
  date: '19/8/2021, 16:12:21',
  likes: ['jellylama'],
  comments: [{
    author: 'admin',
    text: 'nessuno risponde?',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '19/8/2021, 16:12:21'
  }]
}, {
  id: 3,
  author: 'admin',
  title: 'Ho sete',
  text: 'Ho molta sete, cosa mi consigliate di bere?',
  date: '19/8/2021, 16:12:21',
  likes: ['jellylama'],
  comments: [{
    author: 'admin',
    text: 'nessuno risponde?',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '19/8/2021, 16:12:21'
  }]
}, {
  id: 4,
  author: 'admin',
  title: 'Ho sete',
  text: 'Ho molta sete, cosa mi consigliate di bere?',
  date: '19/8/2021, 16:12:21',
  likes: ['jellylama'],
  comments: [{
    author: 'admin',
    text: 'nessuno risponde?',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '19/8/2021, 16:12:21'
  }]
}, {
  id: 5,
  author: 'admin',
  title: 'Ho sete',
  text: 'Ho molta sete, cosa mi consigliate di bere?',
  date: '19/8/2021, 16:12:21',
  likes: ['jellylama'],
  comments: [{
    author: 'admin',
    text: 'nessuno risponde?',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'nessuno risponde?',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'nessuno risponde?',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'nessuno risponde?',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'nessuno risponde?',
    date: '19/8/2021, 16:12:21'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '19/8/2021, 16:12:21'
  }]
}];
//connessione al database
mongoose.connect('mongodb://127.0.0.1:27017/microblog');

module.exports = function(app) {

  async function findUserByUsernamePassword(username, password) {
    var output;
    await userModel.findOne({
      username: username,
      password: password
    }).exec().then(function(user) {
      output = user.toObject();
    });
    return output;
  }

  async function findUserByUsername(username) {
    var output;
    await userModel.findOne({
      username: username
    }).exec().then(function(user) {
      output = user.toObject();
    });
    return output;
  }

  async function findUserById(id) {
    var output;
    await userModel.findById(id).exec().then(function(user) {
      output = user.toObject();
    });
    return output;
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

    var user = findUserByUsername(username);

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

  app.get('/microblog', function(req, res) {
    var date = new Date();
    res.render('index', {
      status: '',
      today: date.toISOString().substring(0, 10) //serve per limitare il campo birthday nel form di signin
    });
  });

  app.get('/microblog/guest', function(req, res) {
    res.clearCookie('sessionId');
    res.status(200).render('blog', {
      status: '',
      username: 'Guest',
      posts: posts
    });
  });

  app.post('/microblog/login', async function(req, res) {
    var reqUsername = req.body.username;
    var reqPassword = req.body.password;
    var user = await findUserByUsernamePassword(reqUsername, reqPassword);
    if (user) {
      res.cookie('sessionId', user._id).sendStatus(200);
      console.log('L\'utente on id: ' + user._id + ' e username: ' + user.username + ' si è loggato');
    } else {
      res.sendStatus(404);
    }
    //var user = users.find(user => user.username === reqUsername && user.password === reqPassword);
  });

  app.get('/microblog/logout', function(req, res) {
    res.clearCookie('sessionId');
    res.status(200).redirect('/microblog');
  });

  app.post('/microblog/signin', async function(req, res) {
    var reqName = req.body.name;
    var reqSurname = req.body.surname;
    var reqEmail = req.body.email;
    var reqBirthday = req.body.birthday;
    var reqUsername = req.body.username;
    var reqPassword = req.body.password;
    var validation = validateSignin(reqName, reqSurname, reqEmail, reqBirthday, reqUsername, reqPassword);
    if (validation.result) {

      var newUser = new userModel({
        name: reqName,
        surname: reqSurname,
        email: reqEmail,
        birthday: reqBirthday,
        username: reqUsername,
        password: reqPassword
      });
      await newUser.save();
      console.log('Nuovo utente con username: ' + reqUsername + ' registrato');
      res.cookie('sessionId', signedInUser._id).sendStatus(201);
    } else {
      res.status(400).json(validation);
    }

  });

  app.get('/microblog/blog', function(req, res) {
    var sessionId = req.cookies.sessionId;
    //cerca un utente che abbia quell'id
    var user = findUserById(sessionId);
    if (user === undefined || user === null) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    } else {
      res.status(200).render('blog', {
        status: '',
        username: user.username,
        posts: posts
      });
    }
  });

  //riceve un nuovo post, lo inserisce nel db e lo invia al client
  app.post('/microblog/posts', function(req, res) {
    var newPostAuthor = users.find(user => user.id.toString() === req.cookies.sessionId);
    if (newPostAuthor === undefined) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    } else {

      var newPostTitle = req.body.title;
      var newPostText = req.body.text;
      var validation = validateNewPost(newPostTitle, newPostText);

      if (validation.result) {
        var newPostAuthorUsername = newPostAuthor.username;
        var newPostId = posts.length + 1;
        const date = new Date();
        var newPostFormattedDate = date.toLocaleString();
        var newPost = {
          id: newPostId,
          author: newPostAuthorUsername,
          title: newPostTitle,
          text: newPostText,
          date: newPostFormattedDate,
          likes: [],
          comments: []
        };
        posts.push(newPost);
        res.status(201).send(newPost);
      } else {
        res.status(400).json(validation);
      }
    }

  });

  //aggiunge o toglie un like
  app.patch('/microblog/posts/:id/likes', function(req, res) {
    var user = users.find(user => user.id.toString() === req.cookies.sessionId);
    if (user === undefined) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    } else {
      var username = user.username;
      var postId = req.params.id;
      var post = posts.find(post => post.id.toString() === postId);

      if (post.likes.includes(username)) {
        post.likes = post.likes.filter(likeUsername => likeUsername != username);
      } else {
        post.likes.push(username);
      }

      res.sendStatus(204);
    }
  });

  //restituisce la pagina con i commenti di un post dato il suo id
  app.get('/microblog/posts/:id/comments', function(req, res) {
    var postId = req.params.id;
    var post = posts.find(post => post.id.toString() === postId);
    var comments = post.comments;

    res.render('comments', {
      comments: comments
    });

  });

  //aggiunge un nuovo commento relativo ad un post dato il suo id
  app.post('/microblog/posts/:id/comments', function(req, res) {
    var newCommentAuthor = users.find(user => user.id.toString() === req.cookies.sessionId);
    if (newCommentAuthor === undefined) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    } else {
      var newCommentText = req.body.text;
      var validation = validateNewComment(newCommentText);

      if (validation.result) {
        var postId = req.params.id;
        var post = posts.find(post => post.id.toString() === postId);

        var newCommentAuthorUsername = newCommentAuthor.username;
        const date = new Date();
        var newCommentDate = date.toLocaleString();
        var newComment = {
          author: newCommentAuthorUsername,
          text: newCommentText,
          date: newCommentDate
        };

        post.comments.push(newComment);

        res.set('Content-Type', 'text/plain');
        res.status(201).send("<div class=\"comment-container\">" +
          "<div class=\"comment-item commentAuthor\">" +
          newCommentAuthorUsername +
          "</div>" +
          "<div class=\"comment-item commentText\">" +
          newCommentText +
          "</div>" +
          "<div class=\"comment-item commentDate\">" +
          newCommentDate +
          "</div>" +
          "</div>");
      } else {
        res.status(400).json(validation);
      }
    }
  });

};
