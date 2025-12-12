import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCategoriesMap, selectCategoriesIsLoading } from '../../store/categories/category.selector';
import { selectCartItems } from '../../store/cart/cart.selector';
import { addItemToCart } from '../../store/cart/cart.action';
import Button, { BUTTON_TYPES_CLASSES } from '../../components/button/button.component';
import Spinner from '../../components/spinner/spinner.component';
import { CategoryItem } from '../../store/categories/category.types';
import './product.styles.scss';

type ProductRouteParams = {
	category: string;
	productId: string;
};

const Product = () => {
	const { category, productId } = useParams<keyof ProductRouteParams>() as ProductRouteParams;
	const categoriesMap = useSelector(selectCategoriesMap);
	const isLoading = useSelector(selectCategoriesIsLoading);
	const cartItems = useSelector(selectCartItems);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [product, setProduct] = useState<CategoryItem | null>(null);

	useEffect(() => {
		if (category && productId && categoriesMap[category]) {
			const foundProduct = categoriesMap[category].find(
				(item) => item.id === parseInt(productId)
			);
			setProduct(foundProduct || null);
		}
	}, [category, productId, categoriesMap]);

	const handleAddToCart = () => {
		if (product) {
			dispatch(addItemToCart(cartItems, product));
		}
	};

	if (isLoading) {
		return <Spinner />;
	}

	if (!product) {
		return (
			<div className='product-not-found'>
				<h2>Product not found</h2>
				<Button onClick={() => navigate(`/shop/${category}`)}>
					Back to {category}
				</Button>
			</div>
		);
	}

	return (
		<div className='product-container'>
			<button className='back-button' onClick={() => navigate(`/shop/${category}`)}>
				← Back to {category}
			</button>
			<div className='product-details'>
				<div className='product-image-container'>
					<img src={product.imageUrl} alt={product.name} />
				</div>
				<div className='product-info'>
					<h1 className='product-name'>{product.name}</h1>
					<p className='product-category'>{category.toUpperCase()}</p>
					<p className='product-price'>${product.price}</p>
					<Button
						buttonType={BUTTON_TYPES_CLASSES.base}
						onClick={handleAddToCart}
					>
						Add to cart
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Product;

