import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.BACKEND_API_UR;
// const getAccessToken = () => {
// 	let access_token;

// 	if (process.browser) {
// 		access_token = localStorage.getItem('access_token');
// 	}
// 	// console.log(access_token);
// 	return access_token;
// };

// export const withOutAuth = axios.create({
// 	baseURL,
// 	timeout: 5000,
// 	headers: { 'Content-Type': 'application/json' },
// });

// export const withAuth = axios.create({
// 	baseURL,
// 	timeout: 5000,
// 	headers: {
// 		'Content-Type': 'application/json',
// 		Authorization: `Bearer ${getAccessToken()}`,
// 	},
// });

// export const withAuthMedia = axios.create({
// 	baseURL,
// 	timeout: 5000,
// 	headers: {
// 		Authorization: `Bearer ${getAccessToken()}`,
// 		'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
// 		accept: '*/*',
// 	},
// });

// export const genericReq = async (url, method, headerType, data) => {
// 	let headers;
// 	// console.log('hello', getAccessToken());
// 	console.log(Cookies.get('access_token'));
// 	try {
// 		let response;

// 		switch (headerType) {
// 			case 'withAuth':
// 				headers = {
// 					'Content-Type': 'application/json',
// 					Authorization: `Bearer ${Cookies.get('access_token')}`,
// 				};
// 				break;
// 			case 'withAuthMedia':
// 				headers = {
// 					Authorization: `Bearer ${Cookies.get('access_token')}`,
// 					'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
// 					accept: '*/*',
// 				};
// 				break;
// 			default:
// 				headers = { 'Content-Type': 'application/json' };
// 				break;
// 		}

// 		response = await axios.request({
// 			baseURL,
// 			url,
// 			method,
// 			headers,
// 			data,
// 		});
// 		return response;
// 	} catch (error) {
// 		if (error.message.includes('401')) {
// 			return { status: 401 };
// 		}
// 	}
// };

export const createRequest = async (url, method, headers, data) => {
	try {
		let response;
		response = await axios.request({
			baseURL,
			url,
			method,
			headers,
			data,
		});
		return response;
	} catch (error) {
		return { error: error };
	}
};
