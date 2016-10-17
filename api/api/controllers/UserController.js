/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');
var moment = require('moment');

module.exports = {
  personal: function(req, res) {
    Book.find({holder: req.user.id})
      .then(function(books) {
        var grouped = _.groupBy(_.sortBy(books, 'available_date'), 'available_date');
        var gr = [];
        _.forEach(grouped, function(el, k) {
          var t = moment(k).format('M.D.YYYY');
          gr[t] = el;
        });

        return res.view('personal/show', {
          books: books,
          booksByDate: gr
        });
      })
      .catch(function(err) {
        if (err) console.log(err);
      });
  }
};

