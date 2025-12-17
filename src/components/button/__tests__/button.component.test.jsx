import { render, screen } from '@testing-library/react';
import Button, { BUTTON_TYPES_CLASSES } from '../button.component';

describe('Button component', () => {
  it('should render the base button when nothing is passed', () => {
    render(<Button />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveStyle({ 'background-color': 'black' });
  });

  it('should render google button when buttonType is google', () => {
    render(<Button buttonType={BUTTON_TYPES_CLASSES.google} />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveStyle({ 'background-color': '#4285f4' });
  });

  it('should render inverted button when buttonType is inverted', () => {
    render(<Button buttonType={BUTTON_TYPES_CLASSES.inverted} />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveStyle({ 'background-color': 'white' });
  });

  it('should be disabled when isLoading is true', () => {
    render(<Button isLoading={true} />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });
});

