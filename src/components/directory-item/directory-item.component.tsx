import { useNavigate } from 'react-router-dom';
import { Category } from '../../store/categories/category.types';
import { 
    BackgroundImage, 
    Body, 
    DirectoryItemContainer 
} from './directory-item.styles.jsx';

type DirectoryItemProps = {
	category: Category;
}

const DirectoryItem = ({ category }: DirectoryItemProps) => {
    const navigate = useNavigate();
	const { imageUrl, title, route } = category;

    const onNavigateHandler = () => navigate(route);

	return (
        <DirectoryItemContainer onClick={onNavigateHandler}>
            <BackgroundImage $imageUrl={imageUrl} />
            <Body>
                <h2>{title}</h2>
                <p>Shop Now</p>
            </Body>
        </DirectoryItemContainer>
	);
};

export default DirectoryItem;