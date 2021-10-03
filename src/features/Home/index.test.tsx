import {render} from '@testing-library/react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Home from './index';

it('renders correctly', () => {
  const tree = renderer.create(<Home />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Text element', () => {
  const {getByText} = render(<Home />);
  console.log('--------------------------', getByText().props.children);
  //   expect(getByText('Welcome!').props.children).toBe('Welcome!');
});
