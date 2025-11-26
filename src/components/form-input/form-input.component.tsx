import { InputHTMLAttributes, FC } from 'react';
import {FormInputLabel, Input, Group } from './form-input.styles';

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
}

const FormInput: FC<FormInputProps> = ({ label, ...otherProps }) => {
	return (
		<Group>
			<Input {...otherProps} />
			{label && (
				<FormInputLabel 
					shrink={
						Boolean(otherProps.value && 
						typeof otherProps.value === 'string' && 
						otherProps.value.length > 0)
					}
				>
					{label}
				</FormInputLabel>
			)}
		</Group>
	);
};

export default FormInput;