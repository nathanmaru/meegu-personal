import '../styles/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { DefaultSeo } from 'next-seo';
import { UserProvider } from '../contexts/userProvider';
import { SnackBarProvider } from '../contexts/useSnackBar';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { themeOptions } from '../contexts/materialThemeProvider';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme(themeOptions);

const initialOptions = {
	'client-id': process.env.PAYPAL_CLIENT_ID,
	currency: 'PHP',
	intent: 'capture',
	'data-client-token': process.env.PAYPAL_SECRET_KEY,
};

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const Layout = Component.Layout || EmptyLayout;

	useEffect(() => {
		router.events.on('routeChangeStart', () => {
			setOpen(true);
		});
		router.events.on('routeChangeComplete', () => {
			setOpen(false);
		});
		router.events.on('routeChangeError', () => {
			setOpen(false);
		});
	}, []);
	return (
		<>
			<Head>
				<title>Meegu</title>
			</Head>
			<DefaultSeo titleTemplate='%s | Meegu' defaultTitle='Meegu' />
			<ThemeProvider theme={theme}>
				<UserProvider>
					<SnackBarProvider>
						{/* <PayPalScriptProvider options={initialOptions}> */}
						<Layout>
							<Component {...pageProps} />
						</Layout>
						<Backdrop
							sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
							open={open}
						>
							<CircularProgress color='inherit' />
						</Backdrop>
						{/* </PayPalScriptProvider> */}
					</SnackBarProvider>
				</UserProvider>
			</ThemeProvider>
		</>
	);
}

const EmptyLayout = ({ children }) => <>{children}</>;

export default MyApp;
