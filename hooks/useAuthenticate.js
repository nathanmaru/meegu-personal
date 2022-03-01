import { useRouter } from 'next/router';

import { useUserUpdate } from '../contexts/userProvider';
import Cookies from 'js-cookie';
// this hook will send authentication and set userData.

export function useAuthenticate() {
	const router = useRouter();
	const userUpdate = useUserUpdate();

	const authenticate = async () => {
		let response;
		try {
			response = await fetch(process.env.BACKEND_API_UR + '/users/me', {
				headers: {
					Authorization: `Bearer ${Cookies.get('access_token')}`,
					'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
					accept: '*/*',
				},
			});
			const user = await response.json();
			console.log(user);
			userUpdate(user);
		} catch (error) {
			console.log(error);
		}
		return response;
	};
	return authenticate;
}
