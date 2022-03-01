import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import { set } from 'react-hook-form';
import { useUser } from '../contexts/userProvider';
import { useAuthenticate } from './useAuthenticate';

// check if the user is new

function useCheckNewUser() {
	const authenticate = useAuthenticate();
	const user = useUser();
	const router = useRouter();
	const [isNew, setIsNew] = useState(false);

	useEffect(() => {
		authenticate();
	}, []);

	useEffect(() => {
		if (user) {
			const userType = user.type;
			if (userType == '' || userType == null) {
				setIsNew(true);
			}
		}
	}, [user]);

	return isNew;
}

export default useCheckNewUser;
