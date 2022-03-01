import Image from 'next/image';
import React from 'react';
import styles from './utilityCard.module.scss';

function UtilityCard(props) {
	const { illustration, title, children, actions } = props;
	return (
		<article className={styles.card}>
			<div className={styles.card__img}>
				<Image
					src={illustration}
					layout='fill'
					objectFit='contain'
					className={styles.card__illustration}
					alt='Card Illustration'
				></Image>
			</div>
			<h3 className={styles.card_title}>{title}</h3>
			{children}
			{actions && (
				<>
					<div className={styles.card__action}>{actions}</div>
					<div className={styles.overlay}></div>
				</>
			)}
		</article>
	);
}

export default UtilityCard;
