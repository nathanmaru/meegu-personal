import React, { useEffect, useState } from 'react';
import styles from './resource.module.scss';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Button, IconButton, TextField } from '@mui/material';

//validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { Box } from '@mui/system';

const access_token = Cookies.get('access_token');

import ArticleCard from '../reusable/articleCard';
import pdfImg from '../../public/pdf-file.png';
import templateImg from '../../public/template-file.png';

function ImportResource() {
	const [resourceList, setResourceList] = useState([]);
	const [selectedResource, setSelectedResource] = useState();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		resetField,
		formState: { errors },
	} = useForm({});
	async function getResource(searchText) {
		const queryLink = searchText
			? `/resources?forStudent=${true}&search=${searchText}`
			: `/resources?forStudent=${true}`;
		// request = get /resources?forStudent=true&search=data.searchText
		const request = await fetch(process.env.BACKEND_API_UR + queryLink, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`,
				'Content-Type': 'application/json',
			},
		});
		const result = await request.json();
		console.log(result);
		setResourceList(result);
	}

	function searchResource(data, e) {
		e.preventDefault();
		getResource(data.searchText);
	}

	useEffect(() => {
		getResource();
	}, []);

	async function importResource(resource) {
		console.log(resource);
		console.log(router.query.id);
		const request = await fetch(process.env.BACKEND_API_UR + '/resources/import', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${access_token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				resource,
				workspace: router.query.id,
			}),
		});
		const result = await request.json();
		console.log(result);
		router.reload();
	}
	return (
		<div>
			<header className={styles.header}>
				<form onSubmit={handleSubmit(searchResource)} className={styles.searchbox}>
					<input
						className={styles.searchinput}
						type='search'
						placeholder='Search Resources'
						{...register('searchText')}
					/>

					<IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
						<SearchIcon />
					</IconButton>
				</form>
			</header>
			<main className={styles.container}>
				{/* <Autocomplete
					disablePortal
					inputValue={selectedResource}
					onInputChange={(event, newInputValue) => {
						setSelectedUser(newInputValue);
					}}
					// value={selectedUser}
					options={resourceList}
					getOptionLabel={(option) => option.name}
					fullWidth
					// {...register('selectedUser')}
					renderInput={(params) => <TextField fullWidth {...params} label='Search Resource' />}
					renderOption={(props, option) => (
						<Box
							onClick={(event, option) => console.log(option)}
							component='li'
							// sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
							{...props}
						>
							
							<h1>{option.name}</h1>
							<p>{option.description}</p>
						</Box>
					)}
				/> */}
				{resourceList.length > 0 ? (
					<>
						{resourceList?.map((resource) => (
							<article key={resource.id}>
								{resource.pdf ? (
									<ArticleCard
										title={resource.name}
										subtitle={resource.institution.name}
										content={resource.description}
										illustration={pdfImg}
										actions={
											<>
												<Button>Open</Button>
											</>
										}
									>
										<Button onClick={() => importResource(resource.id)}>Import</Button>
									</ArticleCard>
								) : (
									<ArticleCard
										title={resource.name}
										subtitle={resource.institution.name}
										content={resource.description}
										illustration={templateImg}
										actions={
											<>
												<Button>Open</Button>
											</>
										}
									>
										<Button onClick={() => importResource(resource.id)}>Import</Button>
									</ArticleCard>
								)}
							</article>
						))}
					</>
				) : (
					<p>No resources available</p>
				)}

				{/* <article key={resource.id} className={styles.card}>
						{resource.pdf ? "PDF ni sya" : "Template ni sya"}
						<h3>{resource.name}</h3>
						<p>{resource.institution.name}</p>
						<p>{resource.description}</p>
						<button onClick={() => importResource(resource.id)}>Import</button>
						<button>Open</button>
					</article> */}
			</main>
		</div>
	);
}

export default ImportResource;
