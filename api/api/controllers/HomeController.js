
module.exports = {
  show: function(req, res) {
    var page = req.query.page || 1;
    var limit = 30;

    Book.count().exec(function(err, count) {
      if (err) console.log('err');
      Book.find().paginate({page: page, limit: limit}).exec(function(err, books) {
        if (err) console.log('err');
        return res.view('homepage', {
          pages: Math.ceil(count/limit),
          books: books
        });
      });
    });
  }
};

