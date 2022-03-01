import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './notice.module.scss';
function NoSubscriptionNotice() {
	const router = useRouter();
	const institutionID = router.query?.id;
	console.log(router);
	return (
		<div className={styles.notice}>
			<div className={styles.notice__icon}></div>
			<div className={styles.notice__content}>
				<h3 className={styles.notice__title}>Hello Again!</h3>
				<p className={styles.notice__message}>
					We notice that you haven&#39;t subscribe to any subscription plans yet that means you
					can&#39;t add publications and resources yet. And that&#39;s sucks!
				</p>
				<Button
					onClick={() => router.replace(`/institutions/${institutionID}?tab=subscription`)}
				>
					Get your free plan!
				</Button>
			</div>
		</div>
	);
}

export default NoSubscriptionNotice;
