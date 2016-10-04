/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  personal: function(req, res) {
    Book.find({holder: req.user.id})
      .then(function(books) {
        return res.view('personal/show', {
          books: books
        });
      })
      .catch(function(err) {
        if (err) console.log(err);
      });
  }
};

