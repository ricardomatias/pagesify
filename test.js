'use strict';

/* global describe it */

var expect = require('chai').expect;

var Pagesify = require('./index.js');

describe('pagesify', function() {


  describe('general', function() {

    var pagesify = new Pagesify();

    it('should create simple pagination', function() {

      var list = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6
      };

      var result = pagesify.paginate(list, 1);

      expect(result.handles).to.eql([ 1, 2, 3, 'next' ]);
    });

    it('should create complex pagination', function() {

      pagesify = new Pagesify({
        interval: 4,
        placeholder: '?!',
        itemsPerPage: 2
      });

      var list = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 12,
        13: 13
      };

      var result = pagesify.paginate(list, 5);

      expect(result.handles).to.eql([ 'prev', 1, '?!', 4, 5, 6, 7, 'next' ]);
    });

    it('should create complex pagination out of a items array', function() {

      var pagesify = new Pagesify({
        interval: 3,
        placeholder: '..',
        itemsPerPage: 3
      });

      var items = [
        'radiohead',
        'jamie woon',
        'actress',
        'joy division',
        'burial',
        'sampha',
        'the xx',
        'nicolas jaar',
        'boards of canada',
        'james blake',
        'nicolas jaar'
      ];

      var result = pagesify.paginate(items, 3);

      expect(result.handles).to.eql([ 'prev', 1, 2, 3, '..', 4, 'next' ]);
      expect(result.pages).to.eql({
        '1': [ 'radiohead', 'jamie woon', 'actress' ],
        '2': [ 'joy division', 'burial', 'sampha' ],
        '3': [ 'the xx', 'nicolas jaar', 'boards of canada' ],
        '4': [ 'james blake', 'nicolas jaar' ],
        length: 4
      });
    });

  });

  describe('#createPageHandles', function() {

    var pagesify = new Pagesify();

    it('first page selected', function() {
      var pages = {
        1: 1,
        2: 2,
        3: 3,
        length: 3
      };

      var result = [ 1, 2, 3, 'next' ];

      expect(pagesify.createPageHandles(pages, 1)).to.eql(result);
    });

    it('last page selected', function() {
      var pages = {
        1: 1,
        2: 2,
        3: 3,
        length: 3
      };

      var result = [ 'prev', 1, 2, 3 ];

      expect(pagesify.createPageHandles(pages, 3)).to.eql(result);
    });

    it('second page selected', function() {
      var pages = {
        1: 1,
        2: 2,
        3: 3,
        length: 3
      };

      var result = [ 'prev', 1, 2, 3, 'next' ];

      expect(pagesify.createPageHandles(pages, 2)).to.eql(result);
    });

    it('big list', function() {
      var pages = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        length: 8
      };

      var result = [ 'prev', 1, 2, 3, '..', 8, 'next' ];

      expect(pagesify.createPageHandles(pages, 3)).to.eql(result);
    });

    it('big list, higher interval, middle selection', function() {
      var pages = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        length: 8
      };

      var result = [ 'prev', 1, '..', 3, 4, 5, '..', 8, 'next' ];

      expect(pagesify.createPageHandles(pages, 4)).to.eql(result);
    });

    it('big list, higher interval, last part selection', function() {
      var pages = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        length: 8
      };

      var result = [ 'prev', 1, '..', 6, 7, 8, 'next' ];

      expect(pagesify.createPageHandles(pages, 6)).to.eql(result);
    });

  });

  describe('#convertListToPages', function() {

    var pagesify = new Pagesify();

    it('even number', function() {
      var list = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6
      };

      var result = { 1: [ 1, 2 ], 2: [ 3, 4 ], 3: [ 5, 6 ], length: 3 };

      expect(pagesify.convertListToPages(list, 2)).to.eql(result);
    });

    it('odd number', function() {
      var list = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7
      };

      var result = { 1: [ 1, 2 ], 2: [ 3, 4 ], 3: [ 5, 6 ], 4: [ 7 ], length: 4 };

      expect(pagesify.convertListToPages(list, 2)).to.eql(result);
    });

  });

});
