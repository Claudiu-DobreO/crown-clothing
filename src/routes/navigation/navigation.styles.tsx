import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NavigationContainer = styled.div`
	height: 70px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25px;
	position: relative;

	@media screen and (max-width: 800px) {
		height: 60px;
		margin-bottom: 15px;
		flex-wrap: wrap;
	}
`;

export const LogoContainer = styled(Link)`
	height: 100%;
	width: 70px;
	padding: 25px;

	@media screen and (max-width: 800px) {
		width: 70px;
		padding: 20px;
	}

	@media screen and (max-width: 500px) {
		width: 70px;
		padding: 18px;
	}

	.logo {
		height: 100%;
		width: auto;
		max-height: 100%;
		max-width: 100%;
	}
`;

export const NavLinks = styled.div`
	width: 50%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 20px;

	@media screen and (max-width: 800px) {
		width: auto;
		gap: 10px;
	}
`;

export const NavLink = styled(Link)`
	padding: 10px 15px;
	cursor: pointer;
	text-transform: uppercase;
	text-decoration: none;
	color: black;
	font-weight: 500;

	@media screen and (max-width: 800px) {
		padding: 8px 10px;
		font-size: 12px;
	}
`;

export const NavLinkSpan = styled.span`
	padding: 10px 15px;
	cursor: pointer;
	text-transform: uppercase;
	color: black;
	font-weight: 500;

	@media screen and (max-width: 800px) {
		padding: 8px 10px;
		font-size: 12px;
	}
`;

