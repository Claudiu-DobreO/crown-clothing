import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CategoryItem } from '../../store/categories/category.types';
import Button, { BUTTON_TYPES_CLASSES } from '../button/button.component';
import { addItemToCart } from '../../store/cart/cart.action';
import { selectCartItems } from '../../store/cart/cart.selector';
import './product-card.styles.scss';

type ProductCardProps = {
	product: CategoryItem;
	category: string;
}

const ProductCard = ({ product, category }: ProductCardProps) => {
	const { name, price, imageUrl, id } = product;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cartItems = useSelector(selectCartItems);

	const addProductToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		dispatch(addItemToCart(cartItems, product));
	};

	const handleImageClick = () => {
		navigate(`/shop/${category}/${id}`);
	};

	return (
		<div className='product-card-container'>
			<img 
				src={imageUrl} 
				alt={`${name}`} 
				onClick={handleImageClick}
				style={{ cursor: 'pointer' }}
			/>
			<div className='footer'>
				<span className='name'>{name}</span>
				<span className='price'>{price}</span>
			</div>
			<Button 
				buttonType={BUTTON_TYPES_CLASSES.inverted}
				onClick={addProductToCart}
			>
				Add to cart
			</Button>
		</div>
	)
};

export default ProductCard;