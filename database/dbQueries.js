var mongoose = require('mongoose');
var userModel = require('../models/userModel');
var postModel = require('../models/postModel');

async function findUserByUsernamePassword(username, password) {
  var output = await userModel.findOne({
    username: username,
    password: password
  }).exec();
  return output;
}

async function findUserByUsername(username) {
  var output = await userModel.findOne({
    username: username
  }).exec();
  return output;
}

async function findUserById(id) {
  var output = await userModel.findById(id).exec();
  return output;
}

async function addUser(name, surname, email, birthday, username, password) {
  var newUser = new userModel({
    name: name,
    surname: surname,
    email: email,
    birthday: birthday,
    username: username,
    password: password
  });
  var output = await newUser.save();
  return output;
}

async function findAllPosts() {
  var output = await postModel.find().populate({
    path: 'author',
    select: 'username'
  }).exec();
  return output;
}

async function addPost(authorId, title, text, date) {
  var newPost = new postModel({
    author: authorId,
    title: title,
    text: text,
    date: date //gg/m/aaaa
  });
  var output = await newPost.save();
  await output.populate({
    path: 'author',
    select: 'username'
  });
  return output;
}

module.exports = {
  addUser,
  findUserById,
  findUserByUsername,
  findUserByUsernamePassword,
  addPost,
  findAllPosts
};
