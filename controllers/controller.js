//database
var users = [{
  id: 1,
  name: 'admin',
  surname: 'admin',
  email: 'admin@admin.com',
  dateOfBirth: 'none',
  username: 'admin',
  password: 'admin'
}];
var posts = [{
  id: 1,
  author: 'admin',
  title: 'Ho fame',
  text: 'Ho molta fame, cosa mi consigliate di mangiare?',
  date: '17/08/2021',
  likes: 34,
  comments: [{
    author: 'admin',
    text: 'nessuno risponde?',
    date: '17/08/2021'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '17/08/2021'
  }]
}, {
  id: 2,
  author: 'admin',
  title: 'Ho sete',
  text: 'Ho molta sete, cosa mi consigliate di bere?',
  date: '15/08/2021',
  likes: 16,
  comments: [{
    author: 'admin',
    text: 'nessuno risponde?',
    date: '17/08/2021'
  }, {
    author: 'admin',
    text: 'mi sa di no...',
    date: '17/08/2021'
  }]
}]

module.exports = function(app) {

  app.get('/microblog', function(req, res) {
    res.render('index');
  });
  app.get('/users', function(req, res) {
    res.send(users);
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
      console.log('utente trovato');
      res.cookie('sessionId', user.id).sendStatus(200);
    } else {
      console.log('utente non trovato');
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

    console.log('sessionId nel cookie: ' + sessionId);

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
    console.log(newUser);
    users.push(newUser);

    res.cookie('sessionId', id).sendStatus(201);

  });

};