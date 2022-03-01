import { Avatar, Button, TextField } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import CustomizedDialogs from './reusable/dialog2';
import Rating from '@mui/material/Rating';
import { useForm, Controller } from 'react-hook-form';
import { useUser } from '../contexts/userProvider';
import moment from 'moment-timezone';
import styles from './reviewSection.module.scss';

function ReviewSection() {
	const router = useRouter();
	const [reviewList, setReviewList] = useState([]);
	const user = useUser();
	// alert('Iam here');
	console.log('Iam here');

	const { register, handleSubmit, control } = useForm();

	useEffect(() => {
		async function fetchReviews() {
			const request = await fetch(
				process.env.BACKEND_API_UR + `/publications/reviews?article=${router.query.articleID}`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${Cookies.get('access_token')}`,
					},
				}
			);
			const result = await request.json();
			console.log(result);
			setReviewList(result);
		}
		fetchReviews();
	}, []);

	async function postReview(data, e) {
		e.preventDefault();
		console.log(data);
		const request = await fetch(process.env.BACKEND_API_UR + `/publications/reviews`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({
				comment: data.comment,
				rate: data.rating,
				article: router.query.articleID,
				user: user.id,
			}),
		});
		const result = await request.json();
		console.log(result);
		setReviewList([result, ...reviewList]);
	}
	console.log('length', reviewList.filter((val) => val.user.id === user.id).length);

	return (
		<div>
			{reviewList.filter((val) => val.user.id === user.id).length === 0 && (
				<CustomizedDialogs
					title='Add Review'
					openBtn={<Button>Add Review</Button>}
					primaryAction={<Button onClick={handleSubmit(postReview)}>Post Review</Button>}
				>
					<form>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '20px',
								marginBottom: '1rem',
							}}
						>
							<p>Rate this article: </p>
							<Controller
								name='rating'
								control={control}
								render={({ field: { onChange } }) => (
									<Rating name='rating' onChange={onChange} />
								)}
							/>
						</div>
						<TextField
							label='Type some review...'
							{...register('comment')}
							multiline
							minRows={6}
							fullWidth
						/>
					</form>
				</CustomizedDialogs>
			)}

			<ul className={styles.review__list}>
				{reviewList.length > 0
					? reviewList?.map((review) => (
							<li className={styles.review} key={review.id}>
								<Avatar
									src={review.user?.profileImage}
									alt={`${review.user?.first_name}'s Profile Picture`}
								/>
								<div className={styles.review__content}>
									<p className={styles.review__author}>
										{review.user?.first_name} {review?.user.last_name}
									</p>
									<p className={styles.review__timeStamp}>
										<em>{moment(review?.dateUpdated).fromNow()}</em>
									</p>
									<Rating readOnly value={review.rate} />
									<p className={styles.review__message}>{review?.comment}</p>
								</div>
							</li>
					  ))
					: 'No review yet'}
			</ul>
		</div>
	);
}

export default ReviewSection;
