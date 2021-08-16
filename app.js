var express = require('express');
var controller = require('./controllers/controller');
var cookieParser = require('cookie-parser');

var app = express();
//imposta ejs come motore di rendering
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
//rende accessibile la cartella public
app.use('/public', express.static('public'));

//avvia controller
controller(app);

//porta di ascolto
app.listen(3000);
console.log('Il server è in ascolto sulla porta 3000...');