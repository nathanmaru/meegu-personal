import { Alert, AlertTitle, Button } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackBarUpdate } from '../../../contexts/useSnackBar';
import CustomizedDialogs from '../../reusable/dialog2';
import styles from './verification.module.scss';

function VerificationTab({ institutionID }) {
	const [verification, setVerification] = useState();
	const router = useRouter();
	const access_token = Cookies.get('access_token');
	const snackBarUpdate = useSnackBarUpdate();

	const { register, handleSubmit } = useForm();

	useEffect(() => {
		async function fetchVerification() {
			console.log(access_token);
			const request = await fetch(
				process.env.BACKEND_API_UR + `/institutions/verification?institution=${institutionID}`,
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			);
			const result = await request.json();
			console.log(result);
			if (result[0]) {
				setVerification(result[0]);
			}
		}
		fetchVerification();
	}, []);

	async function sendVerification(data, e) {
		e.preventDefault();
		console.log(data);
		const formData = new FormData();
		formData.append('document', data.document[0], data.document[0].name);
		formData.append('institution', institutionID);

		const request = await fetch(process.env.BACKEND_API_UR + `/institutions/verification`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
			body: formData,
		});
		const result = await request.json();
		console.log(result);
		snackBarUpdate(true, 'Verification Send!');
	}

	return (
		<div>
			{!verification && (
				<div className={styles.verificationLayout}>
					<div className={styles.verificationItem}>
						<CustomizedDialogs
							title='Verify Institution'
							openBtn={<Button>Get Verified</Button>}
							primaryAction={
								<Button onClick={handleSubmit(sendVerification)}>Submit</Button>
							}
						>
							<form onSubmit={handleSubmit(sendVerification)}>
								<p>
									Please upload a proof that your institution exist and your are in-charge.
								</p>
								<input type='file' {...register('document')} />
							</form>
						</CustomizedDialogs>
					</div>

					<div className={styles.verificationItem}>
						<Alert severity='info' variant='outlined'>
							<AlertTitle>
								<p className={styles.header}>Not Verified !</p>
							</AlertTitle>
							{/* This is an info alert — <strong>check it out!</strong> */}
							<p className={styles.body}>
								Hello it seems that this institution is still <strong>not verified</strong>.
								That means you don&#39;t have the capacity and ability to publish articles
								and resources yet.
							</p>
						</Alert>
					</div>
				</div>
			)}

			{verification?.status == 'pending' && (
				<div className={styles.verificationItem}>
					<Alert severity='warning' variant='outlined'>
						<AlertTitle>
							<p className={styles.header}>Pending !</p>
						</AlertTitle>
						<p className={styles.body}>
							Hello it seems that this institution is still <strong>in process</strong>.
							Please bear with us.
						</p>
					</Alert>
				</div>
			)}

			{verification?.status == 'approved' && (
				<div className={styles.verificationItem}>
					<Alert severity='success' variant='outlined'>
						<AlertTitle>
							<p className={styles.header}>Verified !</p>
						</AlertTitle>
						<p className={styles.body}>
							<strong>Congratulations !</strong> we have succesfully verified your
							institution. Please enjoy our services.
						</p>
					</Alert>
				</div>
			)}
			{verification?.status == 'disapproved' && (
				<div className={styles.verificationItem}>
					<Alert severity='error' variant='outlined'>
						<AlertTitle>
							<p className={styles.header}>Denied !</p>
						</AlertTitle>
						<p className={styles.body}>
							We apologize, but this institution has been
							<strong>denied</strong> of its verification request.
						</p>
					</Alert>
				</div>
			)}
		</div>
	);
}

export default VerificationTab;
