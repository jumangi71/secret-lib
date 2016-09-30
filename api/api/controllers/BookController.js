/**
 * BookController
 *
 * @description :: Server-side logic for managing books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  booking: function(req, res) {
    if (!req.user) return res.badRequest('Need be authtorize');

    // TODO: update selected book, add history of booking
  }
};

