var mongoose = require('mongoose');
var controller = require('../controllers/controller');
var server;
module.exports = function(app) {

  mongoose.connection.on('error', function(err) {
    console.log('<- Errore del database: \n' + err);
  });

  mongoose.connection.on('connected', function() {
    console.log('<- Connessione al database stabilita!');
    //porta di ascolto
    server = app.listen(3000);
    console.log('#Il server è in ascolto sulla porta 3000...');
  });

  mongoose.connection.on('connecting', function() {
    console.log('<- Connessione al database in corso...');
  });

  mongoose.connection.on('disconnected', function() {
    if (server) {
      console.log('<- Connessione al database persa!');
      server.close();
      console.log("#Il server non è piu' in ascolto...");
    }
  });

  mongoose.connect('mongodb://127.0.0.1:27017/microblog',
    function(err) {
      if (err) console.log("<- Impossibile connettersi al database: " + err);
    });

  //per fare in modo che controller non venga avviato ad ogni riconnessione al db
  mongoose.connection.once('connected', function() {
    //avvia controller
    controller(app);
  });
};
