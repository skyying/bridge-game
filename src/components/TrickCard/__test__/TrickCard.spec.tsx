import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import TrickCard from '../TrickCard';


describe('<TrickCard />', () => {
    it('render value correctly', () => {
       const {getByText} = render(<TrickCard value={5} />);
       expect(getByText('5')).toBeTruthy();
    });
});


