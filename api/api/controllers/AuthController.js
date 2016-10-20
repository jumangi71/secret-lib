/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');
var _ = require('lodash');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  showLogin: function(req, res) {
    if (!req.user) {
      var data = _.isEmpty(req.session.auth) ? {errors: false, data: false} : req.session.auth;
      req.session.auth = {};
      return res.view('login', data);
    } else {
      return res.redirect('/');
    }
  },

  login: function(req, res) {
    //ParseUsers._getUsers(false, function() {
    //  console.log(123);
    //});

    // TODO: TEMP FIX
    if (sails.config.environment == 'production') {
      User.findOne({username: req.param('username')}).exec(function(err, usr) {
        if ((err) || (!usr)) {
          req.session.auth = {errors: true, data: {username: req.param('username')}};
          return res.redirect('/login');
        }
        req.logIn(usr, function(err) {
          if (err) return res.send(err);
          return res.redirect('/');
        });
      });
    } else {
      passport.authenticate('ldapauth', {session: false}, function(err, user) {
        if ((err) || (!user)) {
          req.session.auth = {errors: true, data: {username: req.param('username')}};
          return res.redirect('/login');
        }

        var userLogin = _.trimEnd(user.mail, '@rambler-co.ru');
        User.findOne({username: userLogin}).exec(function(err, usr) {
          if ((err) || (!usr)) {
            req.session.auth = {errors: true, data: {username: req.param('username')}};
            return res.redirect('/login');
          }
          req.logIn(usr, function(err) {
            if (err) return res.send(err);
            return res.redirect('/');
          });
        });
      })(req, res);
    }
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};