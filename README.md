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
import { paginate } from 'pagesify';

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

const pagination = paginate(items, currentPage, {
    placeholder: '..',
    itemsPerPage: 3,
});

console.log(pagination.handles);
// ['prev', 1, 2, 3, 4, 5, 'next']

console.log(pagination.pages);
// [
//   ['radiohead', 'jamie woon', 'actress'],
//   ['joy division', 'burial', 'sampha'],
//   ['the xx', 'nicolas jaar', 'boards of canada'],
//   ['james blake', 'nicolas jaar', 'apparat'],
//   ['clark']
// ]
```

## TypeScript

This library is written in TypeScript and includes type definitions. The interfaces are automatically available when importing:

```typescript
import { paginate, PagesifyOptions, PaginationResult } from 'pagesify';

const options: PagesifyOptions = {
    placeholder: '..',
    itemsPerPage: 3,
    stableHandles: false,
};

const items = ['item1', 'item2', 'item3'];
const result: PaginationResult<string> = paginate(items, 1, options);
```

## API

### paginate(items, currentPage, options?)

Main function to paginate a list of items and generate navigation handles.

**items**: `T[]` - Array of items to paginate  
**currentPage**: `number` - Current page number (1-based)  
**options**: `PagesifyOptions` (optional) - Configuration options

Returns: `PaginationResult<T>` containing:

-   `handles`: Array of page numbers, 'prev', 'next', and placeholder strings
-   `pages`: 2D array of paginated items

### OPTIONS

-   **placeholder** (default='..')  
    Symbol representing collapsed page ranges
-   **itemsPerPage** (default=2)  
    Number of items per page
-   **stableHandles** (default=false)  
    If true, 'prev' and 'next' handles are always shown even on first/last page

### createPageHandles(currentPage, pageCount, options?)

Generates navigation handles for pagination UI.

**currentPage**: `number` - Current page (1-based)  
**pageCount**: `number` - Total number of pages  
**options**: `PagesifyOptions` (optional)

Returns: Array of handles `(string | number)[]`

### convertListToPages(list, itemsPerPage)

Splits a flat list into pages.

**list**: `T[]` - Array of items  
**itemsPerPage**: `number` - Items per page

Returns: `T[][]` - Array of pages

---

## License

MIT © Ricardo Matias
