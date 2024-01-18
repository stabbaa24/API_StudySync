const mongoose = require('mongoose');
let Schema = mongoose.Schema;

//https://mongoosejs.com/docs/schematypes.html
let UserSchema = new Schema({
  login: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'], required: true }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;