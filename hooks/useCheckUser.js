import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import { useUser } from '../contexts/userProvider';

export default function useCheckUser() {
	const user = useUser();
	const router = useRouter();
	function check() {
		if (user) {
			const userType = user.type;
			console.log('fromn chekc', userType);
			switch (userType) {
				case 'researcher':
					router.push(`/workspaces?user=${user.id}`);
					break;
				case 'adviser':
					router.push(`/classrooms?user=${user.id}`);
					break;
				case 'moderator':
					router.push(`/institutions?user=${user.id}`);
					break;

				default:
					router.replace('/register');
					break;
			}
		}
	}

	return check;
}
