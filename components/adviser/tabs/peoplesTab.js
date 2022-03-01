import React, { useEffect, useState } from 'react';
import PageLayout from '../../../layouts/pageLayout';
import PeopleCard from '../../reusable/peopleCard';
import styles from './tabs.module.scss';
import Autocomplete from '@mui/material/Autocomplete';
import fileImg from '../../../public/Files.png';
import Cookies from 'js-cookie';
import { Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import CustomizedDialogs from '../../reusable/dialog2';
import { Box } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import emptyIllustration from '../../../public/no_data_illustration.svg';
import Image from 'next/image';

function PeoplesTab({ institutionID }) {
	const [membersList, setMembersList] = useState([]);
	const [userList, setUserList] = useState([]);
	const [selectedUser, setSelectedUser] = useState();

	const [memberType, setMemberType] = React.useState('all');

	const handleChange = (event) => {
		setMemberType(event.target.value);
	};

	useEffect(() => {
		async function getMembers(type, isNotActive) {
			let queryLink = type
				? `/institutions/members?institution=${institutionID}&type=${type}`
				: `/institutions/members?institution=${institutionID}`;

			queryLink = queryLink + (isNotActive ? `&isNotActive=${true}` : '');

			console.log(queryLink);

			const responseGetMembers = await fetch(process.env.BACKEND_API_UR + queryLink, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${Cookies.get('access_token')}`,
				},
			});
			const resultMember = await responseGetMembers.json();
			console.log('members', resultMember);
			setMembersList(resultMember);
		}
		if (memberType === 'all') {
			getMembers();
		}
		if (memberType === 'researcher') {
			getMembers('researcher');
		}
		if (memberType === 'adviser') {
			getMembers('adviser');
		}
	}, [memberType]);

	const { register, handleSubmit } = useForm();

	async function fetchPeople(type) {
		let queryLink = type ? `/users?type=${type}` : '/users?exclude=moderator';
		const response = await fetch(process.env.BACKEND_API_UR + queryLink, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
		});
		const result = await response.json();
		console.log(result);

		setUserList(result.data);
	}
	async function addPeople(data, e) {
		e.preventDefault();
		// console.log(data);
		// console.log(selectedUser);

		const getUser = userList.filter(
			(val) => `${val.first_name} ${val.last_name}` === selectedUser
		);
		console.log({
			user: getUser[0].id,
			institution: institutionID,
			isActive: true,
		});

		const request = await fetch(process.env.BACKEND_API_UR + '/institutions/members', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({
				user: getUser[0].id,
				institution: institutionID,
				isActive: true,
			}),
		});
		const result = await request.json();
		console.log(result);
		setMembersList([result, ...membersList]);
	}

	useEffect(() => {
		getMembers();
		fetchPeople();
	}, []);
	console.log(userList);
	return (
		<>
			<div className={styles.wrapper_end}>
				<CustomizedDialogs
					title='Add People'
					openBtn={<Button>Add People</Button>}
					primaryAction={<Button onClick={handleSubmit(addPeople)}>Add</Button>}
				>
					<form onSubmit={handleSubmit(addPeople)}>
						<Autocomplete
							disablePortal
							inputValue={selectedUser}
							onInputChange={(event, newInputValue) => {
								setSelectedUser(newInputValue);
							}}
							// value={selectedUser}
							options={userList?.filter((array) =>
								membersList.map((val) => val.user).some((filter) => filter.id !== array.id)
							)}
							getOptionLabel={(option) => option.first_name + ' ' + option.last_name}
							fullWidth
							{...register('selectedUser')}
							renderInput={(params) => (
								<TextField fullWidth {...params} label='Search User' />
							)}
							renderOption={(props, option) => (
								<Box
									onClick={(event, option) => console.log(option)}
									component='li'
									sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
									{...props}
								>
									<img loading='lazy' width='20' src={option.profileImage} alt='' />
									{option.first_name} {option.last_name}
								</Box>
							)}
						/>
						{/* <Autocomplete
							options={userList}
							// {...register("name")}
							renderInput={(props, option) => (
								<TextField
									fullwidth
									{...params}
									label='Search user...'
									value={option.first_name + ' ' + option.last_name}
								/>
							)}
						/> */}
					</form>
				</CustomizedDialogs>
				<FormControl sx={{ m: 1, width: 150 }}>
					<InputLabel>Member Type</InputLabel>
					<Select value={memberType} label='Member Type' autoWidth onChange={handleChange}>
						<MenuItem value={'all'}>All</MenuItem>
						<MenuItem value={'adviser'}>Adviser</MenuItem>
						<MenuItem value={'researcher'}>Student Researcher</MenuItem>
					</Select>
				</FormControl>
			</div>
			<div className={styles.mainContainer}>
				{membersList.length > 0 ? (
					<div className={styles.peopleContainer}>
						{membersList?.map((member) => (
							<PeopleCard
								key={member.id}
								name={`${member.user.first_name} ${member.user.last_name}`}
								role={member.user.type}
								avatar={member.user.profileImage}
							></PeopleCard>
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
								alt='No people added yet illustration'
							></Image>
						</div>
						<p>
							There aren&#39;t any users that are affiliated to your institution.{' '}
							<strong>Add them now </strong>
						</p>
					</div>
				)}
			</div>
		</>
	);
}

export default PeoplesTab;
