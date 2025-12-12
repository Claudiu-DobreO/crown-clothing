import styled from 'styled-components';
import Button from '../button/button.component';

export const PaymentFormContainer = styled.form`
	height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

	@media screen and (max-width: 800px) {
		height: auto;
		padding: 20px 0;
	}
`;

export const FormContainer = styled.div`
    height: 100px;
    min-width: 500px;

	@media screen and (max-width: 800px) {
		min-width: 100%;
		max-width: 500px;
	}

	@media screen and (max-width: 500px) {
		width: 100%;
	}
`;

export const PaymentButton = styled(Button)`
	margin-left: auto;
    margin-top: 30px;
`;