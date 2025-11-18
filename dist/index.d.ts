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
    private interval;
    private placeholder;
    private itemsPerPage;
    constructor(options?: PagesifyOptions);
    paginate(items: any[] | Record<string, any>, currentPage: number): PaginationResult;
    createPageHandles(pages: Pages, currentPage: number): (string | number)[];
    convertListToPages(list: any[] | Record<string, any>, itemsPerPage: number): Pages;
}
//# sourceMappingURL=index.d.ts.map