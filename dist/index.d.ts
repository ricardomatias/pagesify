export interface PagesifyOptions {
    placeholder?: string;
    itemsPerPage?: number;
    stableHandles?: boolean;
}
export interface PaginationResult<T> {
    handles: (string | number)[];
    pages: T[][];
}
/**
 * The current page is always surrounded by the next and following page numbers UNLESS they are the first or last page.
 */
export declare function paginate<T>(items: T[], currentPage: number, options?: PagesifyOptions): PaginationResult<T>;
export declare function createPageHandles(currentPage: number, pageCount: number, options?: PagesifyOptions): (string | number)[];
export declare function convertListToPages<T>(list: T[], itemsPerPage: number): T[][];
//# sourceMappingURL=index.d.ts.map