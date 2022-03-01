import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { useUserUpdate, useUser } from '../contexts/userProvider';

export async function middleware(req, event) {
	const access_token = req.cookies.access_token ? req.cookies.access_token : false;
	const refresh_token = req.cookies.refresh_token ? req.cookies.refresh_token : false;
	const inLandingPage = req.nextUrl.pathname === '/';
	const hasTokens = access_token && refresh_token;
	const url = req.nextUrl.clone();
	url.pathname = '/';

	if (!hasTokens && !inLandingPage) {
		console.log(req.nextUrl.pathname);
		console.log('hello');
		console.log(url);
		return NextResponse.rewrite(url);
	}
	// if (hasTokens && inLandingPage) {
	// 	console.log(true);
	// 	const response = await fetch(process.env.BACKEND_API_UR + '/users/me', {
	// 		headers: {
	// 			Authorization: `Bearer ${access_token}`,
	// 			'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
	// 			accept: '*/*',
	// 		},
	// 	});
	// 	const data = await response.json();
	// 	const isNewUser = data.type === null || data.type === '';
	// 	const isResearcher = data.type === 'researcher';
	// 	const isAdviser = data.type === 'adviser';
	// 	const isModerator = data.type === 'moderator';

	// 	if (isNewUser) return NextResponse.redirect('/');
	// 	if (isResearcher) return NextResponse.redirect(`/workspaces?user=${data.id}`);
	// }
}
