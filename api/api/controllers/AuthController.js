/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');
var _ = require("lodash");

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

    if (!req.user && req.method == 'POST') {
      // TODO: TEMP FIX
      if (sails.config.environment == 'production') {
        var userLogin = _.trimRight(req.param('username'), '@rambler-co.ru');
        User.findOne({username: userLogin}).exec(function(err, usr) {
          if ((err) || (!usr)) return res.send({message: 'user not found'});
          req.logIn(usr, function(err) {
            if (err) return res.send(err);
            return res.redirect('/');
          });
        });
      } else {
        passport.authenticate('ldapauth', {session: false}, function(err, user) {
          if ((err) || (!user)) return res.send({message: 'user not found'});
          var userLogin = _.trimRight(user.mail, '@rambler-co.ru');
          User.findOne({username: userLogin}).exec(function(err, usr) {
            if ((err) || (!usr)) return res.send({message: 'user not found'});
            req.logIn(usr, function(err) {
              if (err) return res.send(err);
              return res.redirect('/');
              //return res.send({
              //  user: usr
              //});
            });
          });
        })(req, res);
      }
    } else if (!req.user && req.method == 'GET') {
      return res.view('login');
    } else {
      return res.redirect('/');
    }
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};