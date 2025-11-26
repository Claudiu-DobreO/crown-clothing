import { FC, ButtonHTMLAttributes } from 'react';
import { 
	BaseButton, 
	GoogleSignInButton, 
	InvertedButton, 
	ButtonSpinner
} from './button.styles';

export enum BUTTON_TYPES_CLASSES {
	base = 'base',
	google = 'google-sign-in',
	inverted = 'inverted'
};

const getButton = (buttonType = BUTTON_TYPES_CLASSES.base): typeof BaseButton => (
	{
		[BUTTON_TYPES_CLASSES.base]: BaseButton,
		[BUTTON_TYPES_CLASSES.google]: GoogleSignInButton,
		[BUTTON_TYPES_CLASSES.inverted]: InvertedButton
	}[buttonType]
);

export type ButtonProps = {
	buttonType?: BUTTON_TYPES_CLASSES;
	isLoading?: boolean;
	className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, buttonType, isLoading = false, className, ...otherProps }: ButtonProps) => {
	const CustomButton = getButton(buttonType);
	return (
		<CustomButton className={className} disabled={isLoading} {...otherProps}>
			{isLoading ? <ButtonSpinner /> : children}
		</CustomButton>
	);
};

export default Button;