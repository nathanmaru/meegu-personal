import { useRouter } from 'next/router';
import React from 'react';
import Cookies from 'js-cookie';

import { useUser } from '../../contexts/userProvider';
import styles from './home.module.scss';

import ArticleCard from '../../components/reusable/articleCard';
import ChipList from '../../components/reusable/chips';
import fileImg from '../../public/file_illustration.svg';
import PageLayout from '../../layouts/pageLayout';

import { Button, Rating } from '@mui/material';
import { useHomeFilters } from '../../hooks/useHomeFilters';
import { useSnackBarUpdate } from '../../contexts/useSnackBar';
import StarIcon from '@mui/icons-material/Star';

function HomePage({ articles }) {
	const router = useRouter();
	const user = useUser();
	const snackBarUpdate = useSnackBarUpdate();

	function viewFile(item) {
		console.log(item);
		router.push(`/articles/${item}`);
	}

	async function postLibrary(articleID) {
		// e.preventDefault();
		// console.log(data)

		const responsePostLibrary = await fetch(process.env.BACKEND_API_UR + `/libraries/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({
				user: user.id,
				article: articleID,
			}),
		});
		const resultLibrary = await responsePostLibrary.json();
		console.log(resultLibrary);
		snackBarUpdate(true, 'Added to Library');

		// setLibraryList([...libraryList, result]);
	}

	return (
		<>
			<div className={styles.chips}>
				<ChipList
					chips={useHomeFilters()}
					defaultVal={router.query.status ? router.query.status : 'all'}
				/>
			</div>
			<div className={styles.home}>
				{articles?.map((article) => (
					<div key={article.id} onClick={() => router.push(`/articles/${article.id}`)}>
						<ArticleCard
							title={article.title}
							subtitle='PDF'
							content={article.abstract}
							illustration={fileImg}
							// actions={
							// 	<>
							// 		<Button variant='contained'>Open</Button>
							// 	</>
							// }
						>
							<div>
								<Rating value={article.rating} readOnly precision={0.25} />
								<p>{article.reviews} reviews</p>
								<Button onClick={() => postLibrary(article.id)}>Add to Library</Button>
							</div>
						</ArticleCard>
					</div>
				))}
			</div>
		</>
	);
}

export async function getServerSideProps({ req, query }) {
	const props = {};

	const request = await fetch(process.env.BACKEND_API_UR + '/publications', {
		headers: {
			Authorization: `Bearer ${req.cookies.access_token}`,
		},
	});
	const result = await request.json();
	console.log(result);
	props.articles = result;
	return { props };
}

HomePage.Layout = PageLayout;
export default HomePage;
