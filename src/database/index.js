const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest', { useNewUrlParser: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;

// const mongoose = require('mongoose');
// const DB_URI = 'mongodb://localhost/mongobanco';
// mongoose.connect(DB_URI, {useNewUrlParser: true});
// mongoose.Promise = global.Promise;
// module.exports = mongoose;