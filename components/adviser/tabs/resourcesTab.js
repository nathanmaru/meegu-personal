import React, { useState } from 'react';
import Link from 'next/link';

import ArticleCard from '../../../components/reusable/articleCard';
import DeptCard from '../../../components/reusable/deptCard';

import styles from './tabs.module.scss';
import fileImg from '../../../public/file_illustration.svg';
import emptyIllustration from '../../../public/no_data_illustration.svg';

import Image from 'next/image';
import { Button, TextField } from '@mui/material';
import CustomizedDialogs from '../../reusable/dialog2';
import CustomTabs from '../../reusable/tabs';
import UploadResource from '../uploadResource';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

function ResourcesTab({ institution, resources }) {
	const [resourceList, setResourceList] = useState(resources);
	console.log(institution.id);
	const { register, handleSubmit } = useForm();
	const router = useRouter();

	async function addFile(data, e) {
		e.preventDefault();

		const { name, description } = data;

		const formData = new FormData();

		formData.append('name', name);
		formData.append('description', description);
		formData.append('institution', institution.id);
		formData.append('isActive', true);

		const responseUploadResource = await fetch(process.env.BACKEND_API_UR + `/resources/`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${Cookies.get('access_token')}`,
			},
			body: formData,
		});
		const resultUploadResource = await responseUploadResource.json();
		console.log(resultUploadResource);
		setResourceList([resultUploadResource, ...resourceList]);
	}
	return (
		<>
			<div className={`${styles.container} ${styles.articles}`}>
				<div className={styles.containerItem}>
					<div className={styles.createBtn}>
						<CustomizedDialogs
							openBtn={<Button>Create Resource</Button>}
							title='Add Resource'
							primaryAction={<Button>Done</Button>}
						>
							<CustomTabs
								defaultVal='quill'
								tabs={[
									{
										label: 'Create Template',
										value: 'quill',
										content: (
											<form onSubmit={handleSubmit(addFile)}>
												<TextField
													fullWidth
													sx={{ mb: 2 }}
													label='Resource Name'
													{...register('name')}
												/>
												<TextField
													fullWidth
													sx={{ mb: 2 }}
													multiline
													minRows={5}
													label='Description'
													{...register('description')}
												/>
												<Button type='submit'>Create Document</Button>
											</form>
										),
									},
									{
										label: 'Upload Pdf',
										value: 'upload',
										content: (
											<UploadResource
												institutionID={institution.id}
												resourceList={resourceList}
												setResourceList={setResourceList}
											/>
										),
									},
								]}
							/>
						</CustomizedDialogs>
					</div>
					{resourceList.length > 0 ? (
						<div>
							{resourceList.map((item) => (
								<div
									key={item.id}
									onClick={() => router.push(`/institutions/resources/${item.id}`)}
								>
									<ArticleCard
										title={item.name}
										subtitle='Resource'
										content={item.description}
										illustration={fileImg}
									></ArticleCard>
								</div>
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
									alt='No Resources yet Illustration'
								></Image>
							</div>
							<p>
								You have no resources yet. <strong>Create now </strong>
							</p>
						</div>
					)}
				</div>

				{/* <div className={styles.containerItem}>
					<DeptCard deptName="Deparment 1"></DeptCard>
				</div> */}
			</div>
		</>
	);
}

export default ResourcesTab;
