import React, { useState } from "react";
import ArticleCard from "../reusable/articleCard";
import styles from "./tabs/tabs.module.scss";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

import fileImg from "../../public/file_illustration.svg";

import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";

function SelectFile({
	institutionID,
	recommendationList,
	setRecommendationList,
	articleList,
	setArticleList,
}) {
	const [selectedRecommendation, setSelectedRecommendation] = useState();

	const handleChange = (event) => {
		setSelectedRecommendation(event.target.value);
	};

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({});

	async function addFromSelect(data, e) {
		e.preventDefault();
		console.log(data, selectedRecommendation);

		// const { article, title, abstract } = data;
		const { article, title, abstract } = data;

		const formData = new FormData();

		// formData.append("pdf", pdf[0], pdf[0].name);
		formData.append("title", title);
		formData.append("abstract", abstract);
		formData.append("status", "published");
		formData.append("article", selectedRecommendation.id);
		formData.append("institution", institutionID);

		const responsePostFromSelect = await fetch(
			process.env.BACKEND_API_UR + `/publications/`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${Cookies.get("access_token")}`,
				},
				body: formData,
			}
		);
		const resultUpload = await responsePostFromSelect.json();
		console.log(resultUpload);
		setArticleList([resultUpload, ...articleList]);
	}

	return (
		<>
			<div>
				<form autoComplete="off" onSubmit={handleSubmit(addFromSelect)}>
					<TextField
						fullWidth
						label="Title"
						sx={{ mb: 2 }}
						{...register("title")}
					/>
					<TextField
						fullWidth
						label="Abstract"
						sx={{ mb: 2 }}
						multiline
						rows={5}
						{...register("abstract")}
					/>

					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">
							Select from Recommendation
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={selectedRecommendation}
							label="Select from Recommendation"
							onChange={handleChange}
							sx={{ mb: 3 }}
						>
							{recommendationList?.map((item) => (
								<MenuItem value={item} key={item.id}>
									<div className="bg-red-100 p-2">
										<p>{item.title}</p>
									</div>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Button type="submit">Upload</Button>
				</form>
				{/* {recommendationList?.map((item) => (
					<div className={styles.containerItem}>
						<ArticleCard
							key={item.id}
							title={item.title}
							subtitle={item.adviser.first_name + " " + item.adviser.last_name}
							content={item.description}
							illustration={fileImg}
							actions={
								<>
									<Button variant="contained">Open</Button>
								</>
							}
						>
							<Button onClick={() => addFromSelect(item.id)}>
								Add to Articles
							</Button>
						</ArticleCard>
					</div>
				))} */}
			</div>
		</>
	);
}

export default SelectFile;
