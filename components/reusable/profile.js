import React from 'react';
import styles from './profile.module.scss';
import Image from 'next/image';

function Profile({ cover, pic, name, children }) {
	return (
		<div>
			<section className={styles.profile}>
				<div className={styles.profile__cover}>
					{cover && <Image layout='fill' objectFit='cover' src={cover} alt='Cover Photo' />}
				</div>
				<div className={styles.profile__img}>
					<div className={styles.profile__img__cirle}>
						{pic && <Image layout='fill' objectFit='cover' src={pic} alt='Profile Picture' />}
					</div>
				</div>
				<div className={styles.profile__info}>{children}</div>
			</section>
		</div>
	);
}

export default Profile;
