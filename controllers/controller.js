var dbQuerys = require('../database/dbQuerys');
var inputValidation = require('../inputValidation');

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
module.exports = function(app) {

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
    var user = await dbQuerys.findUserByUsernamePassword(reqUsername, reqPassword);
    if (user) {
      res.cookie('sessionId', user._id.toString()).sendStatus(200);
      console.log('#L\'utente con id: ' + user._id.toString() + ' e username: ' + user.username + ' si è loggato');
    } else {
      res.sendStatus(404);
    }
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
    var validation = await inputValidation.validateSignin(reqName, reqSurname, reqEmail, reqBirthday, reqUsername, reqPassword);

    if (validation.result) {
      var signedInUser = await dbQuerys.addUser(reqName, reqSurname, reqEmail, reqBirthday, reqUsername, reqPassword);
      console.log('Nuovo utente con username: ' + signedInUser.username + ' e id: ' + signedInUser._id + ' registrato');
      console.log('#L\'utente con id: ' + signedInUser._id + ' e username: ' + signedInUser.username + ' si è loggato');
      res.cookie('sessionId', signedInUser._id).sendStatus(201);
    } else {
      res.status(400).json(validation);
    }

  });

  app.get('/microblog/blog', async function(req, res) {
    var sessionId = req.cookies.sessionId;
    var user;
    //la query accetta stringhe da minimo 12 byte
    if (Buffer.byteLength(sessionId, 'utf8') >= 12) {
      user = await dbQuerys.findUserById(sessionId);
    }
    //cerca un utente che abbia quell'id
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
      var validation = inputValidation.validateNewPost(newPostTitle, newPostText);

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
      var validation = inputValidation.validateNewComment(newCommentText);

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
