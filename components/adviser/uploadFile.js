import React from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { Button, TextField } from '@mui/material';
import { useSnackBarUpdate } from '../../contexts/useSnackBar';

function UploadFile({ institutionID, articleList, setArticleList }) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({});
	const snackBarUpdate = useSnackBarUpdate();

	async function uploadFile(data, e) {
		e.preventDefault();
		console.log(data);

		const { pdf, title, abstract } = data;

		const formData = new FormData();

		formData.append('pdf', pdf[0], pdf[0].name);
		formData.append('title', title);
		formData.append('abstract', abstract);
		formData.append('status', 'published');
		formData.append('institution', institutionID);

		const responseUploadFile = await fetch(process.env.BACKEND_API_UR + `/publications/`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: formData,
		});
		const resultUpload = await responseUploadFile.json();
		console.log(resultUpload);
		setArticleList([...articleList, resultUpload]);
		snackBarUpdate(true, 'Article Published!');
	}
	return (
		<>
			<form
				// className={styles.editProfile_form}
				onSubmit={handleSubmit(uploadFile)}
			>
				<TextField fullWidth label='Title' sx={{ mb: 2 }} {...register('title')} />
				<TextField
					fullWidth
					label='Abstract'
					sx={{ mb: 2 }}
					multiline
					minRows={7}
					{...register('abstract')}
				/>
				<input type='file' {...register('pdf')} />
				<br></br>
				<br></br>
				<br></br>
				<Button type='submit'>Upload</Button>
			</form>
		</>
	);
}

export default UploadFile;
