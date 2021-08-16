var users = [{
        id: 1,
        username: 'admin',
        password: 'admin'
    }, {
        id: 2,
        username: 'karim',
        password: 'karim'
    }];

module.exports = function (app) {

    app.get('/microblog', function (req, res) {
        res.render('index');
    });

    app.get('/microblog/login', function (req, res) {
        var sessionId = req.cookies.sessionId;
        var user = users.find(user => user.id.toString() === sessionId);
        if (user === undefined) {
            res.render('login', {
                status: ''
            });
        } else {
            res.status(200).render('blog', {
                username: user.username
            });
        }

    });
    app.get('/microblog/logout', function (req, res) {
        res.clearCookie('sessionId');
        res.render('login', {
                status: ''
            });

    });
    app.post('/microblog/login', function (req, res) {
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
    app.get('/microblog/blog', function (req, res) {
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
                username: user.username
            });
        }
    });

};