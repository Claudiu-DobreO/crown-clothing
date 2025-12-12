import styled from 'styled-components';

export const SearchBarContainer = styled.div`
	position: relative;
	width: 300px;
	margin: 0 20px;

	@media screen and (max-width: 800px) {
		width: 150px;
		margin: 0 10px;
	}

	@media screen and (max-width: 500px) {
		width: 120px;
		margin: 0 5px;
	}
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 10px 15px;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 16px;
	outline: none;
	transition: border-color 0.3s ease;

	&:focus {
		border-color: #000;
	}

	&::placeholder {
		color: #999;
	}
`;

export const SearchResultsContainer = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background-color: white;
	border: 1px solid #ccc;
	border-top: none;
	border-radius: 0 0 4px 4px;
	max-height: 400px;
	overflow-y: auto;
	z-index: 10;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	margin-top: 2px;
`;

export const SearchResultItem = styled.div`
	display: flex;
	align-items: center;
	padding: 12px 15px;
	cursor: pointer;
	border-bottom: 1px solid #f0f0f0;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: #f5f5f5;
	}

	&:last-child {
		border-bottom: none;
	}
`;

export const SearchResultImage = styled.img`
	width: 50px;
	height: 50px;
	object-fit: cover;
	margin-right: 12px;
	border-radius: 4px;
`;

export const SearchResultInfo = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

export const SearchResultName = styled.span`
	font-size: 14px;
	font-weight: 500;
	color: #333;
	margin-bottom: 4px;
`;

export const SearchResultCategory = styled.span`
	font-size: 12px;
	color: #666;
	text-transform: capitalize;
`;








