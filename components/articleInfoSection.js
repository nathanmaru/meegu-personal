import React from 'react';

function ArticleInfoSection({ article }) {
	console.log(article);
	return (
		<div>
			<div>
				<h4>
					<strong>Article Title:</strong>
				</h4>
				<p style={{ marginLeft: '20px', marginBottom: '10px' }}>{article.title}</p>
				<h4>
					<strong>Institution:</strong>
				</h4>
				<p style={{ marginLeft: '20px', marginBottom: '10px' }}>{article.institution.name}</p>
				<h4>
					<strong>Abstract:</strong>
				</h4>
				<p style={{ marginLeft: '20px', marginBottom: '10px' }}>{article.abstract}</p>
				<h4>
					<strong>Citations:</strong>
				</h4>
				<p style={{ marginLeft: '20px', marginBottom: '10px' }}>
					{article.citation ? article.citation : 'None'}
				</p>
			</div>
		</div>
	);
}

export default ArticleInfoSection;
