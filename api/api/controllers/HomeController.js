
var filteredOptions = ['rack', 'block', 'shelf'];

//var _getRacks = function(cb) {
//  Book.native(function(err, collection) {
//    collection.aggregate(
//      [{ "$group": {"_id": "$rack", "books": {"$push": "$_id"}} }],
//      function(err,result) {
//        if (err) return res.serverError(err);
//        if (_.isFunction(cb)) cb(result);
//      }
//    );
//  });
//};

module.exports = {

  show: function(req, res) {
    Book.count()
      .then(function(count) {
        var books = Book.find({available: true, 'sort': 'updatedAt ASC', limit: 32})
          .then(function(books) {
            return books;
          });

        return [count, books];
      })
      .spread(function(count, books) {
        return res.view('homepage', {
          books: books
        });
      })
      .fail(function(err) {
        if (err) console.log(err);
      });


    //Book.count().exec(function(err, count) {
    //  if (err) console.log('err');
    //  Book.find().paginate({page: page, limit: limit})
    //    .then(function(books) {
    //      _getRacks(function(group) {
    //        return res.view('homepage', {
    //          pages: Math.ceil(count/limit),
    //          books: books,
    //          racks: group
    //        });
    //      });
    //    })
    //    .catch(function(err) {
    //      if (err) console.log(err);
    //    });
    //});
  }
};

