var mongoose = require('mongoose');

module.exports = function(app) {
  mongoose.connection.on('error', function(err) {
    console.log('<- Errore del database: \n' + err);
  });

  mongoose.connection.on('connected', function() {
    console.log('<- Connessione al database stabilita!');
  });

  mongoose.connection.on('connecting', function() {
    console.log('<- Connessione al database in corso...');
  });

  mongoose.connection.on('disconnected', function() {
    console.log('<- Connessione al database persa!');
  });

  mongoose.connect('mongodb://127.0.0.1:27017/microblog',
    function(err) {
      if (err) console.log("<- Impossibile connettersi al database: " + err);
    });
}
