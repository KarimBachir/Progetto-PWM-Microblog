var dbQueries = require('../database/dbQueries');
var inputValidation = require('../inputValidation');

//connessione al database
module.exports = function(app) {

  app.get('/microblog', function(req, res) {
    var date = new Date();
    res.render('index', {
      status: '',
      today: date.toISOString().substring(0, 10) //serve per limitare il campo birthday nel form di signin
    });
  });

  app.get('/microblog/guest', async function(req, res) {
    res.clearCookie('sessionId');
    var posts = await dbQueries.findAllPosts();
    res.status(200).render('blog', {
      status: '',
      username: 'Guest',
      posts: posts
    });
  });

  app.post('/microblog/login', async function(req, res) {
    var reqUsername = req.body.username;
    var reqPassword = req.body.password;
    var user = await dbQueries.findUserByUsernamePassword(reqUsername, reqPassword);

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
      var signedInUser = await dbQueries.addUser(reqName, reqSurname, reqEmail, reqBirthday, reqUsername, reqPassword);
      console.log('Nuovo utente con username: ' + signedInUser.username + ' e id: ' + signedInUser._id.toString() + ' registrato');
      console.log('#L\'utente con id: ' + signedInUser._id.toString() + ' e username: ' + signedInUser.username + ' si è loggato');
      res.cookie('sessionId', signedInUser._id.toString()).sendStatus(201);
    } else {
      res.status(400).json(validation);
    }

  });

  app.get('/microblog/blog', async function(req, res) {
    var sessionId = req.cookies.sessionId;
    var user;

    if (inputValidation.validateSessionId(sessionId).result) {
      //cerca un utente che abbia quell'id
      user = await dbQueries.findUserById(sessionId);
    }

    if (user === undefined || user === null) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    } else {
      var posts = await dbQueries.findAllPosts();
      res.status(200).render('blog', {
        status: '',
        username: user.username,
        posts: posts
      });
    }
  });

  //riceve un nuovo post, lo inserisce nel db e lo invia al client
  app.post('/microblog/posts', async function(req, res) {
    var sessionId = req.cookies.sessionId;
    var newPostAuthor;

    if (inputValidation.validateSessionId(sessionId).result) {
      //cerca un utente che abbia quell'id
      newPostAuthor = await dbQueries.findUserById(req.cookies.sessionId);
    }

    if (newPostAuthor === undefined || newPostAuthor === null) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    } else {

      var newPostTitle = req.body.title;
      var newPostText = req.body.text;
      var validation = inputValidation.validateNewPost(newPostTitle, newPostText);

      if (validation.result) {
        var newPostAuthorId = newPostAuthor._id;
        const date = new Date();
        var newPostFormattedDate = date.toLocaleString();
        var newPost = await dbQueries.addPost(newPostAuthorId, newPostTitle, newPostText, newPostFormattedDate);
        res.status(201).send(newPost);
      } else {
        res.status(400).json(validation);
      }
    }

  });

  //aggiunge o toglie un like
  app.patch('/microblog/posts/:id/likes', async function(req, res) {
    var sessionId = req.cookies.sessionId;
    var user;

    if (inputValidation.validateSessionId(sessionId).result) {
      //cerca un utente che abbia quell'id
      user = await dbQueries.findUserById(req.cookies.sessionId);
    }

    if (user === undefined || user === null) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    } else {
      var userId = user._id;
      var postId = req.params.id;
      await dbQueries.patchPostLikesByUserId(postId, userId);

      res.sendStatus(204);
    }
  });

  //restituisce la pagina con i commenti di un post dato il suo id
  app.get('/microblog/posts/:id/comments', async function(req, res) {
    var comments = await dbQueries.findPostComments(req.params.id);

    res.render('comments', {
      comments: comments
    });

  });

  //aggiunge un nuovo commento relativo ad un post dato il suo id
  app.post('/microblog/posts/:id/comments', async function(req, res) {
    var sessionId = req.cookies.sessionId;
    var newCommentAuthor;

    if (inputValidation.validateSessionId(sessionId).result) {
      //cerca un utente che abbia quell'id
      newCommentAuthor = await dbQueries.findUserById(req.cookies.sessionId);
    }

    if (newCommentAuthor === undefined || newCommentAuthor === null) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    } else {
      var newCommentText = req.body.text;
      var validation = inputValidation.validateNewComment(newCommentText);

      if (validation.result) {
        var updatedPost = await dbQueries.addComment(req.params.id, newCommentAuthor._id, newCommentText);

        res.set('Content-Type', 'text/plain');
        res.status(201).send("<div class=\"comment-container\">" +
          "<div class=\"comment-item commentAuthor\">" +
          updatedPost.comments[updatedPost.comments.length - 1].author.username +
          "</div>" +
          "<div class=\"comment-item commentText\">" +
          updatedPost.comments[updatedPost.comments.length - 1].text +
          "</div>" +
          "<div class=\"comment-item commentDate\">" +
          updatedPost.comments[updatedPost.comments.length - 1].date +
          "</div>" +
          "</div>");
      } else {
        res.status(400).json(validation);
      }
    }
  });

};
