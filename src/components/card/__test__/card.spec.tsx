import React from 'react';
import Card from '../card';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('<Card />', () => {
    test('render correct text and className when flip up and value is 0', () => {
        const {container, getByText} = render(<Card flipUp={true} value={0} />);
        expect(container.querySelector('.black')).toBeTruthy();
        expect(container.querySelector('.flip-up')).toBeTruthy();
        expect(getByText(/2/i)).toBeTruthy()
    });

    test('render correct text and className when flip up and value is 51', () => {
        const {container, getByText} = render(<Card flipUp={true} value={51} />);
        expect(container.querySelector('.black')).toBeTruthy();
        expect(container.querySelector('.flip-up')).toBeTruthy();
        expect(getByText(/A/i)).toBeTruthy()
    });

    test('not render text when flip down', () => {
        const {container, queryByText} = render(<Card flipUp={false} value={51} />);
        expect(container.querySelector('.flip-down')).toBeTruthy();
        expect(queryByText(/A/i)).toBeFalsy()
    });

});


