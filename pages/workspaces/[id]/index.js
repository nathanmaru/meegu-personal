import React, { useRef } from 'react';
import { createRequest } from '../../../axios/axiosInstances';
import Cookies from 'js-cookie';

//validation
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import styles from '../../../styles/workspaces/oneWorkspace.module.scss';
import PageLayout from '../../../layouts/pageLayout';
import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '../../../contexts/userProvider';

import ChipList from '../../../components/reusable/chips';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { Avatar, Button, TextField, Divider, Autocomplete } from '@mui/material';
import Modal from '../../../components/modal';
import CustomizedDialogs from '../../../components/reusable/dialog2';
import CustomTabs from '../../../components/reusable/tabs';
import UtilityCard from '../../../components/reusable/utilityCard';

import fileIllustration from '../../../public/file_illustration.svg';
import CreateFile from '../../../components/researcher/createFile';
import ImportResource from '../../../components/researcher/importResource';
import { useWorkspaceFilters } from '../../../hooks/useWorkspaceFilters';
import { useEffect } from 'react';

import emptyIllustration from '../../../public/no_data_illustration.svg';
import Image from 'next/image';
import { Box } from '@mui/system';

const HEADER = {
	'Content-Type': 'application/json',
	Authorization: `Bearer ${Cookies.get('access_token')}`,
};

