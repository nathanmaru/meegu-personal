import React, { useState } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import styles from './quillEditor.module.scss';

export default function QuillEditor({ data, setData }) {
	const placeholder = 'Compose an epic...';
	const { quill, quillRef, Quill } = useQuill({
		placeholder,
	});

	// React.useEffect(() => {
	// 	if (quill) {
	// 		if (data) {
	// 			quill.clipboard.dangerouslyPasteHTML(data);
	// 		} else {
	// 			console.log('hurray');
	// 		}
	// 	}
	// }, [quill]);

	React.useEffect(() => {
		if (quill) {
			if (data) {
				quill.clipboard.dangerouslyPasteHTML(data);
			}
			quill.on('text-change', (delta, oldDelta, source) => {
				console.log(quill.root.innerHTML);
				setData(quill.root.innerHTML);
			});
		}
	}, [quill]);

	return (
		<div className={styles.editor}>
			<div
				ref={quillRef}
				style={{
					height: '80vh',
					borderLeft: 'none',
					borderRight: 'none',
					borderBottom: 'none',
				}}
			/>
		</div>
	);
}
