var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  title: String,
  text: String,
  date: String, //gg/m/aaaa
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: {}
  }],
  comments: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    text: String,
    date: String
  }],
  default: {}
});

const PostModel = mongoose.model('post', postSchema);

module.exports = PostModel;
