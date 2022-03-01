import React from 'react';
import Link from 'next/link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Avatar } from '@mui/material';
import styles from '../styles/header.module.css';

function Header() {
	return (
		<header className={styles.wrapper}>
			<div className={styles.logo}>
				<Link href={'/'}>
					<a>meegu</a>
				</Link>
			</div>
			<div>
				<NotificationsIcon />
				<Avatar>A</Avatar>
			</div>
		</header>
	);
}

export default Header;
