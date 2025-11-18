const DEFAULT_INTERVAL = 3;
const DEFAULT_PLACEHOLDER = '..';
const DEFAULT_ITEMS_PER_PAGE = 2;

export interface PagesifyOptions {
    interval?: number;
    placeholder?: string;
    itemsPerPage?: number;
}

export interface Pages {
    [key: number]: any[];
    length: number;
}

export interface PaginationResult {
    handles: (string | number)[];
    pages: Pages;
}

export default class Pagesify {
    private interval: number;
    private placeholder: string;
    private itemsPerPage: number;

    constructor(options: PagesifyOptions = {}) {
        this.interval = options.interval || DEFAULT_INTERVAL;
        this.placeholder = options.placeholder || DEFAULT_PLACEHOLDER;
        this.itemsPerPage = options.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
    }

    paginate(items: any[] | Record<string, any>, currentPage: number): PaginationResult {
        const pages = this.convertListToPages(items, this.itemsPerPage);
        const handles = this.createPageHandles(pages, currentPage);

        return {
            handles,
            pages,
        };
    }

    createPageHandles(pages: Pages, currentPage: number): (string | number)[] {
        const pagesLength = pages.length;
        const interval = this.interval;
        const placeholder = this.placeholder;
        const handles: (string | number)[] = [];

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
    }

    convertListToPages(list: any[] | Record<string, any>, itemsPerPage: number): Pages {
        const pages: Pages = { length: 0 };

        let pageNr = 1;
        let index = 1;
        let length: number;
        let listKeys: string[] | undefined;

        if (typeof list === 'object' && !Array.isArray(list)) {
            listKeys = Object.keys(list);
            length = listKeys.length;
        } else {
            length = (list as any[]).length;
        }

        for (let listIndex = 0; listIndex < length; listIndex++) {
            let item: any;

            if (listKeys) {
                item = (list as Record<string, any>)[listKeys[listIndex]];
            } else {
                item = (list as any[])[listIndex];
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

        pages.length = Object.keys(pages).filter((key) => key !== 'length').length;

        return pages;
    }
}
