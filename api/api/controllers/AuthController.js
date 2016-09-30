/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function(req, res) {
    //ParseUsers._getUsers(false, function() {
    //  console.log(123);
    //});

    passport.authenticate('ldapauth', {session: false}, function(err, user) {
      if ((err) || (!user)) return res.send({message: 'user not found'});
      var userLogin = _.trimRight(user.mail, '@rambler-co.ru');
      User.findOne({username: userLogin}).exec(function(err, usr) {
        if ((err) || (!usr)) return res.send({message: 'user not found'});
        req.logIn(usr, function(err) {
          if (err) return res.send(err);
          return res.send({
            user: usr
          });
        });
      });
    })(req, res);


    //passport.authenticate('local', function(err, user, info) {
    //  if ((err) || (!user)) {
    //    return res.send({
    //      message: info.message,
    //      user: user
    //    });
    //  }
    //  req.logIn(user, function(err) {
    //    if (err) res.send(err);
    //    return res.send({
    //      message: info.message,
    //      user: user
    //    });
    //  });
    //
    //})(req, res);
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};