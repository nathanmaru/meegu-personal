import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
				<link
					rel='stylesheet'
					href='https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css'
				/>
				<link rel='stylesheet' href='https://unpkg.com/open-props' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
