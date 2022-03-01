import React from "react";

import styles from "./subsCard.module.scss";

function SubsCard(props) {
	const { title, subtitle, children, actions } = props;

	return (
		<>
			<article className={styles.card}>
				<h5 className={styles.card_subtitle}>{subtitle}</h5>
				<h2 className={styles.card_title}>{title}</h2>

				{children}
				{actions && (
					<>
						<div className={styles.card_action}>{actions}</div>
						<div className={styles.overlay}></div>
					</>
				)}
			</article>
		</>
	);
}

export default SubsCard;
