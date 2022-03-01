import axios from 'axios';

const baseURL = 'http://localhost:8000';

const getAccessToken = () => {
	let access_token;

	if (process.browser) {
		access_token = localStorage.getItem('access_token');
	}
	// console.log(access_token);
	return access_token;
};

const WithAuth = axios.create({
	baseURL,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${getAccessToken()}`,
	},
});

export default WithAuth;
