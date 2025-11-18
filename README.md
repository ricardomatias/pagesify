# pagesify [![Build Status](https://travis-ci.org/ricardomatias/pagesify.svg)](https://travis-ci.org/ricardomatias/pagesify)

> Simple pagination algorithm

## Requirements

-   node.js

## Install

```
$ npm install --save pagesify
```

## Usage

```js
import Pagesify from 'pagesify';

const pagesify = new Pagesify({
    interval: 3,
    placeholder: '..',
    itemsPerPage: 3,
});

const items = [
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
    'nicolas jaar',
    'apparat',
    'clark',
];

const currentPage = 3;

const pagination = pagesify.paginate(items, currentPage);

console.log(pagination.handles);
// { handles: [ 'prev', 1, 2, 3, '..', 5, 'next' ] }

console.log(pagination.pages);
/* pages:
 { '1': [ 'radiohead', 'jamie woon', 'actress' ],
   '2': [ 'joy division', 'burial', 'sampha' ],
   '3': [ 'the xx', 'nicolas jaar', 'boards of canada' ],
   '4': [ 'james blake', 'nicolas jaar', 'apparat ],
   '5': [ 'clark' ],
   length: 5 } }
*/
```

## TypeScript

This library is written in TypeScript and includes type definitions. The interfaces are automatically available when importing:

```typescript
import Pagesify, { PagesifyOptions, PaginationResult, Pages } from 'pagesify';

const options: PagesifyOptions = {
    interval: 3,
    placeholder: '..',
    itemsPerPage: 3,
};

const pagesify = new Pagesify(options);
const result: PaginationResult = pagesify.paginate(items, 3);
```

## API

### OPTIONS

-   interval(default=3) - how many pages shown in between the current page
-   placeholder(default='..') - which symbol represents the interval of pages that isn't shown
-   itemsPerPage(default=2) - how many items are there in each page

### createPageHandles (pages, currentPage)

**pages**: object<array> starting from 1  
**currentPage**: number

Returns an array of **handles**

### convertListToPages (list, itemsPerPage)

**list**: object<array> starting from 1  
**itemsPerPage**: number

Returns an object<array> of **pages**

---

## License

MIT © Ricardo Matias
