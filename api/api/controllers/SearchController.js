/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var parseSearchData = function(data, cb) {
  var filter = _.map(data, '_id');
  Book.find({id: filter}).exec(function(err, books) {
    if (_.isFunction(cb)) cb(books);
  });
};

module.exports = {

  search: function(req, res) {
    if (req.query && req.query.q) {
      Book.native(function(err, collection) {
        //if (err) return res.serverError(err);
        collection.find({$text: {$search: req.query.q, $language: "ru"}}).toArray(function(err, result) {
          if (err) return res.serverError(err);
          parseSearchData(result, function(results) {
            return res.view('search', {result: results});
          });
        });
      });
    } else {
      return res.view('search');
    }
  }
};

