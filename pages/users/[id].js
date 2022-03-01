import React, { useEffect, useState } from 'react';
import PageLayout from '../../layouts/pageLayout';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import styles from './profile.module.scss';

import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRef } from 'react';
import Profile from '../../components/reusable/profile';
import { Button, TextField } from '@mui/material';
import CustomizedDialogs from '../../components/reusable/dialog2';
import ChipList from '../../components/reusable/chips';
import { useUser } from '../../contexts/userProvider';
import { useRouter } from 'next/router';
import { useSnackBarUpdate } from '../../contexts/useSnackBar';
import Link from 'next/link';

const Input = styled('input')({
	display: 'none',
});

function UserProfile({ account, affliate }) {
	const [profile, setProfile] = useState(account);
	const [profilePicPreview, setProfilePicPreview] = useState(profile.profileImage);
	const [coverPhotoPreview, setcoverPhotoPreview] = useState(profile.profileCover);
	const user = useUser();
	const router = useRouter();
	const snackBarUpdate = useSnackBarUpdate();
	// console.log(router);

	const { register, handleSubmit } = useForm({
		defaultValues: {
			profileImage: profile.profileImage,
			profileCover: profile.profileCover,
			first_name: profile.first_name,
			last_name: profile.last_name,
			email: profile.email,
			about: profile.about,
			type: profile.type,
			username: profile.username,
		},
	});

	function onChangeCoverPhoto(e) {
		e.preventDefault();

		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2) {
				setcoverPhotoPreview(reader.result);
			}
		};
		reader.readAsDataURL(e.target.files[0]);
		setcoverPhoto(e.target.files[0]);
	}
	function onChangeProfilePhoto(e) {
		e.preventDefault();

		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2) {
				setProfilePicPreview(reader.result);
			}
		};
		reader.readAsDataURL(e.target.files[0]);
		setProfilePic(e.target.files[0]);
	}
	async function editProfile(data, e) {
		const { first_name, last_name, username, about, profileImage, profileCover, email } = data;

		const formData = new FormData();
		formData.append('first_name', first_name);
		formData.append('last_name', last_name);
		formData.append('username', username);
		formData.append('email', email);
		formData.append('about', about);

		console.log('form data:', data);
		console.log('form data:', data);
		if (profile.profileImage !== profileImage) {
			//profile pic is changed
			console.log('profile', profileImage);
			formData.append('profileImage', profileImage[0], profileImage[0].name);
		}
		if (profile.profileCover !== profileCover) {
			//cover has changed
			console.log('cover', profileCover);

			formData.append('profileCover', profileCover[0], profileCover[0].name);
		}

		const response = await fetch(process.env.BACKEND_API_UR + `/users/${account.id}/`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: formData,
		});
		const result = await response.json();
		setProfile(result);
		snackBarUpdate(true, 'Profile Updated!');
		console.log(result);
	}
	return (
		<div>
			<Profile
				name={profile.first_name + ' ' + profile.last_name}
				cover={profile.profileCover}
				pic={profile.profileImage}
			>
				<div className={styles.split}>
					<div>
						<h3>{profile.first_name + ' ' + profile.last_name}</h3>
						<p style={{ textTransform: 'capitalize' }}>
							<em>{profile.type}</em>{' '}
							<span>
								|
								<span className={styles.affliate}>
									{affliate[0] ? (
										<Link href={`/institutions/${affliate[0].id}`}>
											<a>{affliate[0].name}</a>
										</Link>
									) : (
										''
									)}
								</span>
							</span>
						</p>
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, in.</p>
					</div>
					<CustomizedDialogs
						openBtn={<Button>Edit</Button>}
						title='Edit Profile'
						primaryAction={<Button onClick={handleSubmit(editProfile)}>Save Changes</Button>}
					>
						<form className={styles.editProfile__form} onSubmit={handleSubmit(editProfile)}>
							<CustomizedDialogs
								openBtn={<Button>Edit Profile Picture</Button>}
								title='Edit Profile Picture'
								primaryAction={<Button>Ok</Button>}
								maxWidth='xs'
							>
								<input type='file' {...register('profileImage')} />
							</CustomizedDialogs>
							<CustomizedDialogs
								openBtn={<Button>Edit Profile Cover</Button>}
								title='Edit Profile Cover'
								maxWidth='xs'
								primaryAction={<Button>Ok</Button>}
							>
								<input type='file' {...register('profileCover')} />
							</CustomizedDialogs>
							{/* <TextField fullWidth label='Profile Picture' {...register('profileImage')} />
							<TextField fullWidth label='Profile Cover' {...register('profileCover')} /> */}
							<TextField fullWidth label='First Name' {...register('first_name')} />
							<TextField fullWidth label='Last Name' {...register('last_name')} />
							<TextField fullWidth label='Username' {...register('username')} />
							<TextField fullWidth label='Email' {...register('email')} />
							<TextField
								fullWidth
								multiline
								minRows={4}
								label='About'
								{...register('about')}
							/>
						</form>
					</CustomizedDialogs>
				</div>
			</Profile>
			<section>
				<ChipList
					chips={[
						{
							label: 'Additional Information',
							value: 'info',
							route: `/users/${user?.id}`,
						},
						{
							label: 'Works',
							value: 'works',
							route: `/users/${user?.id}?tab=works`,
						},
					]}
					defaultVal='info'
				/>

				{router.query.tab !== 'works' && (
					<>
						<h3>Joined at: </h3>
						<ul>
							{affliate?.map((val) => (
								<li key={val.id}>{val.name}</li>
							))}
						</ul>
					</>
				)}
			</section>
		</div>
	);
}

export async function getServerSideProps(context) {
	const { query, req } = context;
	const accessToken = req.cookies.access_token;
	const userID = query.id;
	const tab = query.tab;
	const props = {};

	const requestUser = await fetch(process.env.BACKEND_API_UR + `/users/${userID}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
			accept: '*/*',
		},
	});
	const resultUser = await requestUser.json();
	console.log(resultUser);
	props.account = resultUser;

	if (tab != 'works') {
		const requestInstitutionAffliate = await fetch(
			process.env.BACKEND_API_UR + `/institutions?isStaff=${true}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
		const resultInstitutionAffliate = await requestInstitutionAffliate.json();
		console.log(resultInstitutionAffliate);
		props.affliate = resultInstitutionAffliate;
	}

	// if(tab==="works"){

	// }

	return { props };
}
UserProfile.Layout = PageLayout;

export default UserProfile;
