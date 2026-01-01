import { describe, it, expect } from 'vitest';
import { convertListToPages, createPageHandles, paginate } from '../src/index.js';

function createList(pages: number, itemsPerPage: number = 2) {
    const length = pages * itemsPerPage;
    return Array.from({ length }, (_, index) => index + 1);
}

describe('pagesify', () => {
    describe('general', () => {
        it('should test basic', () => {
            const list = createList(1);

            const result = paginate(list, 1);

            expect(result.handles).toEqual([1]);
        });
        it("should test scenario: 1 -> [ 1, 2, 3, 'next' ]", () => {
            // * f.ex: 1 -> [ 1, 2, 3, 'next' ]
            const list = createList(3);

            const result = paginate(list, 1);

            expect(result.handles).toEqual([1, 2, 3, 'next']);
        });

        it("should test scenario: 1 or 2 or 3 -> [ 'prev', 1, 2, 3, 'next']", () => {
            // * f.ex: 1 or 2 or 3 -> [ 'prev', 1, 2, 3, 'next']
            const options = {
                stableHandles: true,
            };

            const list = createList(3);

            const test1 = paginate(list, 1, options).handles;
            const test2 = paginate(list, 2, options).handles;
            const test3 = paginate(list, 3, options).handles;

            expect(test1).toEqual(['prev', 1, 2, 3, 'next']);
            expect(test2).toEqual(['prev', 1, 2, 3, 'next']);
            expect(test3).toEqual(['prev', 1, 2, 3, 'next']);
        });

        it("should test scenario: 1 or 2 -> [ 'prev', 1, 2, 3, '..', 8, 'next' ]", () => {
            // * f.ex: 1 or 2 -> [ 'prev', 1, 2, 3, 4, '..', 8, 'next' ]
            const options = {
                stableHandles: true,
            };

            const list = createList(8);

            const test1 = paginate(list, 1, options).handles;
            const test2 = paginate(list, 2, options).handles;

            expect(test1).toEqual(['prev', 1, 2, 3, '..', 8, 'next']);
            expect(test2).toEqual(['prev', 1, 2, 3, '..', 8, 'next']);
        });

        it("should test scenario: 3 -> [ 'prev', 1, 2, 3, 4, '..', 8, 'next' ]", () => {
            // * f.ex: 3 -> [ 'prev', 1, 2, 3, 4, '..', 8, 'next' ]
            const options = {
                stableHandles: true,
            };

            const list = createList(8);

            const result = paginate(list, 3, options);

            expect(result.handles).toEqual(['prev', 1, 2, 3, '..', 8, 'next']);
        });

        it("should test scenario: 7 -> [ 'prev', 1, '..', 6, 7, 8, '..', '12', 'next' ]", () => {
            // * f.ex: 7 -> [ 'prev', 1, '..', 6, 7, 8, '..', '12', 'next' ]
            const options = {
                stableHandles: true,
            };

            const list = createList(12);

            const result = paginate(list, 7, options);

            expect(result.handles).toEqual(['prev', 1, '..', 6, 7, 8, '..', 12, 'next']);
        });

        it("should test scenario: 6 -> [ 'prev', 1, '..', 5, 6, 7, 8, 'next' ]", () => {
            // * f.ex: 6 -> [ 'prev', 1, '..', 5, 6, 7, 8, 'next' ]
            const options = {
                stableHandles: true,
            };

            const list = createList(8);

            const result = paginate(list, 6, options);

            expect(result.handles).toEqual(['prev', 1, '..', 6, 7, 8, 'next']);
        });

        it("should test scenario: 7 or 8 [ 'prev', 1, '..', 6, 7, 8, 'next' ]", () => {
            // * f.ex: 7 or 8 [ 'prev', 1, '..', 6, 7, 8, 'next' ]
            const options = {
                stableHandles: true,
            };

            const list = createList(8);

            const test1 = paginate(list, 7, options);
            const test2 = paginate(list, 8, options);

            expect(test1.handles).toEqual(['prev', 1, '..', 6, 7, 8, 'next']);
            expect(test2.handles).toEqual(['prev', 1, '..', 6, 7, 8, 'next']);
        });

        it('should create complex pagination', () => {
            const options = {
                placeholder: '?!',
                itemsPerPage: 2,
            };

            const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

            const result = paginate(list, 5, options);

            expect(result.handles).toEqual(['prev', 1, '?!', 5, 6, 7, 'next']);
        });

        it('should create complex pagination without placeholder', () => {
            const options = {
                placeholder: '?!',
                itemsPerPage: 2,
                stableHandles: true,
            };

            const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

            const result = paginate(list, 3, options);

            expect(result.handles).toEqual(['prev', 1, 2, 3, '?!', 7, 'next']);
        });

        it('should create complex pagination out of a items array', () => {
            const options = {
                placeholder: '..',
                itemsPerPage: 3,
            };

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
            ];

            const result = paginate(items, 3, options);

            expect(result.handles).toEqual(['prev', 1, 2, 3, 4, 'next']);
            expect(result.pages).toEqual([
                ['radiohead', 'jamie woon', 'actress'],
                ['joy division', 'burial', 'sampha'],
                ['the xx', 'nicolas jaar', 'boards of canada'],
                ['james blake', 'nicolas jaar'],
            ]);
        });
    });

    describe('#createPageHandles', () => {
        const options = {
            stableHandles: false,
        };

        it('first page selected', () => {
            const result = [1, 2, 3, 'next'];

            expect(createPageHandles(1, 3, options)).toEqual(result);
        });

        it('last page selected', () => {
            const result = ['prev', 1, 2, 3];

            expect(createPageHandles(3, 3, options)).toEqual(result);
        });

        it('second page selected', () => {
            const result = ['prev', 1, 2, 3, 'next'];

            expect(createPageHandles(2, 3, options)).toEqual(result);
        });

        it('big list', () => {
            const result = ['prev', 1, 2, 3, '..', 8, 'next'];

            expect(createPageHandles(3, 8, options)).toEqual(result);
        });

        it('big list, higher interval, middle selection', () => {
            const pages = [[1], [2], [3], [4], [5], [6], [7], [8]];

            const result = ['prev', 1, '..', 3, 4, 5, '..', 8, 'next'];

            expect(createPageHandles(4, pages.length, options)).toEqual(result);
        });

        it('big list, higher interval, last part selection', () => {
            const result = ['prev', 1, '..', 6, 7, 8, 'next'];

            expect(createPageHandles(6, 8, options)).toEqual(result);
        });
    });

    describe('#convertListToPages', () => {
        it('even number', () => {
            const list = [1, 2, 3, 4, 5, 6];

            const result = [
                [1, 2],
                [3, 4],
                [5, 6],
            ];

            expect(convertListToPages(list, 2)).toEqual(result);
        });

        it('odd number', () => {
            const list = [1, 2, 3, 4, 5, 6, 7];

            const result = [[1, 2], [3, 4], [5, 6], [7]];

            expect(convertListToPages(list, 2)).toEqual(result);
        });
    });
});
