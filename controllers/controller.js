var dbQueries = require('../database/dbQueries');
var inputValidation = require('../inputValidation');
var ejs = require('ejs');

//connessione al database
module.exports = function(app) {

  app.get('/microblog', function(req, res) {
    var date = new Date();
    res.render('index', {
      today: date.toISOString().substring(0, 10) //serve per limitare il campo birthday nel form di signin
    });
  });

  app.get('/microblog/guest', async function(req, res) {
    res.clearCookie('sessionId');
    res.redirect('/microblog/blog');
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
    var user, posts;
    //guest
    if (sessionId == undefined) {
      posts = await dbQueries.findAllPosts();
      res.status(200).render('blog', {
        username: 'Guest',
        posts: posts
      });
    } else {
      //cerca un utente che abbia quell'id
      try {
        user = await dbQueries.findUserById(sessionId);
        if (user === undefined || user === null) {
          res.status(401).render('error', {
            statusCode: '401',
            message: "Devi effettuare l'accesso per accedere a questa pagina!"
          });
        } else {
          posts = await dbQueries.findAllPosts();
          res.status(200).render('blog', {
            username: user.username,
            posts: posts
          });
        }
      } catch (error) {
        res.status(401).render('error', {
          statusCode: '401',
          message: "Devi effettuare l'accesso per accedere a questa pagina!"
        });
      }
    }
  });

  //riceve un nuovo post, lo inserisce nel db e lo invia al client
  app.post('/microblog/posts', async function(req, res) {
    var sessionId = req.cookies.sessionId;
    var newPostAuthor;
    try {
      //cerca un utente che abbia quell'id
      newPostAuthor = await dbQueries.findUserById(sessionId);

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

          //renderizza il nuovo post e lo invia al client
          ejs.renderFile('./views/templates/postTemplate.ejs', {
            title: newPost.title,
            text: newPost.text,
            author: newPost.author.username,
            date: newPost.date,
            postId: newPost._id
          }, function(err, data) {
            res.status(201).send(data);
          });
        } else {
          res.status(400).json(validation);
        }
      }

    } catch (e) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    }

  });

  //aggiunge o toglie un like
  app.patch('/microblog/posts/:id/likes', async function(req, res) {
    var sessionId = req.cookies.sessionId;
    var postId = req.params.id;
    var user;
    try {
      //cerca un utente che abbia quell'id
      user = await dbQueries.findUserById(sessionId);

      //id utente valido ma insesistente
      if (user === undefined || user === null) {
        res.status(401).render('error', {
          statusCode: '401',
          message: "Devi effettuare l'accesso per accedere a questa pagina!"
        });
      } else {
        var userId = user._id;
        try {
          var result = await dbQueries.patchPostLikesByUserId(postId, userId);
          if (result) {
            res.sendStatus(204);
          } else { //id del post valido ma non esistente
            res.sendStatus(400);
          }
        } catch (error) { //id del post non valido
          res.sendStatus(400);
        }
      }

    } catch (e) { //id utente non valido
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    }
  });

  //restituisce il template con i commenti di un post dato il suo id
  app.get('/microblog/posts/:id/comments', async function(req, res) {
    try {
      var comments = await dbQueries.findPostComments(req.params.id);
      if (comments === undefined || comments === null) {
        res.sendStatus(400);
      } else {
        ejs.renderFile('./views/templates/commentsTemplate.ejs', {
          comments: comments
        }, function(err, data) {
          res.status(200).send(data);
        });
      }

    } catch (e) {
      res.sendStatus(400);
    }
  });

  //aggiunge un nuovo commento relativo ad un post dato il suo id
  app.post('/microblog/posts/:id/comments', async function(req, res) {
    var sessionId = req.cookies.sessionId;
    var newCommentAuthor;
    try {
      //cerca un utente che abbia quell'id
      newCommentAuthor = await dbQueries.findUserById(sessionId);

      if (newCommentAuthor === undefined || newCommentAuthor === null) {
        res.status(401).render('error', {
          statusCode: '401',
          message: "Devi effettuare l'accesso per accedere a questa pagina!"
        });
      } else {
        var newCommentText = req.body.text;
        var validation = inputValidation.validateNewComment(newCommentText);

        if (validation.result) {
          try {
            var updatedPost = await dbQueries.addComment(req.params.id, newCommentAuthor._id, newCommentText);

            //renderizza il nuovo commento e lo invia al client
            ejs.renderFile('./views/templates/commentTemplate.ejs', {
              author: updatedPost.comments[updatedPost.comments.length - 1].author.username,
              text: updatedPost.comments[updatedPost.comments.length - 1].text,
              date: updatedPost.comments[updatedPost.comments.length - 1].date,
            }, function(err, data) {
              res.status(201).send(data);
            });
          } catch (e) {
            validation.text = 'errore';
            res.status(400).json(validation);
          }
        } else {
          res.status(400).json(validation);
        }
      }
    } catch (e) {
      res.status(401).render('error', {
        statusCode: '401',
        message: "Devi effettuare l'accesso per accedere a questa pagina!"
      });
    }
  });

};
