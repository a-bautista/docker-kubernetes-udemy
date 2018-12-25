import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
	return (
	    <div>
			<h1>You are in another page.</h1>
			<Link to="/">Go back home!</Link>
	    </div>
	);
};
