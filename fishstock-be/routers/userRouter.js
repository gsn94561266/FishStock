const express = require('express');
const router = express();
const { checkLogin } = require('../middlewares/authMiddleware');
// /user
router.get('/', checkLogin, (req, res) => {
  res.json(req.session.user);
});

module.exports = router;
