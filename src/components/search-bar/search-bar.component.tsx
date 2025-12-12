import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCategories } from '../../store/categories/category.selector';
import { Category, CategoryItem } from '../../store/categories/category.types';
import {
	SearchBarContainer,
	SearchInput,
	SearchResultsContainer,
	SearchResultItem,
	SearchResultImage,
	SearchResultInfo,
	SearchResultName,
	SearchResultCategory,
} from './search-bar.styles';

type SearchResult = {
	product: CategoryItem;
	category: string;
};

const SearchBar = () => {
	const [searchField, setSearchField] = useState('');
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const searchBarRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const categories = useSelector(selectCategories);

	useEffect(() => {
		if (searchField === '') {
			setSearchResults([]);
			setIsDropdownOpen(false);
			return;
		}

		if (!categories || !Array.isArray(categories) || categories.length === 0) {
			setSearchResults([]);
			setIsDropdownOpen(false);
			return;
		}

		const filteredResults: SearchResult[] = [];
		
		categories.forEach((category: Category) => {
			if (category && category.items && Array.isArray(category.items)) {
				category.items.forEach((item: CategoryItem) => {
					if (item.name.toLowerCase().includes(searchField.toLowerCase())) {
						filteredResults.push({
							product: item,
							category: category.title.toLowerCase(),
						});
					}
				});
			}
		});

		setSearchResults(filteredResults);
		setIsDropdownOpen(filteredResults.length > 0);
	}, [searchField, categories]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchField(event.target.value);
	};

	const handleResultClick = (category: string, productId: number) => {
		setSearchField('');
		setIsDropdownOpen(false);
		navigate(`/shop/${category}/${productId}`);
	};

	return (
		<SearchBarContainer ref={searchBarRef}>
			<SearchInput
				type='search'
				placeholder='Search products...'
				value={searchField}
				onChange={handleInputChange}
				onFocus={() => {
					if (searchResults.length > 0) {
						setIsDropdownOpen(true);
					}
				}}
			/>
			{isDropdownOpen && searchResults.length > 0 && (
				<SearchResultsContainer>
					{searchResults.map((result) => (
						<SearchResultItem
							key={`${result.category}-${result.product.id}`}
							onClick={() => handleResultClick(result.category, result.product.id)}
						>
							<SearchResultImage
								src={result.product.imageUrl}
								alt={result.product.name}
							/>
							<SearchResultInfo>
								<SearchResultName>{result.product.name}</SearchResultName>
								<SearchResultCategory>{result.category}</SearchResultCategory>
							</SearchResultInfo>
						</SearchResultItem>
					))}
				</SearchResultsContainer>
			)}
		</SearchBarContainer>
	);
};

export default SearchBar;