function OneWorkspace({ workspace, files }) {
	const user = useUser();
	const validationMsg = Yup.object().shape({
		name: Yup.string().required('Workspace Name is required.'),
	});

	const router = useRouter();
	const addFileForm = useRef();
	const [advisers, setAdvisers] = useState([]);
	const [fileList, setFileList] = useState(files);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState({});
	const [members, setMembers] = useState(workspace.members);
	const [workspaceInfo, setWorkspaceInfo] = useState(workspace);
	const [selectedAdviser, setSelectedAdviser] = useState(workspaceInfo?.adviser);

	useEffect(() => {
		setFileList(files);
	}, [files]);

	// workspace info form
	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: workspace.name,
			creator: workspace.creator.first_name + ' ' + workspace.creator.last_name,
			adviser: workspace.adviser
				? workspace.adviser.first_name + ' ' + workspace.adviser.last_name
				: null,
			members: members,
		},
	});

	useEffect(() => {
		fetchAdvisers();
	}, []);

	async function editWorkspace(data, e) {
		e.preventDefault();
		console.log(data);
		const response = await fetch(process.env.BACKEND_API_UR + `/workspaces/${workspace.id}/`, {
			method: 'PATCH',
			headers: HEADER,
			body: JSON.stringify({
				name: data.name,
			}),
		});
		const result = await response.json();

		setWorkspaceInfo(result.data);

		setValue('name', result.data.name);
		// setValue('members', result.data.members);
	}

	async function fetchAdvisers() {
		const requestAdviser = await createRequest(`/users?type=adviser`, 'get', {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${Cookies.get('access_token')}`,
		});

		if (requestAdviser.error) return console.log(requestAdviser.error);
		const { data } = requestAdviser;
		setAdvisers(data.data);
	}
	async function searchResearcher(text) {
		setUsers([]);
		if (text != '') {
			const requestResearcher = await createRequest(
				`/users?type=researcher&name=${text}`,
				'get',
				{
					'Content-Type': 'application/json',
					Authorization: `Bearer ${Cookies.get('access_token')}`,
				}
			);

			if (requestResearcher.error) return console.log(requestResearcher.error);
			const { data } = requestResearcher;
			console.log(data);
			setUsers(data.data);
		} else {
			setUsers([]);
		}
	}

	async function editAdviser() {
		console.log(selectedAdviser);

		const getAdviser = advisers.filter(
			(val) => `${val.first_name} ${val.last_name}` === selectedAdviser
		);

		const response = await fetch(process.env.BACKEND_API_UR + `/workspaces/${workspace.id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({ adviser: getAdviser[0].id }),
		});
		const update = await response.json();
		console.log(update);

		setValue('adviser', update.data.adviser.first_name + ' ' + update.data.adviser.last_name);
		alert('Adviser Added take a look at the workspace info');
		setTimeout(() => {
			setSelectedAdviser('');
			setAdvisers([]);
		}, 3000);
	}

	async function addMember(data) {
		console.log(data.id);
		const memberIds = members.map((val) => val.id);
		const dataToSend = [...memberIds, data.id];
		const response = await fetch(process.env.BACKEND_API_UR + `/workspaces/${workspace.id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({ members: dataToSend }),
		});
		const update = await response.json();
		console.log(update.data);
		setMembers(update.data.members);
		alert('Member Added take a look at the workspace info');
		setTimeout(() => {
			setUsers([]);
		}, 3000);
	}

	async function deleteWorkspace(e) {
		e.preventDefault();
		const response = await fetch(process.env.BACKEND_API_UR + `/workspaces/${workspace.id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({ isActive: false }),
		});
		const result = await response.json();
		console.log(result);

		return router.replace(`/workspaces?user=${user.id}`);
	}
	async function deleteFile(file, e) {
		e.preventDefault();
		const response = await fetch(process.env.BACKEND_API_UR + `/workspaces/files/${file.id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: JSON.stringify({ isActive: false }),
		});
		const result = await response.json();
		const { data } = result;
		setFileList(fileList.filter((val) => val.id !== data.id));
	}

	return (
		<div>
			<header className={styles.page__header}>
				<h1 className={styles.page__title}>{workspace.name}</h1>
				<div className={styles.page__tools}>
					<ChipList
						chips={useWorkspaceFilters()}
						defaultVal={router.query.status ? router.query.status : 'all'}
					/>
					<div>
						<CustomizedDialogs
							maxWidth='md'
							openBtn={<Button>Add File</Button>}
							title='Add File'
						>
							<CustomTabs
								tabs={[
									{
										label: 'Create File',
										value: 'create',
										content: <CreateFile fileList={fileList} setFileList={setFileList} />,
									},
									{
										label: 'Import Resources',
										value: 'import',
										content: (
											<ImportResource fileList={fileList} setFileList={setFileList} />
										),
									},
								]}
								defaultVal='create'
							/>
						</CustomizedDialogs>
						<CustomizedDialogs
							title='Workspace Info'
							openBtn={<Button>Workspace Info</Button>}
							primaryAction={
								<Button onClick={handleSubmit(editWorkspace)}>Save Changes</Button>
							}
						>
							<form>
								<TextField fullWidth label='Workspace Name' {...register('name')} />

								<div className={styles.users}>
									<h3>Creator: </h3>
									<div className={styles.info}>
										<Avatar src={workspaceInfo.creator.profileImage} />
										<p className={styles.infoText}>
											{workspaceInfo.creator.first_name}{' '}
											{workspaceInfo.creator.last_name}
										</p>
									</div>
								</div>

								{/* <Divider sx={{ m: 2, color: "white" }} /> */}

								<div className={styles.users}>
									<h3>Adviser: </h3>
									<div className={styles.info}>
										<Avatar src={selectedAdviser?.profileImage} />
										<p className={styles.infoText}>
											{selectedAdviser?.first_name} {selectedAdviser?.last_name}
										</p>
									</div>
								</div>

								{/* <Divider sx={{ m: 2, color: "white" }} /> */}

								<div className={styles.users}>
									<h3>Members:</h3>
									<ul>
										{workspaceInfo.members.map((member) => (
											<li key={member.id}>
												<div className={styles.info}>
													<Avatar src={member.profileImage} />
													<p className={styles.infoText}>
														{member.first_name} {member.last_name}
													</p>
												</div>
											</li>
										))}
									</ul>
								</div>
								{/* <Divider sx={{ m: 2 }} /> */}
								{/* <TextField fullWidth label='Creator' disabled {...register('creator')} />
								<TextField fullWidth label='Adviser' disabled {...register('adviser')} /> */}
								<CustomizedDialogs
									title='Add Adviser'
									openBtn={<Button>Edit Adviser</Button>}
									primaryAction={<Button onClick={editAdviser}>Add</Button>}
								>
									<Autocomplete
										disablePortal
										inputValue={selectedAdviser}
										onInputChange={(event, newInputValue) => {
											setSelectedAdviser(newInputValue);
										}}
										// value={selectedUser}
										options={advisers}
										getOptionLabel={(option) =>
											option.first_name + ' ' + option.last_name
										}
										fullWidth
										renderInput={(params) => (
											<TextField fullWidth {...params} label='Search Adviser' />
										)}
										renderOption={(props, option) => (
											<Box
												onClick={(event, option) => console.log(option)}
												component='li'
												sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
												{...props}
											>
												<Avatar
													// loading='lazy'
													width='20'
													src={option.profileImage}
													alt=''
												/>
												{option.first_name} {option.last_name}
											</Box>
										)}
									/>
								</CustomizedDialogs>
							</form>
						</CustomizedDialogs>
					</div>
				</div>
			</header>
			<main>
				{fileList.length > 0 ? (
					<div className='card-container'>
						{fileList?.map((val) => (
							<UtilityCard
								key={val.id}
								title={val.name}
								illustration={fileIllustration}
								actions={
									<>
										<Button
											onClick={() => {
												router.push(`/workspaces/${workspace.id}/${val.id}`);
											}}
											className={`${styles.fileCard_action_btn} ${styles.primary}`}
										>
											Open
										</Button>
										<Button
											color='error'
											onClick={(e) => deleteFile(val, e)}
											className={`${styles.fileCard_action_btn} ${styles.error}`}
										>
											Archive
										</Button>
									</>
								}
							/>
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
								alt='No files yet Illustration'
							></Image>
						</div>
						<p>
							You have no files yet. <strong>Create now </strong>
						</p>
					</div>
				)}
			</main>
		</div>
	);
}

export async function getServerSideProps(context) {
	const { query, req } = context;
	const accessToken = req.cookies.access_token;
	const workspaceID = query.id;
	const { status } = query;
	let fileQueryLink = status
		? `/workspaces/files?workspace=${workspaceID}&status=${status}`
		: `/workspaces/files?workspace=${workspaceID}`;

	const props = {};

	// Workspace Instance

	const response = await createRequest(`/workspaces/${workspaceID}`, 'get', {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${accessToken}`,
	});

	const { data: workspace } = response.data;
	// console.log(workspace);

	props.workspace = workspace;

	// Files

	const responseFile = await createRequest(fileQueryLink, 'get', {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${accessToken}`,
	});

	const { error: error2 } = responseFile;

	const { data: files } = responseFile.data;
	props.files = files;
	console.log(files);

	return { props };
}

OneWorkspace.Layout = PageLayout;

export default OneWorkspace;
