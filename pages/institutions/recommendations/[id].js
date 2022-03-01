import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import PageLayout from '../../../layouts/pageLayout';
import styles from './oneRecommendation.module.scss';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CustomizedDialogs from '../../../components/reusable/dialog2';
import { useForm } from 'react-hook-form';
import { useSnackBarUpdate } from '../../../contexts/useSnackBar';
import PdfViewer from '../../../components/pdfViewer';
import CommentSection from '../../../components/researcher/commentSection';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

function OneRecommendation({ recommendation }) {
	const snackBarUpdate = useSnackBarUpdate();
	const router = useRouter();

	console.log(recommendation);

	const { register, handleSubmit } = useForm({
		defaultValues: { title: recommendation.file.name },
	});

	const [recommendationAction, setRecommendationAction] = useState('');

	const handleChange = (value) => {
		setRecommendationAction(value);
	};

	async function publishRecommendation(data, e) {
		e.preventDefault();
		console.log(data);
		const formData = new FormData();

		formData.append('title', data.title);
		formData.append('abstract', data.abstract);
		formData.append('status', 'published');
		formData.append('article', recommendation.id);
		formData.append('institution', recommendation.institution.id);
		formData.append('recommendation', recommendation.id);

		const request = await fetch(process.env.BACKEND_API_UR + `/publications/`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: formData,
		});
		const result = await request.json();
		console.log(result);
		snackBarUpdate(true, 'Recommendation Published and Accepted!');
		router.push(`/institutions/${recommendation.institution.id}?tab=articles`);
	}
	async function rejectRecommendation() {
		console.log('reject');
		const request = await fetch(
			process.env.BACKEND_API_UR + `/classrooms/${recommendation.id}/`,
			{
				method: 'PATCH',
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${Cookies.get('access_token')}`,
				},
				body: JSON.stringify({ status: 'rejected' }),
			}
		);
		const result = await request.json();
		console.log(result);
		snackBarUpdate(true, 'Recommendation Rejected!');
		router.push(`/institutions/${recommendation.institution.id}?tab=recommendations`);
	}
	return (
		<div>
			<header className={styles.page__header}>
				<h2 className={styles.recommendation__title}>{recommendation.file.name}</h2>
				<div className={styles.recommendation__actions}>
					<FormControl sx={{ minWidth: '15rem' }} fullWidth>
						<InputLabel id='demo-simple-select-label'>Choose a response Action:</InputLabel>
						<Select
							labelId='demo-simple-select-label'
							id='demo-simple-select'
							value={recommendationAction}
							label='Choose a response Action'
						>
							<MenuItem value=''>
								<em>None</em>
							</MenuItem>
							<CustomizedDialogs
								title='Publish Article'
								openBtn={
									<MenuItem onClick={() => handleChange(10)} value={10}>
										Accept and Publish
									</MenuItem>
								}
								primaryAction={
									<Button onClick={handleSubmit(publishRecommendation)}>Continue</Button>
								}
								secondaryAction={<Button>Cancel</Button>}
							>
								<form>
									<TextField
										fullWidth
										label='Title'
										sx={{ mb: 2 }}
										{...register('title')}
									/>
									<TextField
										fullWidth
										label='Abstract'
										sx={{ mb: 2 }}
										multiline
										minRows={7}
										{...register('abstract')}
									/>
								</form>
							</CustomizedDialogs>

							{/* <MenuItem value={10}>Call For Revision</MenuItem> */}
							<CustomizedDialogs
								title='Confirm Action'
								openBtn={
									<MenuItem onClick={() => handleChange(20)} value={20}>
										Reject
									</MenuItem>
								}
								primaryAction={<Button onClick={rejectRecommendation}>Continue</Button>}
								secondaryAction={<Button>Cancel</Button>}
							>
								<p>Are you sure you want to reject this recommendation?</p>
							</CustomizedDialogs>
						</Select>
					</FormControl>
				</div>
			</header>
			<main className={styles.page__content}>
				{recommendation.file.pdf ? (
					<PdfViewer file={recommendation.file.pdf} />
				) : (
					<div
						className='article-content'
						style={{ maxWidth: '90vw' }}
						dangerouslySetInnerHTML={{ __html: recommendation.file.richText }}
					/>
				)}
				<CommentSection fileID={recommendation.file.id} />
			</main>
		</div>
	);
}

export async function getServerSideProps({ req, query }) {
	const { id } = query;
	const { access_token } = req.cookies;
	const props = {};

	const request = await fetch(process.env.BACKEND_API_UR + `/classrooms/${id}/`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
	const result = await request.json();
	console.log(result);
	props.recommendation = result;

	return { props };
}
OneRecommendation.Layout = PageLayout;
export default OneRecommendation;
