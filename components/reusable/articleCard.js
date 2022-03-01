import Image from 'next/image';
import React from 'react';
import styles from './articleCard.module.scss';

export default function ArticleCard(props) {
	const { illustration, title, subtitle, content, children, actions } = props;

	return (
		<>
			<article className={styles.card}>
				<div className={styles.cardSplit}>
					<div className={styles.cardItem}>
						<div className={styles.card_img}>
							<Image
								src={illustration}
								layout='fill'
								objectFit='cover'
								className={styles.card_illustration}
								alt='Article Card Illustration'
							></Image>
						</div>
					</div>

					<div className={styles.cardItem}>
						<h2 className={styles.card_title}>{title}</h2>
						<h5 className={styles.card_subtitle}>{subtitle}</h5>
						<p className={styles.card_content}>{content}</p>
					</div>
					{children}
					{actions && (
						<>
							<div className={styles.card_action}>{actions}</div>
							<div className={styles.overlay}></div>
						</>
					)}
				</div>
			</article>
		</>
	);
}
