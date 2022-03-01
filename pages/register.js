import { NextSeo } from 'next-seo';
import { useUser, useUserUpdate } from '../contexts/userProvider';
import { withAuthMedia, genericReq } from '../axios/axiosInstances';
import AuthLayout from '../layouts/authLayout';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import styles from '../styles/register.module.scss';
import Image from 'next/image';

import adviser from '../public/student.png';
import moderator from '../public/principal.png';
import researcher from '../public/student-img.png';

// This page will edit the user type of the new authenticated user.

function Register() {
	const user = useUser();
	const userUpdate = useUserUpdate();
	const router = useRouter();
	console.log(user?.id);

	const userTypes = [
		{
			id: 1,
			user: 'Researcher',
			img: (
				<>
					<Image
						src={researcher}
						layout='fill'
						objectFit='contain'
						className={styles.illustration}
						alt='Researcher Illustration'
					></Image>
				</>
			),
		},
		{
			id: 2,
			user: 'Adviser',
			img: (
				<>
					<Image
						src={adviser}
						layout='fill'
						objectFit='contain'
						className={styles.illustration}
						alt='Adviser Illustration'
					></Image>
				</>
			),
		},
		{
			id: 3,
			user: 'Moderator',
			img: (
				<>
					<Image
						src={moderator}
						layout='fill'
						objectFit='contain'
						className={styles.illustration}
						alt='Moderator Illustration'
					></Image>
				</>
			),
		},
	];

	// console.log(user);

	const handleRegister = async (type) => {
		console.log(type == 'researcher');
		var data = new FormData();
		data.append('type', type);
		const response = await fetch(process.env.BACKEND_API_UR + `/users/${user?.id}/`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: data,
		});
		const result = await response.json();
		// const response = await genericReq(`/users/${user?.id}/`, 'patch', 'withAuthMedia', data);
		console.log(result);
		const userType = result.type;
		switch (userType) {
			case 'researcher':
				router.push(`/workspaces?user=${user?.id}`);
				break;
			case 'adviser':
				router.push(`/classrooms?user=${user?.id}`);
				break;
			case 'moderator':
				router.push(`/institutions?user=${user?.id}`);
				break;

			default:
				break;
		}
	};

	return (
		<>
			<NextSeo title='Check User' />
			<div className={styles.container}>
				<p className={styles.question}>What type of user are you ?</p>

				<div className={styles.userContainer}>
					{userTypes.map((item) => (
						<div
							key={item.id}
							className={styles.userCard}
							onClick={() => handleRegister(item.user.toLowerCase())}
						>
							{/* <div> */}
							<div className={styles.userCardImg}>{item.img}</div>
							{/* </div> */}
							<p className={styles.cardRole}>{item.user}</p>
						</div>
					))}
				</div>
			</div>
			{/* <div className="h-screen p-5 flex flex-col items-center justify-center">
				<p className="text-4xl text-center font-bold text-gray-500">
					What type of user are you ?
				</p>

				<div className={styles.userContainer}>
					{userTypes.map((item) => (
						<div
							key={item.id}
							className="userCard"
							onClick={() => handleRegister(item.user.toLowerCase())}
						>
							<div className="userCardImg">{item.img}</div>
							<p className="text-center mt-5">{item.user}</p>
						</div>
					))}
				</div>
			</div> */}
		</>
	);
}

Register.Layout = AuthLayout;

export default Register;
