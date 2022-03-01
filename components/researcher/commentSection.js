import React, { useState, useEffect } from 'react';
import styles from './commentSection.module.scss';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';

import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { useUser } from '../../contexts/userProvider';
import moment from 'moment-timezone';

function CommentSection({ fileID }) {
	const user = useUser();
	const [commentList, setCommentList] = useState([]);

	const { register, handleSubmit, resetField } = useForm();

	useEffect(() => {
		async function fetchComments() {
			const request = await fetch(
				process.env.BACKEND_API_UR + `/classrooms/comments?file=${fileID}`,
				{
					headers: {
						Authorization: `Bearer ${Cookies.get('access_token')}`,
					},
				}
			);
			const result = await request.json();
			console.log(result);
			setCommentList(result);
		}
		fetchComments();
	}, []);

	async function addComment(data) {
		// e.preventDefault();
		console.log(data);
		const request = await fetch(process.env.BACKEND_API_UR + `/classrooms/comments`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({
				author: user?.id,
				content: data.content,
				file: fileID,
			}),
		});
		const result = await request.json();

		console.log(result);
		setCommentList([result, ...commentList]);
		resetField('content');
	}

	function enterSubmit(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			handleSubmit(addComment)();
		}
	}
	return (
		<section className={styles.comment__section}>
			<h2>Comments</h2>
			<form onSubmit={handleSubmit(addComment)}>
				<TextField
					fullWidth
					multiline
					minRows={4}
					label='Type something to comment'
					onKeyDown={enterSubmit}
					{...register('content')}
				/>
			</form>
			<ul className={styles.comment__list}>
				{commentList?.map((comment) => (
					<li key={comment.id} className={styles.comment}>
						<Avatar
							src={comment.author?.profileImage}
							alt={`${comment.author?.first_name}'s Profile Picture`}
						/>
						<div className={styles.comment__content}>
							<p className={styles.comment__author}>
								{comment.author?.first_name} {comment?.author.last_name}
							</p>
							<p className={styles.comment__timeStamp}>
								<em>{moment(comment?.dateUpdated).fromNow()}</em>
							</p>
							<p className={styles.comment__message}>{comment?.content}</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}

export default CommentSection;
