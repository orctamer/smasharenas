const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  twitchId: { type: Number, required: true },
  displayName: {type: String, required: true},
  profileImage: {type: String, required: true}
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);