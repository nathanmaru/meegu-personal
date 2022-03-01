import axios from 'axios';

const baseURL = 'http://localhost:8000';

const WithOutAuth = axios.create({
	baseURL,
	timeout: 5000,
	headers: { 'Content-Type': 'application/json' },
});

export default WithOutAuth;
