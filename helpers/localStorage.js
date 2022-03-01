// access token CRUD
export const setAccessToken = (value) => {
	if (process.browser) {
		localStorage.setItem('access_token', value);
	}
};

export const getAccessToken = () => {
	let access_token;

	if (typeof window !== 'undefined') return window.localStorage.getItem('access_token');

	if (process.browser) {
		access_token = localStorage.getItem('access_token');
	}
	return access_token;
};

export const removeAccessToken = () => {
	if (process.browser) {
		localStorage.removeItems('access_token');
	}
};

export const getRefreshToken = () => {
	let refresh_token;

	if (process.browser) {
		refresh_token = localStorage.getItem('refresh_token');
	}
	return refresh_token;
};
