import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import { useUser } from '../contexts/userProvider';
import useCheckNewUser from './useCheckNewUser';

// this hook will check user type and redirect them.

export function useRedirect() {
	const router = useRouter();
	const user = useUser();

	function redirect() {
		const userType = user?.type;
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
				break;
		}
	}

	return redirect;
}
