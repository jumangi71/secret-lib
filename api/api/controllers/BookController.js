/**
 * BookController
 *
 * @description :: Server-side logic for managing books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var googleBooks = require('google-books-search');
var googleBooksCfg = { type: 'books', lang: 'ru', limit: 10, order: 'relevance', key: 'AIzaSyAvB8xfOvqv7qoUJnMs_Fybx8VYBj55_9Q'};

module.exports = {
  booking: function(req, res) {
    if (!req.user) return res.badRequest('Not authtorized');
    Book.findOne({id: req.param('id')}).exec(function(err, book) {
      console.log(err, book, req.param('id'));
      if (err) return res.serverError(err);
      if (book && req.user && req.isAuthenticated() && book.available) {
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
    var limit = 60;
    var filter = _.clone(req.query.filter) || {};
    var sort = {'sort': 'title ASC'};

    if (filter.block) {
      _.forEach(filter.block, function(el, k) {
        filter.block[k] = parseInt(el);
      })
    }
    if (filter.shelf) {
      _.forEach(filter.shelf, function(el, k) {
        filter.shelf[k] = parseInt(el);
      })
    }

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
        var coords = {racks: _.sortBy(racks, 'rack'), blocks: _.sortBy(blocks, 'block'), shelfs: _.sortBy(shelfs, 'shelf')};
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
            googleBooks.search(url, googleBooksCfg, function(error, results) {
              if (error) console.log(error);

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
  },

  findBooksByISBN: function(req, res) {
    googleBooks.search(req.param('q'), googleBooksCfg, function(error, results) {
      if (error) console.log(error);

      return res.json(results);
    });
  },

  add: function(req, res) {
    var data = _.isEmpty(req.session.flash) ? {errors: false, data: false} : req.session.flash;
    req.session.flash = {};
    return res.view('book/add', data);
  },

  edit: function(req, res) {
    Book.findOne({id: req.param('id')}).populate('holder')
      .then(function(book) {

        return res.view('book/edit', {
          book: book
        });
      })
      .fail(function(err) {
        return res.serverError(err);
      });
  },

  create: function(req, res) {
    Book.create(req.params.all(), function createBook(err, book) {
      if (err) {
        if (err.ValidationError) {
          req.session.flash = {errors: err.ValidationError, data: req.params.all()};
          return res.redirect('book/add');
        } else {
          return res.serverError();
        }
      }

      return res.redirect('/book/' + book.id);
    });
  },

  update: function(req, res) {
    Book.update({id: req.param('id')}, req.allParams())
      .then(function(books) {
        var book = _.head(books);
        return res.redirect('/book/' + book.id);
      })
      .fail(function(err) {
        return res.serverError(err);
      });
  },

  destroy: function(req, res) {
    Book.destroy({id: req.param('id')}).exec(function(err) {
      if (err) return res.serverError();
      return res.redirect('/book/');
    });
  }

};

