import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { createRequest } from '../axios/axiosInstances';

import useCheckUser from '../hooks/useCheckUser';
import { useAuthenticate } from '../hooks/useAuthenticate';
import { useSnackBarUpdate } from '../contexts/useSnackBar';
import { useUser } from '../contexts/userProvider';

import styles from '../styles/landing.module.scss';

import logo from '../public/meeguLogoWText.svg';

// Serves 3 purpose landing page, login page, sign up page.

export default function LandingPage() {
	const authenticate = useAuthenticate();
	const checkUser = useCheckUser();
	const user = useUser();
	const snackBarUpdate = useSnackBarUpdate();
	const router = useRouter();
	const [access_token, setAccessToken] = useState();
	const [refresh_token, setRefreshToken] = useState();

	// check if the user is already logged in

	useEffect(() => {
		console.log('user is', user);
		if (user) {
			console.log('user is set!');
			const { type } = user;

			if (type == 'researcher') return router.push(`/workspaces?user=${user.id}`);
			if (type == 'adviser') return router.push(`/classrooms?user=${user.id}`);
			if (type == 'moderator') return router.push(`/institutions?user=${user.id}`);
			if (type == '' || type == null) return router.push(`register`);
		}
	}, [user]);
	useEffect(() => {
		if (access_token && refresh_token) {
			console.log('tokens is set!');

			authenticate();
		}
	}, [access_token, refresh_token]);

	const responseGoogle = async (response) => {
		const request = await fetch(process.env.BACKEND_API_UR + '/auth/convert-token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				grant_type: 'convert_token',
				client_id: process.env.BACKEND_APP_KEY,
				client_secret: process.env.BACKEND_APP_SECRET,
				backend: 'google-oauth2',
				token: response.accessToken,
			}),
		});
		const result = await request.json();

		console.log(result);
		snackBarUpdate(true, 'Login Success');
		Cookies.set('access_token', result.access_token, { expires: 7 });
		Cookies.set('refresh_token', result.refresh_token, { expires: 7 });
		setAccessToken(result.access_token);
		setRefreshToken(result.refresh_token);
	};
	const responseFacebook = (response) => {
		console.log(response);
	};
	return (
		<div className={styles.parentContainer}>
			<header className={`${styles.wrapper} ${styles.header}`}>
				<Link href='/'>
					{/* <a>meegu</a> */}
					<Image
						src={logo}
						height={100}
						width={150}
						layout='intrinsic'
						objectFit='contain'
						className={styles.logo}
					/>
				</Link>
			</header>
			<main className={`${styles.wrapper} ${styles.main}`}>
				<section className={styles.hero}>
					<div>
						<h1 className={styles.hero__heading}>Level Up Your Research Experience</h1>
						<p className={styles.hero__text}>
							Meegu is a collaborative space for researchers, advisers, and institutions in
							creating a community that aims for easier and more meaningful research
							experience!
							{/* Meegu is a online platform that helps you make your research journey easier and
							more meaningful by connecting you to all actors of research so you can have a
							much easier and more meaningful in a system that works! */}
						</p>
					</div>
					<div className={styles.action}>
						<div>
							<FacebookLogin
								appId={process.env.FACEBOOK_CLIENT_ID}
								autoLoad={false}
								callback={responseFacebook}
								render={(renderProps) => (
									<button
										onClick={renderProps.onClick}
										className={`${styles.action__btn} ${styles.facebook}`}
									>
										Continue with Facebook
									</button>
								)}
							/>
						</div>
						<div>
							<GoogleLogin
								clientId={process.env.GOOGLE_CLIENT_ID}
								render={(renderProps) => (
									<button
										onClick={renderProps.onClick}
										disabled={renderProps.disabled}
										className={`${styles.action__btn} ${styles.google}`}
									>
										Continue with Google
									</button>
								)}
								onSuccess={(e) => responseGoogle(e)}
								onFailure={(e) => responseGoogle(e)}
							/>
						</div>
					</div>
				</section>
			</main>
			<footer className={`${styles.footer}`}>
				<div className={styles.footerSplit}>
					<div className={styles.splitItem}>
						<Link href='/'>
							{/* <a className={styles.footer__logo}> */}
							<Image
								src={logo}
								height={50}
								width={100}
								layout='intrinsic'
								objectFit='contain'
								className={styles.footerLogo}
							/>
							{/* </a> */}
						</Link>
						<p className={styles.footer__text}>
							For easier and more meaningful research journey.
						</p>
					</div>

					{/* <div className={styles.splitItem}>
						<p className={styles.footer__text}>
							For easier and more meaningful research journey.
						</p>
						 <div className={styles.footer__text}>
								<h3>Services</h3>
								<ul>
									<li>
										<a href="#">Web design</a>
									</li>
									<li>
										<a href="#">Development</a>
									</li>
									<li>
										<a href="#">Hosting</a>
									</li>
								</ul>
							</div> 
					</div> */}
				</div>
			</footer>
		</div>
	);
}
