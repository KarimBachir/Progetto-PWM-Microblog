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
}]

module.exports = function(app) {

  app.get('/microblog', function(req, res) {
    res.render('index');
  });

  app.get('/microblog/login', function(req, res) {
    var sessionId = req.cookies.sessionId;
    var user = users.find(user => user.id.toString() === sessionId);

    if (user === undefined) {
      res.render('login', {
        status: ''
      });
    } else {
      res.status(200).redirect('/microblog/blog');
    }

  });

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
    res.render('login', {
      status: ''
    });

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

  app.get('/microblog/signin', function(req, res) {
    res.render('signin', {
      status: ''
    });
  });

  app.post('/microblog/signin', function(req, res) {
    var reqName = req.body.name;
    var reqSurname = req.body.surname;
    var reqEmail = req.body.email;
    var reqDateOfBirth = req.body.dateOfBirth;
    var reqUsername = req.body.username;
    var reqPassword = req.body.password;
    var id = users.length + 1;
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

  });

  app.post('/microblog/posts', function(req, res) {
    var newPostId = posts.length + 1;
    var newPostTitle = req.body.title;
    var newPostText = req.body.text;
    var newPostAuthor = users.find(user => user.id.toString() === req.cookies.sessionId);
    var newPostAuthorUsername = newPostAuthor.username;
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

  });

  app.patch('/microblog/posts/:id/likes', function(req, res) {
    var postId = req.params.id;
    var post = posts.find(post => post.id.toString() === postId);
    var username = (users.find(user => user.id.toString() === req.cookies.sessionId)).username;

    if (post.likes.includes(username)) {
      post.likes = post.likes.filter(likeUsername => likeUsername != username);
    } else {
      post.likes.push(username);
    }

    res.sendStatus(204);

  });

};