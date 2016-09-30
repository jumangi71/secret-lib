
module.exports = function(req, res, next) {
  if (req.user && req.user.id) {
    User.findOne(req.user.id).populateAll().exec(function(err, user) {
      var hasRule = _.find(user.roles, {alias: 'admin'});
      if (!_.isEmpty(hasRule)) {
        return next();
      } else {
        return res.redirect('/login');
      }
    });
  } else {
    return res.badRequest('Please authorize');
  }
};
