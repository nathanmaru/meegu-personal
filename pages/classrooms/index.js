import React, { useState } from 'react';
import PageLayout from '../../layouts/pageLayout';
import Link from 'next/link';

import workspaceIllustration from '../../public/workspace-illustration.png';

import styles from '../../styles/classrooms.module.scss';
import UtilityCard from '../../components/reusable/utilityCard';

import { Button } from '@mui/material';
import Image from 'next/image';
import emptyIllustration from '../../public/not-found.svg';

function index({ classrooms }) {
	console.log(classrooms);

	return (
		<>
			<h1 className={styles.page_title}>Classrooms</h1>

			{classrooms.length > 0 ? (
				<div className={styles.cardContainer}>
					{classrooms.map((classroom) => (
						<Link key={classroom.id} href={`/classrooms/${classroom.id}/`}>
							<a>
								<UtilityCard
									title={classroom.name}
									illustration={workspaceIllustration}
									// actions={
									// 	<>
									// 			<Button>Open</Button>
									// 		</Link>
									// 	</>
									// }
								></UtilityCard>
							</a>
						</Link>
					))}
				</div>
			) : (
				<div className={styles.emptyContainer}>
					<div className={styles.illustration}>
						<Image
							src={emptyIllustration}
							layout='fill'
							objectFit='contain'
							className={styles.illustration}
							alt='Empty Classroom Illustration'
						></Image>
					</div>
					<p>
						You have no monitored classrooms yet.
						{/* <strong>Create now </strong> */}
					</p>
				</div>
			)}
		</>
	);
}

export async function getServerSideProps(context) {
	const { req, res } = context;
	const access_token = req.cookies.access_token;
	const props = {};

	const response = await fetch(process.env.BACKEND_API_UR + `/workspaces?isAdviser=${true}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
	});

	const result = await response.json();
	// console.log(result);
	props.classrooms = result;

	return { props };
}

index.Layout = PageLayout;
export default index;
