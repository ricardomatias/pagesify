const DEFAULT_PLACEHOLDER = '..';
const DEFAULT_ITEMS_PER_PAGE = 2;
/**
 * The current page is always surrounded by the next and following page numbers UNLESS they are the first or last page.
 */
export function paginate(items, currentPage, options = {}) {
    const itemsPerPage = options.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
    const pages = convertListToPages(items, itemsPerPage);
    const handles = createPageHandles(pages.length, currentPage, options);
    return {
        handles,
        pages,
    };
}
export function createPageHandles(currentPage, pageCount, options = {}) {
    const placeholder = options.placeholder || DEFAULT_PLACEHOLDER;
    const stableHandles = options.stableHandles || false;
    let context = [currentPage - 1, currentPage, currentPage + 1];
    const hasEarlyPlaceholder = context[0] > 2;
    const hasLatePlaceholder = context[2] < pageCount - 1;
    const isEarlyEdge = hasLatePlaceholder && currentPage === 3;
    const isLateEdge = hasEarlyPlaceholder && currentPage === pageCount - 2;
    context = context.filter((n) => n > 1 && n < pageCount);
    let start = [];
    let middle = [];
    let end = [];
    // START: nav handle
    if (currentPage > 1 || stableHandles) {
        start.push('prev');
    }
    start.push(1);
    // add placeholder if context[0] != 2
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
        if (hasLatePlaceholder)
            context.push(context[context.length - 1] + 1);
        if (hasEarlyPlaceholder)
            context.unshift(context[0] - 1);
    }
    else {
        if (hasLatePlaceholder && isEarlyEdge)
            context.splice(-1, 1);
        if (hasEarlyPlaceholder && isLateEdge)
            context.splice(0, 1);
    }
    middle.push(...context);
    // END: nav handle
    if (hasLatePlaceholder) {
        end.push(placeholder);
    }
    end.push(pageCount);
    if (currentPage !== pageCount || stableHandles) {
        end.push('next');
    }
    return [...start, ...middle, ...end];
}
export function convertListToPages(list, itemsPerPage) {
    const pages = [];
    let page = [];
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
//# sourceMappingURL=index.js.map