import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Cookies from 'js-cookie';
import QuillEditor from '../../../components/quillEditor';

import {
	TextField,
	Button,
	InputLabel,
	MenuItem,
	FormControl,
	Select,
	Divider,
} from '@mui/material';

import PageLayout from '../../../layouts/pageLayout';
import { useUser } from '../../../contexts/userProvider';
import Modal from '../../../components/modal.js';
import CustomizedDialogs from '../../../components/reusable/dialog2';

import styles from '../../../styles/classrooms.module.scss';
import quillEditor from '../../../components/quillEditor';
import CommentSection from '../../../components/researcher/commentSection';
import { useSnackBarUpdate } from '../../../contexts/useSnackBar';

function FileInside({ file, comments, institutions }) {
	const user = useUser();
	const [commentList, setCommentList] = useState(comments);
	const [institutionList, setInstitutionList] = useState(institutions);
	const [selectedInstitution, setSelectedInstitution] = useState();
	const [fileContent, setFileContent] = useState(file.richText);
	const snackBarUpdate = useSnackBarUpdate();

	console.log(fileContent);

	const handleChange = (event) => {
		setSelectedInstitution(event.target.value);
	};

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: file?.name,
		},
	});

	const {
		register: registerComment,
		handleSubmit: handleSubmitComment,
		setValue: setValueComment,
		formState: { errors: errorCom },
	} = useForm({});

	const {
		register: registerRecommend,
		handleSubmit: handleSubmitRecommend,
		setValue: setValueRecommend,
		formState: { errors: errorReco },
	} = useForm({});

	async function addComment(comment_data, e) {
		e.preventDefault();
		console.log(comment_data);

		const { content } = comment_data;

		const responseComment = await fetch(process.env.BACKEND_API_UR + `/classrooms/comments`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({
				author: user.id,
				file: file.id,
				content,
			}),
		});
		const resultComment = await responseComment.json();
		console.log(resultComment);

		setCommentList([resultComment, ...commentList]);
	}

	async function addRecommendation(data, e) {
		e.preventDefault();
		console.log(data, selectedInstitution);

		const response = await fetch(process.env.BACKEND_API_UR + `/classrooms/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({
				title: data.title,
				file: file.id,
				description: data.desc,
				adviser: user.id,
				institution: selectedInstitution.id,
			}),
		});

		const result = await response.json();
		snackBarUpdate(true, 'Recommendation Added!');
		console.log(result);
	}

	return (
		<>
			<div className={styles.infoLayout}>
				<h1>{file.name}</h1>
				{/* <form autoComplete='off'>
					<TextField
						fullWidth
						id='outlined-basic'
						label='File Name'
						variant='outlined'
						{...register('name')}
						autoFocus
					/>
				</form> */}
			</div>
			<Divider sx={{ m: 1 }} />
			<div className={styles.fileLayout}>
				<div className='article-content' dangerouslySetInnerHTML={{ __html: fileContent }} />
				{/* <QuillEditor isReadOnly={true} data={fileContent} setData={setFileContent} /> */}

				{/* </div> */}

				<div className={styles.rightContent}>
					<CustomizedDialogs
						openBtn={<Button>Create Recommendation</Button>}
						title='Create Recommendation'
						primaryAction={
							<Button onClick={handleSubmitRecommend(addRecommendation)}>Create</Button>
						}
					>
						<form autoComplete='off' className={styles.createRecommendationForm}>
							<TextField
								fullWidth
								id='outlined-basic'
								label='Title'
								variant='outlined'
								sx={{ mb: 2 }}
								{...registerRecommend('title')}
							/>
							<TextField
								fullWidth
								id='outlined-basic'
								label='Description'
								variant='outlined'
								multiline
								rows={4}
								sx={{ mb: 2 }}
								{...registerRecommend('desc')}
							/>
							<FormControl fullWidth>
								<InputLabel id='demo-simple-select-label'>Select Institution</InputLabel>
								<Select
									labelId='demo-simple-select-label'
									id='demo-simple-select'
									value={selectedInstitution}
									label='Select Institution'
									onChange={handleChange}
								>
									{institutionList?.map((item) => (
										<MenuItem value={item} key={item.id}>
											<div className='bg-red-100 p-2'>
												<p>{item.name}</p>
											</div>
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</form>
					</CustomizedDialogs>

					{/* <p className={styles.commentHead}>Comments (56)</p> */}

					{/* <form
						autoComplete='off'
						onSubmit={handleSubmitComment(addComment)}
						className={styles.createComment}
					>
						<TextField
							fullWidth
							id='outlined-basic'
							label='Write your comment here'
							variant='standard'
							{...registerComment('content')}
						/>
						<Button type='submit' sx={{ mt: 1 }}>
							Create
						</Button>
					</form> */}
					<CommentSection fileID={file.id} />

					{/* <div className={styles.commentList}>
						{commentList?.map((comment) => (
							<div key={comment.id} className={styles.commentItem}>
								<h6>{comment.content}</h6>
								<div className={styles.commentorInfo}>
									<p>{comment.author.first_name}</p>
									<p>{comment.author.last_name}</p>
								</div>
							</div>
						))}
					</div> */}
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const { req, res, query } = context;
	const access_token = req.cookies.access_token;
	const fileId = query.fileId;
	const props = {};

	//response for file detail
	const response = await fetch(process.env.BACKEND_API_UR + `/workspaces/files/${fileId}/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
	});

	const result = await response.json();
	console.log(result);
	props.file = result.data;

	//response for comment
	const responseComment = await fetch(
		process.env.BACKEND_API_UR + `/classrooms/comments?file=${fileId}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		}
	);

	const resultComment = await responseComment.json();
	console.log(resultComment);
	props.comments = resultComment;

	//response for get institution
	const responseGetInstitution = await fetch(
		process.env.BACKEND_API_UR + `/institutions?isStaff=${true}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		}
	);

	const resultInstitution = await responseGetInstitution.json();
	console.log(resultInstitution);
	props.institutions = resultInstitution;

	return { props };
}

FileInside.Layout = PageLayout;
export default FileInside;
