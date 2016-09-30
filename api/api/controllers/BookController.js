/**
 * BookController
 *
 * @description :: Server-side logic for managing books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  booking: function(req, res) {
    if (!req.user) return res.badRequest('Need be authtorize');

    Book.findOne({id: req.param('id')}).exec(function(err, book) {
      if (req.user && req.isAuthenticated() && book.available) {
        book.available = false;
        book.holder = req.user.id;
        book.save(function(error) {
          if (error) console.log('err');
          return req.ok(book);
        });
      } else {
        return res.badRequest('Need be authorized and book must be available');
      }
    });

  }
};

