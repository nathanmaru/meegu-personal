import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useForm, Controller } from 'react-hook-form';

import PageLayout from '../../../layouts/pageLayout';
import styles from './oneFile.module.scss';
import { useUser } from '../../../contexts/userProvider';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import QuillEditor from '../../../components/quillEditor';
import { Button } from '@mui/material';
import PdfViewer from '../../../components/pdfViewer';
import CommentSection from '../../../components/researcher/commentSection';
import { useSnackBarUpdate } from '../../../contexts/useSnackBar';

function OneFile({ file, comments }) {
	const user = useUser();
	const router = useRouter();
	const [commentList, setCommentList] = useState(comments);
	const [quillContent, setQuillContent] = useState(file.richText);
	const [fileStatus, setFileStatus] = useState(file.status);
	const snackBarUpdate = useSnackBarUpdate();
	const {
		register, // register inputs
		handleSubmit, // handle form submit
		resetField,
		setValue,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: file.name,
			richText: file.richText,
			status: file.status,
			isActive: file.isActive,
		},
	});
	const {
		register: commentRegister, // register inputs
		handleSubmit: commentSubmit, // handle form submit
		reset: commentReset,
		formState: { errors: commentErrors },
	} = useForm({});

	async function editFile(data, e) {
		e.preventDefault();
		console.log(quillContent);
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('richText', quillContent);
		const response = await fetch(process.env.BACKEND_API_UR + `/workspaces/files/${file.id}/`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: formData,
		});
		const result = await response.json();
		const { data: fileResult } = result;

		setValue('name', fileResult.name);
		snackBarUpdate(true, 'File Saved!');

		console.log(fileResult);
	}
	async function createComment(data, e) {
		e.preventDefault();
		console.log(data);
		const request = await fetch(process.env.BACKEND_API_UR + `/classrooms/comments`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({ author: user.id, content: data.content, file: file.id }),
		});
		const result = await request.json();
		console.log(result);
		setCommentList([...commentList, result]);
		commentReset({ content: '' });
	}

	async function deleteFile(e) {
		e.preventDefault();
		const response = await fetch(process.env.BACKEND_API_UR + `/workspaces/files/${file.id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({ isActive: false }),
		});
		const result = await response.json();
		router.replace(`/workspaces/${file.workspace}/`);
	}

	function checkContent() {
		console.log(quillContent);
	}

	async function submitFile() {
		// e.preventDefault();
		console.log(quillContent);
		const formData = new FormData();
		formData.append('status', 'submitted');

		const response = await fetch(process.env.BACKEND_API_UR + `/workspaces/files/${file.id}/`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: formData,
		});
		const result = await response.json();
		const { data: fileResult } = result;

		setValue('name', fileResult.name);

		console.log(fileResult);
		setFileStatus('submitted');
	}

	function FileEditor() {
		return (
			<>
				{fileStatus !== 'ongoing' ? (
					<div
						className='article-content'
						style={{ maxWidth: '90vw' }}
						dangerouslySetInnerHTML={{ __html: quillContent }}
					/>
				) : (
					<QuillEditor data={quillContent} setData={setQuillContent} />
				)}
			</>
		);
	}
	return (
		<div>
			<header className={styles.page__header}>
				<form className={styles.file__name__form}>
					<input
						className={styles.file__name}
						type='text'
						placeholder='File Name'
						{...register('name')}
					/>
				</form>
				<div>
					{fileStatus !== 'ongoing' ? null : (
						<Button onClick={handleSubmit(editFile)}>Save Changes</Button>
					)}
					{fileStatus !== 'ongoing' ? (
						<Button onClick={() => setFileStatus('ongoing')}>Edit Submission</Button>
					) : (
						<Button onClick={submitFile}>Submit File</Button>
					)}

					{/* <IconButton>
								<MoreHorizIcon />
							</IconButton> */}
				</div>
			</header>

			<main className={styles.page__content}>
				{file.pdf ? <PdfViewer file={file.pdf} /> : <FileEditor />}

				<CommentSection fileID={file.id} />
			</main>
		</div>
	);
}

export async function getServerSideProps(context) {
	const { req, res, query } = context;
	const { fileId } = query;
	const { access_token } = req.cookies;
	const props = {};

	const HEADER = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${access_token}`,
	};

	const fileInfoRequest = await fetch(process.env.BACKEND_API_UR + `/workspaces/files/${fileId}`, {
		method: 'GET',
		headers: HEADER,
	});

	const fileInfo = await fileInfoRequest.json();
	props.file = fileInfo.data;
	console.log(fileInfo.data);

	const commentsRequest = await fetch(
		process.env.BACKEND_API_UR + `/classrooms/comments?file=${fileId}`,
		{
			method: 'GET',
			headers: HEADER,
		}
	);

	const commentsResult = await commentsRequest.json();
	console.log(commentsResult);
	props.comments = commentsResult;
	return { props };
}

OneFile.Layout = PageLayout;

export default OneFile;
