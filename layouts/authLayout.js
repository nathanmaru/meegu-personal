import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser, useUserUpdate } from '../contexts/userProvider';
import { useAuthenticate } from '../hooks/useAuthenticate';
import Cookies from 'js-cookie';

const AuthLayout = ({ children }) => {
	const router = useRouter();
	const user = useUser();
	const location = router.pathname;
	const authenticate = useAuthenticate();
	// const checkNewUser = useCheckNewUser()

	useEffect(() => {
		console.log('location has changed');
		if (process.browser) {
			const access_token = Cookies.get('access_token');
			const refresh_token = Cookies.get('refresh_token');
			if (!access_token || !refresh_token) {
				router.push('/');
				console.log('hoy');
			}
		}

		authenticate();
		// console.log('from authlayout', res);
	}, [location]);

	return <>{children}</>;
};

export default AuthLayout;
