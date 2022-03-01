import React from "react";
import Image from "next/image";
import styles from "./deptCard.module.scss";

function DeptCard(props) {
	const { deptName, children, actions } = props;
	return (
		<>
			<article className={styles.card}>
				<h4 className={styles.card_name}>{deptName}</h4>
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

export default DeptCard;
