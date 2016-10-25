/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    external_id: {
      type: 'integer',
      unique: true
    },
    username: {
      type: 'string'
    },
    first_name: {
      type: 'string'
    },
    last_name: {
      type: 'string'
    },
    full_name: {
      type: 'string'
    },
    avatars: {
      type: 'json'
    },
    roles: {
      collection: 'role',
      via: 'owners',
      dominant: true
    },
    password: {
      type: 'string',
      minLength: 6
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  }
};

