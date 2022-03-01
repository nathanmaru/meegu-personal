import { Button } from '@mui/material';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PdfViewer from '../../../components/pdfViewer';
import QuillEditor from '../../../components/quillEditor';
import { useSnackBarUpdate } from '../../../contexts/useSnackBar';
import PageLayout from '../../../layouts/pageLayout';
import styles from './resourceEditor.module.scss';

function ResourceEditor({ resource }) {
	const [resourceInfo, setResourceInfo] = useState(resource);
	const [quillContent, setQuillContent] = useState(resourceInfo.richText);
	const [isPreview, setIsPreview] = useState(false);
	const { register, handleSubmit } = useForm({
		defaultValues: {
			name: resourceInfo.name,
		},
	});
	const snackBarUpdate = useSnackBarUpdate();

	console.log(resource?.name);
	function FileEditor() {
		return (
			<>
				{isPreview ? (
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

	async function editResource(data, e) {
		const formData = new FormData();
		formData.append('richText', quillContent);
		formData.append('name', data.name);
		const request = await fetch(process.env.BACKEND_API_UR + `/resources/${resource.id}/`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: formData,
		});
		const result = await request.json();
		console.log('this', result);

		snackBarUpdate(true, 'Changes Saved');
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
					{isPreview ? (
						<Button onClick={() => setIsPreview(false)}>Edit</Button>
					) : (
						<Button
							onClick={() => {
								setIsPreview(true);
							}}
						>
							Preview
						</Button>
					)}

					{!isPreview && <Button onClick={handleSubmit(editResource)}>Save Changes</Button>}

					{/* <IconButton>
                    <MoreHorizIcon />
                </IconButton> */}
				</div>
			</header>

			<main className={styles.page__content}>
				{resource?.pdf ? <PdfViewer file={resource?.pdf} /> : <FileEditor />}

				{/* <CommentSection fileID={file.id} /> */}
			</main>
		</div>
	);
}

export async function getServerSideProps({ req, query }) {
	const { access_token } = req.cookies;
	const { id } = query;
	const props = {};

	const request = await fetch(process.env.BACKEND_API_UR + `/resources/${id}`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
	const result = await request.json();
	console.log('this', result);
	props.resource = result;

	return { props };
}

ResourceEditor.Layout = PageLayout;

export default ResourceEditor;
