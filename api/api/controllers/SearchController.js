/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require("lodash");

var parseSearchData = function(data, cb) {
  var filter = _.map(data, '_id');
  Book.find({id: filter}).exec(function(err, books) {
    if (_.isFunction(cb)) cb(books);
  });
};

module.exports = {

  search: function(req, res) {
    var page = req.query.page || 1;
    var limit = 32;
    var offset = (page > 1) ? page*limit : 0;
    if (req.query && req.query.q) {
      Book.native(function(err, collection) {
        if (err) return res.serverError(err);
        collection.find({$text: {$search: req.query.q, $language: "ru"}}).toArray(function(err, allResult) {
          collection.find({$text: {$search: req.query.q, $language: "ru"}}).skip(offset).limit(limit).toArray(function(err, result) {
            if (err) return res.serverError(err);
            parseSearchData(result, function(results) {
              return res.view('search', {result: results, page: page, pages: Math.ceil((allResult.length)/limit)-1 });
            });
          });
        });
      });
    } else {
      return res.view('search', {result: [], pages: 0, page: 0});
    }
  }
};

