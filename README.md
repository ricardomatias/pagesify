# pagesify [![Build Status](https://travis-ci.org/ricardomatias/pagesify.svg)](https://travis-ci.org/ricardomatias/pagesify)

> Simple pagination algorithm

## Requirements

* node.js

## Install

```
$ npm install --save pagesify
```

## Usage

```js
var Pagesify = require('pagesify');

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

var currentPage = 3;

var pagination = pagesify.paginate(items, currentPage);

console.log(pagination.handles);
// { handles: [ 'prev', 1, 2, 3, '..', 4, 'next' ] }

console.log(pagination.pages);
/* pages:
 { '1': [ 'radiohead', 'jamie woon', 'actress' ],
   '2': [ 'joy division', 'burial', 'sampha' ],
   '3': [ 'the xx', 'nicolas jaar', 'boards of canada' ],
   '4': [ 'james blake', 'nicolas jaar' ],
   length: 4 } }
*/

```

## API

Besides the methods provided by default, I've added 2 new methods:

* **createPageHandles**
* **convertListToPages**

### createPageHandles (pages, currentPage)

**pages**: object<array> starting from 1  
**currentPage**: number

Returns an array of **handles**

---

#### convertListToPages (list, itemsPerPage)

**list**: object<array> starting from 1  
**itemsPerPage**: number

Returns an object<array> of **pages**

## License

MIT © Ricardo Matias
