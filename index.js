'use strict';

var INTERVAL = 3,
      PLACEHOLDER = '..',
      ITEMS_PER_PAGE = 2;

function Pagesify(options) {
  options = options || {};

  this.interval = options.interval || INTERVAL;
  this.placeholder = options.placeholder || PLACEHOLDER;
  this.itemsPerPage = options.itemsPerPage || ITEMS_PER_PAGE;
}

module.exports = Pagesify;


Pagesify.prototype.paginate = function(items, currentPage) {
  var itemsPerPage = this.itemsPerPage,
        pages = this.convertListToPages(items, itemsPerPage),
        handles = this.createPageHandles(pages, currentPage);

  return {
    handles: handles,
    pages: pages
  };
};

Pagesify.prototype.createPageHandles = function(pages, currentPage) {
  var pagesLength = pages.length,
        interval = this.interval,
        placeholder = this.placeholder,
        handles = [];

  // nav handle
  if (currentPage > 1) {
    handles.push('prev');
  }

  // MIDDLE
  if (currentPage <= interval) {
    // f.ex  [ 'prev', 1, 2, 3, 'next' ] or
    // f.ex: [ 'prev', 1, 2, 3, '..', 8, 'next' ]
    for (let index = 1; index <= pagesLength - 1; index++) {
      handles.push(index);

      if (index >= interval) {
        break;
      }
    }

    if (pagesLength > interval) {
      handles.push(placeholder);
    }

    // END
    // last number
    handles.push(pagesLength);
  } else {
    handles.push(1, placeholder);

    if (currentPage + interval > pagesLength) {
      // f.ex: [ 'prev', 1, '..', 6, 7, 8, 'next' ]
      for (let index = pagesLength - interval + 1; index <= pagesLength; index++) {
        handles.push(index);
      }
    } else {
      // f.ex: [ 'prev', 1, '..', 3, 4, 5, '..', 8, 'next' ]
      for (let index = currentPage - 1; index <= currentPage + 1; index++) {
        handles.push(index);
      }

      handles.push(placeholder, pagesLength);
    }
  }

  // nav handle
  if (currentPage !== pagesLength) {
    handles.push('next');
  }

  return handles;
};

Pagesify.prototype.convertListToPages = function(list, itemsPerPage) {
  var pages = {};

  var pageNr = 1,
      index = 1,
      length, listKeys, listIndex;


  if (typeof list === 'object') {
    listKeys = Object.keys(list);
    length = listKeys.length;
  } else {
    length = list.length;
  }

  for (listIndex = 0; listIndex < length; listIndex++) {
    let item;

    if (listKeys) {
      item = list[listKeys[listIndex]];
    } else {
      item = list[listIndex];
    }

    if (!pages[pageNr]) {
      pages[pageNr] = [];
    }

    pages[pageNr].push(item);

    if (index % itemsPerPage === 0) {
      pageNr++;
    }

    index++;
  }

  pages.length = Object.keys(pages).length;

  return pages;
};
