import React from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

import { Button, TextField } from "@mui/material";

function UploadResource({ institutionID, resourceList, setResourceList }) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({});

	console.log(institutionID);

	async function uploadResource(data, e) {
		e.preventDefault();
		console.log(data);

		const { pdf, name, description } = data;

		const formData = new FormData();

		formData.append("pdf", pdf[0], pdf[0].name);
		formData.append("name", name);
		formData.append("description", description);
		formData.append("institution", institutionID);
		formData.append("isActive", true);

		const responseUploadResource = await fetch(
			process.env.BACKEND_API_UR + `/resources/`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${Cookies.get("access_token")}`,
				},
				body: formData,
			}
		);
		const resultUploadResource = await responseUploadResource.json();
		console.log(resultUploadResource);
		setResourceList([resultUploadResource, ...resourceList]);
	}

	return (
		<>
			<form onSubmit={handleSubmit(uploadResource)}>
				<TextField
					fullWidth
					label="Name"
					sx={{ mb: 2 }}
					{...register("name")}
				/>
				<TextField
					fullWidth
					label="Description"
					sx={{ mb: 2 }}
					multiline
					rows={5}
					{...register("description")}
				/>
				<input type="file" {...register("pdf")} />

				<Button type="submit" variant="contained">
					Upload
				</Button>
			</form>
		</>
	);
}

export default UploadResource;
