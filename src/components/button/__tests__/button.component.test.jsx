import { render, screen } from '@testing-library/react';
import Button, { BUTTON_TYPES_CLASSES } from '../button.component';

describe('Button component', () => {
  it('should render the base button when nothing is passed', () => {
    render(<Button />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveStyle('background-color: rgb(0, 0, 0)');
  });

  it('should render google button when buttonType is google', () => {
    render(<Button buttonType={BUTTON_TYPES_CLASSES.google} />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveStyle('background-color: rgb(66, 133, 244)');
  });

  it('should render inverted button when buttonType is inverted', () => {
    render(<Button buttonType={BUTTON_TYPES_CLASSES.inverted} />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveStyle('background-color: rgb(255, 255, 255)');
  });

  it('should be disabled when isLoading is true', () => {
    render(<Button isLoading={true} />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });
});

