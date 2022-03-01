import React, { useState } from 'react';
import PageLayout from '../../layouts/pageLayout';
import { useUser } from '../../contexts/userProvider';
import { createRequest } from '../../axios/axiosInstances';
import styles from '../../styles/workspaces.module.scss';
import { Button, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material';
import Modal from '../../components/modal';
import Cookies from 'js-cookie';
import Link from 'next/link';

import workspaceIllustration from '../../public/workspace-illustration.png';
import emptyIllustration from '../../public/not-found.svg';
import Image from 'next/image';

//validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useRouter } from 'next/router';
import CustomizedDialogs from '../../components/reusable/dialog2';

import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import UtilityCard from '../../components/reusable/utilityCard';

const Header = {
	'Content-Type': 'application/json',
	Authorization: `Bearer ${Cookies.get('access_token')}`,
};

function WorkspacesPage({ workspaces, type }) {
	const user = useUser();
	const router = useRouter();
	const [workspaceList, setWorkspaceList] = useState(workspaces ? workspaces : []);
	const [workspaceType, setWorkspaceType] = useState(type ? type : 'all');

	const handleChange = (event) => {
		setWorkspaceType(event.target.value);
	};

	const validationMsg = Yup.object().shape({
		name: Yup.string().required('Workspace Name is required.'),
	});

	const {
		register, // register inputs
		handleSubmit, // handle form submit
		resetField,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationMsg),
	});

	async function addWorkspace(data) {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('creator', user.id);
		formData.append('members', [user.id]);
		formData.append('isActive', true);

		const response = await createRequest('/workspaces/', 'post', Header, formData);

		resetField('name');

		setWorkspaceList([...workspaceList, response.data]);
	}

	async function deleteWorkspace(workspace) {
		const response = await createRequest(`/workspaces/${workspace}/`, 'patch', Header, {
			isActive: false,
		});
		console.log(response);
		const newList = workspaceList.filter((item) => item.id != response.data.data.id);
		console.log(newList);
		setWorkspaceList(newList);
	}

	function filterOwnerShip(e) {
		if (e.target.value == 'all') return router.push(`/workspaces?user=${user.id}`);
		router.push(`/workspaces?user=${user.id}&type=${e.target.value}`);
	}

	return (
		<>
			<h1 className={styles.page_title}>Workspaces</h1>
			<div className={styles.header}>
				<FormControl>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={workspaceType}
						onChange={(e) => {
							handleChange(e);
							filterOwnerShip(e);
						}}
					>
						<MenuItem value='all'>All Workspaces</MenuItem>
						<MenuItem value='personal'>Personal Workspaces</MenuItem>
						<MenuItem value='shared'>Shared Workspaces</MenuItem>
					</Select>
				</FormControl>
				<CustomizedDialogs
					title='Add Workspace'
					primaryAction={<Button onClick={handleSubmit(addWorkspace)}>Create</Button>}
					openBtn={<Button>Add Workspace</Button>}
				>
					<form className={styles.add_workspace_form}>
						<TextField
							fullWidth
							id='outlined-basic'
							label='Workspace Name'
							variant='outlined'
							{...register('name')}
							error={errors.name ? true : false}
							autoFocus
						/>
						<Typography sx={{ fontSize: '12px', color: 'red', fontStyle: 'italic' }}>
							{errors.name?.message}
						</Typography>
					</form>
				</CustomizedDialogs>
			</div>
			{workspaceList.length > 0 ? (
				<div className={styles.workspace_container}>
					{workspaceList.map((workspace) => (
						<Link key={workspace.id} href={`/workspaces/${workspace.id}/`}>
							<a>
								<UtilityCard title={workspace.name} illustration={workspaceIllustration}>
									<AvatarGroup max={4} className={styles.workspace_avatar_list}>
										{workspace.members.map((member) => (
											<Avatar
												key={member.id}
												alt={`${member.first_name} ${member.last_name}`}
												src={member.profileImage}
											/>
										))}
									</AvatarGroup>
								</UtilityCard>
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
							alt='No Workspaces Illustration'
						></Image>
					</div>
					<p>
						You have no workspaces yet. <strong>Create now </strong>
					</p>
				</div>
			)}
		</>
	);
}
export async function getServerSideProps(context) {
	const { req, res, query } = context;
	const userID = query.user;
	const type = query.type;
	const access_token = req.cookies.access_token;
	let response;

	const props = {};
	switch (type) {
		case 'personal':
			response = await createRequest(`/workspaces?isOwner=${true}`, 'get', {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			});
			break;
		case 'shared':
			response = await createRequest(`/workspaces?isOwner=${false}`, 'get', {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			});
			break;

		default:
			response = await createRequest(`/workspaces`, 'get', {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			});
			break;
	}

	props.workspaces = response.data;

	return { props };
}
WorkspacesPage.Layout = PageLayout;
export default WorkspacesPage;
