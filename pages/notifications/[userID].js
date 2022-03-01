import { Button } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import PageLayout from '../../layouts/pageLayout';
import styles from './Notifications.module.scss';

function Notifications({ notifications }) {
	const router = useRouter();
	const [notificationList, setNotificationList] = useState(notifications);

	function NotificationTypes({ notification }) {
		const { type, message, redirectID, isRead, id } = notification;

		switch (type) {
			case 'verification':
				return (
					<article
						onClick={() => {
							setReadNotification(id);
							router.push(`/institutions/${redirectID}`);
						}}
						className={`${styles.notification} ${!isRead && styles.active}`}
					>
						<img alt='Notification Icon' className={styles.notification__icon}></img>
						<div>
							<p className={styles.notification__highlight}>
								We are happy to welcome your organization!
							</p>
							<p className={styles.notification__message}>
								Your verification request for institution is now approved!
							</p>
						</div>
					</article>
				);

			default:
				return (
					<article
						onClick={() => {
							setReadNotification(id);
							router.push(`/institutions/${redirectID}`);
						}}
						className={`${styles.notification} ${!isRead && styles.active}`}
					>
						<img alt='Notification Icon' className={styles.notification__icon}></img>
						<div>
							<p className={styles.notification__highlight}>
								We are happy to welcome your organization!
							</p>
							<p className={styles.notification__message}>
								Your verification request for institution is now approved!
							</p>
						</div>
					</article>
				);
				break;
		}
	}
	async function deleteAllNotification() {}
	async function setReadAllNotification() {}
	async function setReadNotification(id) {
		const request = await fetch(process.env.BACKEND_API_UR + `/notifications/${id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({ isRead: true }),
		});

		const result = await request.json();
		const updatedNotification = notificationList.map((notif) =>
			notif.id === result.id ? { ...notif, isRead: result.isRead } : notif
		);
		setNotificationList(updatedNotification);
		console.log(result);
	}

	function getRedirectLink(notif) {
		if (notif.type === 'submission') return '/classrooms/';
	}

	return (
		<>
			<header className={styles.page__header}>
				<h1 className={styles.page__title}>Notifications</h1>
				{/* <div>
					<Button onClick={deleteAllNotification}>Clear All</Button>
					<Button onClick={setReadAllNotification}>Mark all read</Button>
				</div> */}
			</header>
			<main className={styles.page__content}>
				<section className={styles.notification__list}>
					{notificationList?.map((notif) => (
						<article
							key={notif.id}
							onClick={() => {
								setReadNotification(notif.id);
								// router.push(`/institutions/${redirectID}`);
							}}
							className={`${styles.notification} ${!notif.isRead && styles.active}`}
						>
							<img alt='Notification Icon' className={styles.notification__icon}></img>
							<div>
								{!notif.isRead && (
									<p className={styles.notification__highlight}>New Notification!</p>
								)}

								<p className={styles.notification__message}>{notif.message}</p>
							</div>
						</article>
					))}
				</section>
			</main>
		</>
	);
}

export async function getServerSideProps({ req, query }) {
	const { userID } = query;
	const { access_token } = req.cookies;
	const props = {};

	console.log('Cookies:', access_token);

	const request = await fetch(process.env.BACKEND_API_UR + `/notifications?history=${true}`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
	const result = await request.json();

	props.notifications = result;
	console.log(result);

	return { props };
}

Notifications.Layout = PageLayout;

export default Notifications;
