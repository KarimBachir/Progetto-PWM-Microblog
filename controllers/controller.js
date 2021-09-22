//database
var users = [{
  id: 1,
  name: 'admin',
  surname: 'admin',
  email: 'admin@admin.com',
  dateOfBirth: 'none',
  username: 'admin',
  password: 'admin'
}, {
  id: 2,
  name: 'jellylama',
  surname: 'jellylama',
  email: 'jellylama@jellylama.com',
  dateOfBirth: '28/07/2001',
  username: 'jellylama',
  password: 'jellylama'
}];
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
}]

module.exports = function(app) {

  app.get('/microblog', function(req, res) {
    res.render('index', {
      status: ''
    });
  });

  app.get('/microblog/guest', function(req, res) {
    res.clearCookie('sessionId');
    res.status(200).render('blog', {
      username: 'Guest',
      posts: posts
    });
  });

  function validateSignin(name, surname, email, dateOfBirth, username, password) {
    //almeno 5 e massimo 10 caratteri, numeri o simboli
    let usernamePattern = new RegExp(/^[\w#\?!@\$%\^&\*-]{5,16}$/);
    //bisogna verificare che non ci siano spazi
    /*
    minimo 8 e massimo 16 caratteri
    almeno una maiuscola
    almeno una minuscola
    almeno un numero
    almeno un simbolo tra #?!@$%^&*-
    */
    let passwordPattern = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#\?!@\$%\^&\*-]).{8,16}$/);
    let spacePattern = new RegExp(/[\s]+/);
    if (!usernamePattern.test(username)) {
      console.log('username sbagliato');
      return false;
    } else if (!passwordPattern.test(password)) {
      console.log('password sbagliata');
      return false;
    } else if (passwordPattern.test(password) && spacePattern.test(password)) {
      console.log('password con spazi');
      return false;
    } else {
      return true;
    }
  };

  app.post('/microblog/login', function(req, res) {
    var reqUsername = req.body.username;
    var reqPassword = req.body.password;
    var user = users.find(user => user.username === reqUsername && user.password === reqPassword);

    if (user) {
      res.cookie('sessionId', user.id).sendStatus(200);
    } else {
      res.sendStatus(404);
    }

  });

  app.get('/microblog/logout', function(req, res) {
    res.clearCookie('sessionId');
    res.status(200).redirect('/microblog');
  });

  app.post('/microblog/signin', function(req, res) {
    var reqName = req.body.name;
    var reqSurname = req.body.surname;
    var reqEmail = req.body.email;
    var reqDateOfBirth = req.body.dateOfBirth;
    var reqUsername = req.body.username;
    var reqPassword = req.body.password;
    var id = users.length + 1;
    if (validateSignin(reqName, reqSurname, reqEmail, reqDateOfBirth, reqUsername, reqPassword)) {

      var newUser = {
        id: id,
        name: reqName,
        surname: reqSurname,
        email: reqEmail,
        dateOfBirth: reqDateOfBirth,
        username: reqUsername,
        password: reqPassword
      };
      users.push(newUser);
      res.cookie('sessionId', id).sendStatus(201);
    } else {
      res.sendStatus(400);
    }

  });

  app.get('/microblog/blog', function(req, res) {
    var sessionId = req.cookies.sessionId;
    //cerca un utente che abbia quell'id
    var user = users.find(user => user.id.toString() === sessionId);

    if (user === undefined) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    } else {
      res.status(200).render('blog', {
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

      var newPostAuthorUsername = newPostAuthor.username;
      var newPostId = posts.length + 1;
      var newPostTitle = req.body.title;
      var newPostText = req.body.text;
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
      var postId = req.params.id;
      var post = posts.find(post => post.id.toString() === postId);

      var newCommentAuthorUsername = newCommentAuthor.username;
      var newCommentText = req.body.text;
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
    }
  });

};
