/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');
var _ = require('lodash');
var bcrypt = require('bcrypt');

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

  showRegistration: function(req, res) {
    if (!req.user) {
      var data = _.isEmpty(req.session.reg) ? {errors: false, data: false} : req.session.reg;
      req.session.reg = {};
      return res.view('register', data);
    } else {
      return res.redirect('/');
    }
  },

  login: function(req, res) {
    User.findOne({username: req.param('username')}).exec(function(err, usr) {
      if ((err) || (!usr)) {
        req.session.auth = {errors: true, data: {username: req.param('username')}};
        return res.redirect('/login');
      }

      bcrypt.compare(req.param('password'), usr.password, function (err, passCheck) {
        if (!passCheck) {
          req.session.auth = {errors: true, data: {username: req.param('username')}};
          return res.redirect('/login');
        }
        req.logIn(usr, function(err) {
          if (err) return res.send(err);
          return res.redirect('/');
        });
      });
    });

    //ParseUsers._getUsers(false, function() {
    //  console.log(123);
    //});

    //passport.authenticate('ldapauth', {session: false}, function(err, user) {
    //  if ((err) || (!user)) {
    //    req.session.auth = {errors: true, data: {username: req.param('username')}};
    //    return res.redirect('/login');
    //  }
    //
    //  var userLogin = _.trimEnd(user.mail, '@rambler-co.ru');
    //  User.findOne({username: userLogin}).exec(function(err, usr) {
    //    if ((err) || (!usr)) {
    //      req.session.auth = {errors: true, data: {username: req.param('username')}};
    //      return res.redirect('/login');
    //    }
    //    req.logIn(usr, function(err) {
    //      if (err) return res.send(err);
    //      return res.redirect('/');
    //    });
    //  });
    //})(req, res);
  },

  registration: function(req, res) {

    User.findOne({username: req.param('username')}).exec(function(err, usr) {
      if ((err) || (!usr)) {
        req.session.reg = {errors: true, data: {username: req.param('username')}};
        return res.redirect('/registration');
      }

      var genPasswd = Math.random().toString(36).slice(-6);
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(genPasswd, salt, function(err, hash) {
          if (err) {
            req.session.reg = {errors: true, data: {username: req.param('username')}};
            return res.redirect('/registration');
          } else {
            usr.password = hash;
            usr.save(function(err) {
              if (err) {
                req.session.reg = {errors: true, data: {username: req.param('username')}};
                return res.redirect('/registration');
              }
              sails.hooks.email.send(
                'registration',
                {
                  password: genPasswd,
                  userName: usr.last_name + ' ' + usr.first_name
                },
                {
                  to: usr.username + '@rambler-co.ru',
                  subject: '[Рамблер/Библиотека] Регистрация'
                },
                function(err) {
                  if (err) console.log(err);
                  req.session.reg = {errors: false, data: {message: 'На ваш email отправлены авторизационные данные', username: req.param('username')}};
                  return res.redirect('/registration');
                }
              );
            });
          }
        });
      });
    });
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};