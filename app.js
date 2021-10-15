var express = require('express');
var mongoose = require('mongoose');
var controller = require('./controllers/controller');
var handleDB = require('./database/handleDB');
var cookieParser = require('cookie-parser');
var app = express();

//imposta ejs come motore di rendering
app.set('view engine', 'ejs');

//rende accessibile la cartella public
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//avvia la gestione e la connessione al database
handleDB();

//per fare in modo che controller non venga avviato ad ogni riconnessione al db
mongoose.connection.once('connected', function() {
  //avvia controller
  controller(app);

  //porta di ascolto
  app.listen(3000);
  console.log('#Il server è in ascolto sulla porta 3000...');
});
