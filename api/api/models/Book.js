/**
 * Book.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    isbn: {
      type: 'string'
    },
    title: {
      type: 'string',
      unique: true,
      required: true
    },
    cover: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    released: {
      type: 'date'
    },
    author: {
      type: 'string'
    },
    publishing_house: {
      type: 'string'
    },
    series: {
      type: 'string'
    },

    available: {
      type: 'boolean'
    },
    available_date: {
      type: 'date'
    },

    holder: {
      model: 'user'
    },

    rack: {
      type: 'string',
      required: true
    },
    block: {
      type: 'integer',
      required: true
    },
    shelf: {
      type: 'integer',
      required: true
    },

    link: function() {
      return '/book/' + this.id;
    }

  }
};

