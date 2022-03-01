import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function PdfViewer({ file }) {
	const defaultLayoutPluginInstance = defaultLayoutPlugin();
	console.log(file);

	return (
		<>
			{file && (
				<Worker workerUrl='https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.js'>
					<div
						style={{
							height: '750px',
							width: '100%',
							marginLeft: 'auto',
							marginRight: 'auto',
						}}
					>
						<Viewer theme='dark' fileUrl={file} plugins={[defaultLayoutPluginInstance]} />
					</div>
				</Worker>
			)}
		</>
	);
}

export default PdfViewer;
