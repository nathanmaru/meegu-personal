import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './notice.module.scss';
function VerificationNotice() {
	const router = useRouter();
	const institutionID = router.query?.id;
	console.log(router);
	return (
		<div className={styles.notice}>
			<div className={styles.notice__icon}></div>
			<div className={styles.notice__content}>
				<h3 className={styles.notice__title}>Welcome to your institution manager!</h3>
				<p className={styles.notice__message}>
					While we are happy to welcome you to our community as a moderator of this institution
					we like to confirm that your institution is existing and you have the authority to
					manage it.
				</p>
				<Button onClick={() => router.push(`/institutions/${institutionID}?tab=verification`)}>
					Let get you verified!
				</Button>
			</div>
		</div>
	);
}

export default VerificationNotice;
