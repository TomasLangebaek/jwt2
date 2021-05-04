var express = require('express');
var router = express.Router();
var [getUser] = require('../controllers/users');

/* GET user. */
router.get('/:id', async function (req, res, next) {
  const user = await getUser(req.params.id);
  res.send(user);
});

module.exports = router;
