
var request = require('request');
var _ = require("lodash");

module.exports = {
  _getUsers: function(opts, done) {
    request.get(
      {
          url: 'https://we.rambler-co.ru/api/home/users/',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': 'ruid=URNdEVal9Qmew80vCcSxAgB=; _ym_uid=1461154236116470001; __utma=169010082.2083082252.1453716795.1473431801.1473855315.20; __utmc=169010082; __utmz=169010082.1473165565.17.11.utmcsr=rcorpfb|utmccn=gevork-sarkisyan--soosnovatel-kompanii|utmcmd=social; csrftoken=UDzMteyChiEMM7AAxaToxl1nLkU9GPro; sessionid=y1chorzmcxc2zotsr935ajxhkme8kvb9; dv=+WKPjw0mQEkzAcyQIjgJk8dPFD5c+eE:1475253414; _ga=GA1.2.2083082252.1453716795; _gat=1'
          }
      },
      function(error, response, body) {
        if (error) return sails.log.error(error);

        //sails.log.info(response);
        //sails.log.info(body);

        var users = JSON.parse(body);
        _.forEach(users, function(user) {
          var usr = {
            external_id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            avatars: user.avatars
          };
          User.findOrCreate(usr).exec(function createFindCB(error, createdOrFoundRecords) {
            console.log(createdOrFoundRecords);
            Role.findOne({alias: 'user'}).exec(function(err, role) {
              createdOrFoundRecords.roles.add(role.id);
              createdOrFoundRecords.save();
            });
          });
        });
        return done();
      }
    );
  }
};