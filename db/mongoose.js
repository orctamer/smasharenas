const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/smasharenas', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('error', (e) => {
  console.log(e.toString());
  console.log(e.stack.toString());
  process.exit(999);
})

db.once('open', async function() {
  console.info('DB Connected Successfully');
})

module.exports = mongoose;