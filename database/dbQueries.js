var mongoose = require('mongoose');
var userModel = require('../models/userModel');
var postModel = require('../models/postModel');

async function findUserByUsernamePassword(username, password) {
  var output = await userModel.findOne({
    username: username,
    password: password
  });
  return output;
}

async function findUserByUsername(username) {
  var output = await userModel.findOne({
    username: username
  });
  return output;
}

async function findUserById(id) {
  var output = await userModel.findById(id);
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
  }).populate({
    path: 'likes',
    select: 'username'
  });
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

async function patchPostLikesByUserId(postId, userId) {
  var likes = await findPostLikes(postId);
  if (likes.includes(userId)) {
    likes = likes.filter(likeUserId => likeUserId.toString() != userId.toString());
  } else {
    likes.push(userId);
  }
  await postModel.updateOne({
    _id: postId
  }, {
    likes: likes
  });
}

async function findPostById(id) {
  var output = await postModel.findById(id);
  return output;
}

async function findPostLikes(postId) {
  var post = await postModel.findById(postId, 'likes');
  return post.likes;
}

async function findPostComments(postId) {
  var post = await postModel.findById(postId, 'comments').populate({
    path: 'comments', // con comments.x si può popolare un commento specifico
    populate: {
      path: 'author'
    }
  });
  return post.comments;
}

async function addComment(postId, userId, text) {
  const date = new Date();
  var newCommentDate = date.toLocaleString();
  var output = await postModel.findByIdAndUpdate(
    postId, {
      $push: {
        "comments": {
          author: userId,
          text: text,
          date: newCommentDate
        }
      }
    }, {
      safe: true,
      upsert: true,
      new: true
    }).populate({
    path: 'comments', // con comments.x si può popolare un commento specifico
    populate: {
      path: 'author'
    }
  });
  return output;
}

module.exports = {
  addUser,
  findUserById,
  findUserByUsername,
  findUserByUsernamePassword,
  addPost,
  patchPostLikesByUserId,
  findAllPosts,
  findPostById,
  findPostLikes,
  findPostComments,
  addComment
};
