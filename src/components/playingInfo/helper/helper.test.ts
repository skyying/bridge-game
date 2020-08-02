import {calcShouldSwitchOrNot} from './helper';

describe('calcShouldSwitchOrNot', () => {
    it('should return true if screenWidth <= 1100', () => {
        expect(calcShouldSwitchOrNot(false, 999)).toBeTruthy();
    });
    it('should return false if should not show side bar panel and width <= 1300', () => {
        expect(calcShouldSwitchOrNot(false, 1299)).toBeFalsy();
    });
    it('should return true if should show side bar panel and width <= 1300', () => {
        expect(calcShouldSwitchOrNot(true, 1299)).toBeTruthy();
    });
    it('should return false if screen width is greater than 1300', () => {
        expect(calcShouldSwitchOrNot(true, 1301)).toBeFalsy();
    });
});
