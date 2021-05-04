mongodb = require('../db/Mongolib');

function getUser(id) {
  return mongodb.conn().then((client) => {
    console.log('connected');
    return client
      .db('tallertomas2')
      .collection('users')
      .find({ username: id })
      .toArray();
  });
}

module.exports = [getUser];
