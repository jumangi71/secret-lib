
module.exports = {

  show: function(req, res) {
    Book.count()
      .then(function(count) {
        var books = Book.find({available: true, 'sort': 'updatedAt DESC', limit: 60})
          .then(function(books) {
            return books;
          });

        return [count, books];
      })
      .spread(function(count, books) {
        if (req.user && req.user.id) {
          Admin.isAdmin(req.user.id, function(isAdmin) {
            return res.view('homepage', {
              books: books,
              isAdmin: isAdmin
            });
          });
        } else {
          return res.view('homepage', {
            books: books,
            isAdmin: false
          });
        }
      })
      .fail(function(err) {
        if (err) console.log(err);
      });

  }
};

