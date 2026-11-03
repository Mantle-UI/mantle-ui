import '@testing-library/jest-dom';
import DomHandler from './DomHandler';

describe('DomHandler.flipfitCollision', () => {
    const createElement = ({ left = 0, top = 0, width = 100, height = 40 } = {}) => {
        const element = document.createElement('div');

        element.getBoundingClientRect = () => ({ left, top, width, height, right: left + width, bottom: top + height });

        return element;
    };

    beforeEach(() => {
        jest.spyOn(DomHandler, 'getViewport').mockReturnValue({ width: 1000, height: 800 });
        jest.spyOn(DomHandler, 'getWindowScrollTop').mockReturnValue(0);
        jest.spyOn(DomHandler, 'getWindowScrollLeft').mockReturnValue(0);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it.each([
        ['right', 200],
        ['right', 600],
        ['right', 1000],
        ['left', 200],
        ['left', 600],
        ['left', 1000]
    ])('keeps a %s tooltip centered on a %ipx target while it fits', (side, height) => {
        const element = createElement();
        const target = createElement({ left: 300, top: 50, height });
        const { my, at } = DomHandler.findCollisionPosition(side);
        const callback = jest.fn();

        DomHandler.flipfitCollision(element, target, my, at, callback);

        expect(element).toHaveStyle({ top: `${50 + height / 2 - 20}px`, left: side === 'right' ? '400px' : '200px' });
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({ at: expect.objectContaining({ x: side, y: 'center' }) }));
    });

    it('includes document scrolling without changing a centered placement', () => {
        const element = createElement();
        const target = createElement({ left: 300, top: 50, height: 600 });

        DomHandler.getWindowScrollTop.mockReturnValue(200);
        DomHandler.getWindowScrollLeft.mockReturnValue(30);
        DomHandler.flipfitCollision(element, target, 'left center', 'right center');

        expect(element).toHaveStyle({ top: '530px', left: '430px' });
    });

    it('keeps a bottom tooltip below a tall target when the tooltip fits', () => {
        const element = createElement();
        const target = createElement({ left: 300, top: 50, height: 600 });

        DomHandler.flipfitCollision(element, target, 'center top', 'center bottom');

        expect(element).toHaveStyle({ top: '650px', left: '300px' });
    });

    it('flips above the target when the tooltip itself overflows the bottom', () => {
        const element = createElement({ height: 100 });
        const target = createElement({ left: 300, top: 720, height: 20 });
        const callback = jest.fn();

        DomHandler.flipfitCollision(element, target, 'center top', 'center bottom', callback);

        expect(element).toHaveStyle({ top: '620px' });
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({ at: expect.objectContaining({ y: 'top' }) }));
    });

    it.each([
        [-40, 30],
        [740, 710]
    ])('moves a centered tooltip at target top %i only when it overflows', (top, expectedTop) => {
        const element = createElement({ height: 60 });
        const target = createElement({ left: 300, top, height: 100 });

        DomHandler.flipfitCollision(element, target, 'left center', 'right center');

        expect(element).toHaveStyle({ top: `${expectedTop}px`, left: '400px' });
    });

    it.each([
        ['center bottom', 'center top', 200],
        ['center top', 'center bottom', 140]
    ])('fits an oversized tooltip using %s without overwriting its horizontal placement', (my, at, expectedTop) => {
        const element = createElement({ height: 860 });
        const target = createElement({ left: 300, top: 350, height: 100 });

        DomHandler.getWindowScrollTop.mockReturnValue(200);
        DomHandler.flipfitCollision(element, target, my, at);

        expect(element).toHaveStyle({ top: `${expectedTop}px`, left: '300px' });
    });
});
