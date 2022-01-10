var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  birthday: String,
  username: String,
  password: String
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
