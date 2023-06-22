const checkLogin = (req, res, next) => {
  if (req.session.user) {
    console.log(req.session.user);
    next();
  } else {
    res.json({ msg: '尚未登入' });
  }
};

module.exports = {
  checkLogin,
};
