import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import Link from 'next/link';

import {
	TextField,
	Button,
	Divider,
	FormControl,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';

import PageLayout from '../../layouts/pageLayout';
import { useUser } from '../../contexts/userProvider';

import Modal from '../../components/modal';
import UtilityCard from '../../components/reusable/utilityCard';

import institutionImg from '../../public/institutions.png';
import emptyIllustration from '../../public/not-found.svg';

import styles from '../../styles/institutions.module.scss';
import Image from 'next/image';
import CustomizedDialogs from '../../components/reusable/dialog2';

function InstitutionsPage({ institutions }) {
	const user = useUser();
	const [institutionList, setInstitutionList] = useState(institutions);

	const [age, setAge] = React.useState('');

	const handleChange = (event) => {
		setAge(event.target.value);
	};

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({});

	async function createInstitution(data, e) {
		e.preventDefault();
		console.log(data);

		const { name, about, contact, email, address } = data;

		const response = await fetch(process.env.BACKEND_API_UR + `/institutions/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({
				creator: user.id,
				name,
				about,
				contact,
				email,
				address,
			}),
		});
		const result = await response.json();
		console.log(result);

		setInstitutionList([...institutionList, result]);
	}

	return (
		<>
			<h1 className={styles.page_title}>Institutions</h1>
			<div className={styles.header}>
				<CustomizedDialogs
					title='Create Institution'
					openBtn={<Button>Create Institution</Button>}
					primaryAction={<Button onClick={handleSubmit(createInstitution)}>Create</Button>}
				>
					<form
						autoComplete='off'
						onSubmit={handleSubmit(createInstitution)}
						// className={styles.createInstitutionForm}
					>
						<TextField
							fullWidth
							id='outlined-basic'
							label='Insitution Name'
							variant='outlined'
							sx={{ mb: 2 }}
							{...register('name')}
						/>
						<TextField
							fullWidth
							id='outlined-basic'
							label='About'
							variant='outlined'
							multiline
							rows={4}
							sx={{ mb: 2 }}
							{...register('about')}
						/>
						<TextField
							fullWidth
							id='outlined-basic'
							label='Contact'
							variant='outlined'
							sx={{ mb: 2 }}
							{...register('contact')}
						/>
						<TextField
							fullWidth
							id='outlined-basic'
							label='Address'
							variant='outlined'
							sx={{ mb: 2 }}
							{...register('address')}
						/>
						<TextField
							fullWidth
							id='outlined-basic'
							label='Email'
							variant='outlined'
							sx={{ mb: 2 }}
							{...register('email')}
						/>
					</form>
				</CustomizedDialogs>
			</div>

			<Divider sx={{ m: 2 }} />

			{institutionList.length > 0 ? (
				<div className={styles.cardContainer}>
					{institutionList?.map((item) => (
						<Link key={item.id} href={`/institutions/${item.id}`}>
							<a>
								<UtilityCard title={item.name} illustration={institutionImg}></UtilityCard>
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
							alt='No Institution Yet Illustration'
						></Image>
					</div>
					<p>
						You have no institutions yet. <strong>Create now </strong>
					</p>
				</div>
			)}
		</>
	);
}

export async function getServerSideProps(context) {
	const { req, res, query } = context;
	const access_token = req.cookies.access_token;
	const props = {};

	//response for get institution
	const responseGetInstitution = await fetch(
		process.env.BACKEND_API_UR + `/institutions?isOwner=${true}/`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		}
	);
	const resultInstitution = await responseGetInstitution.json();
	console.log(resultInstitution);
	props.institutions = resultInstitution;

	return { props };
}

InstitutionsPage.Layout = PageLayout;
export default InstitutionsPage;
