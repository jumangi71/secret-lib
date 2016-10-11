/**
 * BookController
 *
 * @description :: Server-side logic for managing books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var googleBooks = require('google-books-search');

module.exports = {
  booking: function(req, res) {
    if (!req.user) return res.badRequest('Not authtorized');
    Book.findOne({id: req.param('id')}).exec(function(err, book) {
      if (req.user && req.isAuthenticated() && book.available) {
        book.available = false;
        book.available_date = new Date(req.param('available_date'));
        book.holder = req.user.id;
        book.save(function(error) {
          if (error) console.log('err');
          return res.redirect(req.get('referer'));
        });
      } else {
        return res.badRequest('Not authtorized or book must be available');
      }
    });
  },

  unbooking: function(req, res) {
    if (!req.user) return res.badRequest('Not authtorized');
    Book.findOne({id: req.param('id')}).exec(function(err, book) {
      if (req.user && req.isAuthenticated() && !book.available) {
        book.available = true;
        delete book.available_date;
        book.holder = [];
        book.save(function(error) {
          if (error) console.log(error);
          return res.redirect(req.get('referer'));
        });
      } else {
        return res.badRequest('Not authtorized or book must be available');
      }
    });
  },

  find: function(req, res) {
    var page = req.query.page || 1;
    var limit = 32;
    var filter = req.query.filter || {};
    var sort = {'sort': 'title ASC'};

    Book.find(filter, sort).paginate({page: page, limit: limit})
      .then(function(books) {
        var count = Book.count(filter)
          .then(function(count) {
            return count;
          });

        var racks = Book.find()
          .groupBy('rack')
          .sum('count')
          .sort({count: 'desc'})
          .then(function(elems) {return elems;});

        var blocks = Book.find()
          .groupBy('block')
          .sum('count')
          .sort({count: 'desc'})
          .then(function(elems) {return elems;});

        var shelfs = Book.find()
          .groupBy('shelf')
          .sum('count')
          .sort({count: 'desc'})
          .then(function(elems) {return elems;});

        return [count, books, racks, blocks, shelfs];
      })
      .spread(function(count, books, racks, blocks, shelfs) {
        var coords = {racks: racks, blocks: blocks, shelfs: shelfs};
        return res.view('book/list', {
          pages: Math.ceil(count/limit),
          books: books,
          filtersData: coords
        });
      })
      .fail(function(err) {
        if (err) console.log(err);
      });
  },

  findOne: function(req, res) {
    Book.findOne({id: req.param('id')}).populate('holder')
      .then(function(book) {
        var url = book.title;
        if (book.author) {
          url += '+inauthor:' + book.author;
        }
        // TODO:
        if (req.user && req.user.id) {
          Admin.isAdmin(req.user.id, function(isAdmin) {
            googleBooks.search(url, { type: 'books', lang: 'ru'}, function(error, results) {
              if (error) console.log(error);
              console.log(results);

              return res.view('book/item', {
                book: book,
                isAuthenticated: true,
                isAdmin: isAdmin,
                searched: results
              });
            });
          });
        } else {
          return res.view('book/item', {
            book: book,
            isAuthenticated: false,
            isAdmin: false,
            searched: []
          });
        }
      })
      .fail(function(err) {
        return res.serverError(err);
      });
  }
};

