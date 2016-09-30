var fs = require('fs');
var csv = require("fast-csv");
var _ = require("lodash");
//var request = require('request');

module.exports = {
  _loadBooks: function(opts, done) {
    var stream = fs.createReadStream(__dirname + '/books.csv');
    var result = [];
    var csvStream = csv({delimiter: ';', headers: true})
      .on("data", function(data) {
        result.push(data);
      })
      .on("end", function() {
        console.log("done");
        ParseBooks.parseData(result);
      });

    stream.pipe(csvStream);
  },

  parseData: function(dt) {
    _.forEach(dt, function(data) {
      var book = {
        title: data['Фрико'],
        author: data['шантарам'],
        publishing_house: data['Издательство'],
        series: data['Серия'],
        rack: data['Стеллаж'],
        block: parseInt(data['Ярус (снизу)']),
        shelf: parseInt(data['Полка (слева)'])
      };
      //book = _(book).omit(_.isUndefined).omit(_.isNull).value();
      console.log(book);
      if (book.block) {
        Book.create(book).exec(console.log);
      }
    });

  }
};