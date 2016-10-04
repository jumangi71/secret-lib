module.exports = {
  isAdmin: function(uid, cb) {
    User.findOne(uid).populateAll()
      .then(function(user) {
        var hasRule = _.find(user.roles, {alias: 'admin'});
        if (_.isFunction(cb)) cb(!_.isEmpty(hasRule));
      })
      .catch(function(err) {
        if (_.isFunction(cb)) cb(err);
      });
  }
};