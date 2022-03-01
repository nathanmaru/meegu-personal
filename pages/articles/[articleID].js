import React from 'react';
import ArticleInfoSection from '../../components/articleInfoSection';
import PdfViewer from '../../components/pdfViewer';
import ReviewSection from '../../components/reviewSection';
import PageLayout from '../../layouts/pageLayout';
import styles from './article.module.scss';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ArticleViewer({ article }) {
	const [expanded, setExpanded] = React.useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const pdfFile = article.recommendation ? article.recommendation.file.pdf : article.pdf;
	const richTextFile = article.recommendation && article.recommendation.file.richText;
	console.log(richTextFile);

	return (
		<div className={styles.page__container}>
			<header className={styles.page__header}>
				<h1 className={styles.article__title}>{article.title}</h1>
			</header>
			<main className={styles.page__content}>
				<div>
					{pdfFile ? (
						<PdfViewer file={pdfFile} />
					) : (
						<div
							className='article-content'
							dangerouslySetInnerHTML={{ __html: richTextFile }}
						/>
					)}
				</div>
				<div className={styles.toggle__div}>
					<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel1bh-content'
							id='panel1bh-header'
						>
							<Typography sx={{ width: '100%', flexShrink: 0 }}>
								Article Information
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<ArticleInfoSection article={article} />
							<ReviewSection />
						</AccordionDetails>
					</Accordion>
					<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel2bh-content'
							id='panel2bh-header'
						>
							<Typography sx={{ width: '100%', flexShrink: 0 }}>Reviews</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<ReviewSection />
						</AccordionDetails>
					</Accordion>
				</div>
				<ReviewSection />
			</main>
		</div>
	);
}

export async function getServerSideProps(context) {
	const { req, query } = context;
	const props = {};

	const request = await fetch(process.env.BACKEND_API_UR + `/publications/${query.articleID}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${req.cookies.access_token}`,
		},
	});
	const result = await request.json();
	console.log(result);
	props.article = result;

	return { props };
}
ArticleViewer.Layout = PageLayout;
export default ArticleViewer;
