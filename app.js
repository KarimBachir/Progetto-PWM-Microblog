var express = require('express');
var mongoose = require('mongoose');
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
handleDB(app);
