import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from './chips.module.scss';

export default function ChipList(props) {
	/*
    Props: list of chips with value, label and route
    */
	const { chips, defaultVal } = props;
	const [chipActive, setChipActive] = useState(defaultVal);
	const router = useRouter();
	console.log(router.query);
	console.log(chipActive);

	useEffect(() => {
		setChipActive(defaultVal);
	}, [defaultVal]);

	function onChipClick(chip, e) {
		e.preventDefault();
		setChipActive(chip.value);
		if (chip.route) {
			router.push(chip.route);
		}
	}
	return (
		<div className={styles.chip_list}>
			{chips.map((chip) => (
				<button
					key={chip.value}
					onClick={(e) => onChipClick(chip, e)}
					className={`${styles.chip} ${chip.value == chipActive ? styles.active : 'no'}`}
				>
					{chip.label}
				</button>
			))}
		</div>
	);
}
