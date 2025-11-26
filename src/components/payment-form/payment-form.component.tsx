import { useState, FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import { BUTTON_TYPES_CLASSES } from '../button/button.component';
import { PaymentFormContainer, FormContainer, PaymentButton } from './payment-form.styles';
import { selectCartTotal } from '../../store/cart/cart.selector';
import { selectCurrentUser } from '../../store/user/user.selector';

const isValidCardElement = (card: StripeCardElement | null): card is StripeCardElement => card !== null;

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const amount = useSelector(selectCartTotal);
    const currentUser = useSelector(selectCurrentUser);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const paymentHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        try {
            setIsProcessingPayment(true);
            const response = await fetch(`/.netlify/functions/create-payment-intent`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: amount * 100 }),
            });
            const data = await response.json();
            console.log({ data });

            const { paymentIntent: { client_secret } } = data;

            const cardDetails = elements.getElement(CardElement);
            
            if (!isValidCardElement(cardDetails)) return;

            const paymentResult = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: cardDetails,
                    billing_details: {
                        name: currentUser ? currentUser.displayName : 'Guest',
                    },
                },
            });
            console.log({ paymentResult });

            setIsProcessingPayment(false);

            if (paymentResult.error) {
                alert(paymentResult.error.message);
            } else {
                if (paymentResult.paymentIntent.status === 'succeeded') {
                    alert('Payment successful');
                }
            }
        } catch (error) {
            console.log({ error });
        }
    }

	return (
		<PaymentFormContainer onSubmit={paymentHandler}>
            <h2>Credit Card Payment: </h2>
            <FormContainer>
                <CardElement />
			    <PaymentButton 
                    isLoading={isProcessingPayment} 
                    buttonType={BUTTON_TYPES_CLASSES.inverted}
                    type="submit"
                >
                    Pay Now
                </PaymentButton>
            </FormContainer>

		</PaymentFormContainer>
	);
};

export default PaymentForm;