import { describe, it, expect } from 'vitest';
import Pagesify from '../src/index.js';

describe('pagesify', () => {
    describe('general', () => {
        let pagesify = new Pagesify();

        it('should create simple pagination', () => {
            const list = {
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5,
                6: 6,
            };

            const result = pagesify.paginate(list, 1);

            expect(result.handles).toEqual([1, 2, 3, 'next']);
        });

        it('should create complex pagination', () => {
            pagesify = new Pagesify({
                interval: 4,
                placeholder: '?!',
                itemsPerPage: 2,
            });

            const list = {
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5,
                6: 6,
                7: 7,
                8: 8,
                9: 9,
                10: 10,
                11: 11,
                12: 12,
                13: 13,
            };

            const result = pagesify.paginate(list, 5);

            expect(result.handles).toEqual(['prev', 1, '?!', 4, 5, 6, 7, 'next']);
        });

        it('should create complex pagination out of a items array', () => {
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
            ];

            const result = pagesify.paginate(items, 3);

            expect(result.handles).toEqual(['prev', 1, 2, 3, '..', 4, 'next']);
            expect(result.pages).toEqual({
                '1': ['radiohead', 'jamie woon', 'actress'],
                '2': ['joy division', 'burial', 'sampha'],
                '3': ['the xx', 'nicolas jaar', 'boards of canada'],
                '4': ['james blake', 'nicolas jaar'],
                length: 4,
            });
        });
    });

    describe('#createPageHandles', () => {
        const pagesify = new Pagesify();

        it('first page selected', () => {
            const pages = {
                1: [1],
                2: [2],
                3: [3],
                length: 3,
            };

            const result = [1, 2, 3, 'next'];

            expect(pagesify.createPageHandles(pages, 1)).toEqual(result);
        });

        it('last page selected', () => {
            const pages = {
                1: [1],
                2: [2],
                3: [3],
                length: 3,
            };

            const result = ['prev', 1, 2, 3];

            expect(pagesify.createPageHandles(pages, 3)).toEqual(result);
        });

        it('second page selected', () => {
            const pages = {
                1: [1],
                2: [2],
                3: [3],
                length: 3,
            };

            const result = ['prev', 1, 2, 3, 'next'];

            expect(pagesify.createPageHandles(pages, 2)).toEqual(result);
        });

        it('big list', () => {
            const pages = {
                1: [1],
                2: [2],
                3: [3],
                4: [4],
                5: [5],
                6: [6],
                7: [7],
                8: [8],
                length: 8,
            };

            const result = ['prev', 1, 2, 3, '..', 8, 'next'];

            expect(pagesify.createPageHandles(pages, 3)).toEqual(result);
        });

        it('big list, higher interval, middle selection', () => {
            const pages = {
                1: [1],
                2: [2],
                3: [3],
                4: [4],
                5: [5],
                6: [6],
                7: [7],
                8: [8],
                length: 8,
            };

            const result = ['prev', 1, '..', 3, 4, 5, '..', 8, 'next'];

            expect(pagesify.createPageHandles(pages, 4)).toEqual(result);
        });

        it('big list, higher interval, last part selection', () => {
            const pages = {
                1: [1],
                2: [2],
                3: [3],
                4: [4],
                5: [5],
                6: [6],
                7: [7],
                8: [8],
                length: 8,
            };

            const result = ['prev', 1, '..', 6, 7, 8, 'next'];

            expect(pagesify.createPageHandles(pages, 6)).toEqual(result);
        });
    });

    describe('#convertListToPages', () => {
        const pagesify = new Pagesify();

        it('even number', () => {
            const list = {
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5,
                6: 6,
            };

            const result = { 1: [1, 2], 2: [3, 4], 3: [5, 6], length: 3 };

            expect(pagesify.convertListToPages(list, 2)).toEqual(result);
        });

        it('odd number', () => {
            const list = {
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5,
                6: 6,
                7: 7,
            };

            const result = { 1: [1, 2], 2: [3, 4], 3: [5, 6], 4: [7], length: 4 };

            expect(pagesify.convertListToPages(list, 2)).toEqual(result);
        });
    });
});
