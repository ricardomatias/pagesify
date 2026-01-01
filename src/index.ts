const DEFAULT_PLACEHOLDER = '..';
const DEFAULT_ITEMS_PER_PAGE = 2;

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
 * Paginates a list of items and generates navigation handles for pagination controls.
 *
 * This function divides the input `items` array into pages based on the `itemsPerPage` option (default: 2),
 * and returns both the paged data and an array of page handles suitable for UI navigation.
 *
 * @template T The type of items in the list.
 * @param items - The complete array of items to paginate.
 * @param currentPage - The 1-based index of the currently selected page.
 * @param options - Pagination options:
 *   - itemsPerPage?: number - How many items per page (default: 2).
 *   - placeholder?: string - Placeholder for collapsed page ranges (default: '..').
 *   - stableHandles?: boolean - If true, always include prev/next handles (default: false).
 * @returns {PaginationResult<T>} An object containing:
 *   - handles: Array of page numbers, control handles ('prev', 'next'), and placeholders for UI navigation.
 *   - pages: The pages of items as arrays of type T.
 *
 * @example
 *   paginate([1,2,3,4,5,6], 2, { itemsPerPage: 2 });
 *   // => { handles: ['prev',1,2,3,'next'], pages: [[1,2],[3,4],[5,6]] }
 */
export function paginate<T>(items: T[], currentPage: number, options: PagesifyOptions = {}): PaginationResult<T> {
    const itemsPerPage = options.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;

    const pages = convertListToPages(items, itemsPerPage);
    const handles = createPageHandles(currentPage, pages.length, options);

    return {
        handles,
        pages,
    };
}

/**
 * Generates an array of page handles (numbers, navigation commands, and optional placeholders)
 *
 * Page handles may include:
 *   - 'prev': A handle for previous page navigation.
 *   - 'next': A handle for next page navigation.
 *   - 1..N: Numeric handles for direct page selection.
 *   - Placeholder (e.g., '..' or custom string): Indicates skipped/condensed ranges of pages.
 *
 *
 * Example outputs for various scenarios:
 *   - Single page: [1] or ['prev', 1, 'next'] if stableHandles is true
 *   - Beginning of list: [1, 2, 3, 'next'] or with prev if stableHandles
 *   - Middle with many pages: ['prev', 1, '..', 4, 5, 6, '..', 10, 'next']
 *   - End of list: ['prev', 1, '..', 8, 9, 10]
 *
 * @param currentPage - The current page index (1-based).
 * @param pageCount - Total number of pages.
 * @param options - PagesifyOptions allowing customization of placeholder, navigation handles, and stabilization.
 * @returns An array containing navigation handles, page numbers, and placeholders.
 */
export function createPageHandles(currentPage: number, pageCount: number, options: PagesifyOptions = {}): (string | number)[] {
    // If there's only one page, show it (add navigation if stableHandles is set)
    if (pageCount === 1) {
        return options.stableHandles ? ['prev', 1, 'next'] : [1];
    }

    const placeholder = options.placeholder || DEFAULT_PLACEHOLDER;
    const stableHandles = options.stableHandles || false;
    // The context array includes the current page and its immediate neighbors
    let context = [currentPage - 1, currentPage, currentPage + 1];

    // Determine if/where placeholders are needed
    const hasEarlyPlaceholder = context[0] > 2;
    const hasLatePlaceholder = context[2] < pageCount - 1;
    const isEarlyEdge = hasLatePlaceholder && currentPage === 3;
    const isLateEdge = hasEarlyPlaceholder && currentPage === pageCount - 2;

    // Filter out invalid page numbers (outside first/last page)
    context = context.filter((n) => n > 1 && n < pageCount);

    let start = [];
    let middle = [];
    let end = [];

    // START: Add 'prev' if we're not on the first page
    if (currentPage > 1 || stableHandles) {
        start.push('prev');
    }

    // Always add first page number
    start.push(1);

    // Add placeholder after the first page if context does not immediately follow
    if (hasEarlyPlaceholder) {
        start.push(placeholder);
    }

    // MIDDLE
    // * SCENARIOS
    // * f.ex: 1 -> [ 1, 2, 3, 'next' ]
    // * f.ex: 1 or 2 or 3 -> [ 'prev', 1, 2, 3, 'next']
    // * f.ex: 1 or 2 -> [ 'prev', 1, 2, 3, '..', 8, 'next' ]
    // * f.ex: 3 -> [ 'prev', 1, 2, 3, 4, '..', 8, 'next' ]
    // * f.ex: 7 -> [ 'prev', 1, '..', 6, 7, 8, '..', '12', 'next' ]
    // * f.ex: 6 -> [ 'prev', 1, '..', 5, 6, 7, 8, 'next' ]
    // * f.ex: 7 or 8 [ 'prev', 1, '..', 6, 7, 8, 'next' ]

    if (context.length === 1) {
        if (hasLatePlaceholder) context.push(context[context.length - 1] + 1);
        if (hasEarlyPlaceholder) context.unshift(context[0] - 1);
    } else {
        if (hasLatePlaceholder && isEarlyEdge) context.splice(-1, 1);
        if (hasEarlyPlaceholder && isLateEdge) context.splice(0, 1);
    }

    middle.push(...context);

    // END: Add placeholder before the last page if needed
    if (hasLatePlaceholder) {
        end.push(placeholder);
    }

    // Always add last page number
    end.push(pageCount);

    // Add 'next' handle if we're not on the last page or if stableHandles is required
    if (currentPage !== pageCount || stableHandles) {
        end.push('next');
    }

    return [...start, ...middle, ...end];
}

/**
 * Splits a flat list into an array of pages, where each page contains up to `itemsPerPage` items.
 *
 * @template T The type of items in the list.
 * @param {T[]} list - The input array to be split into pages.
 * @param {number} itemsPerPage - The maximum number of items per page.
 * @returns {T[][]} An array of pages, where each page is an array of items.
 *
 * @example
 * convertListToPages([1, 2, 3, 4, 5], 2);
 * // Returns: [[1, 2], [3, 4], [5]]
 */
export function convertListToPages<T>(list: T[], itemsPerPage: number): T[][] {
    const pages: T[][] = [];
    let page: T[] = [];

    for (let index = 0; index < list.length; index++) {
        const item = list[index];
        const isLastItem = index === list.length - 1;

        page.push(item);

        if (page.length === itemsPerPage || (isLastItem && page.length > 0)) {
            pages.push(page);
            page = [];
        }
    }

    return pages;
}
