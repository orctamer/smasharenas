const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  twitchId: { type: String, required: true },
  displayName: {type: String, required: true},
  profileImage: {type: String, required: true}
});

const User = mongoose.model('user', userSchema)

module.exports = User