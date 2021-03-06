/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var fs = require('fs');

module.exports.bootstrap = function(cb) {
  sails.qs = require('qs');
  sails.moment = require('moment');

  fs.readFile(sails.config.appPath + '/config/manifest.json', 'utf8', function (err, data) {
    if (err) throw err;
    sails.assets = JSON.parse(data);
  });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
