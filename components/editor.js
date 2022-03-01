import { useCallback, useEffect, useState } from 'react';
// import Quill from 'quill';
import 'quill/dist/quill.snow.css';

function MyEditor() {
	const [quill, setQuill] = useState();
	// const [_document, set_document] = useState(null);
	useEffect(() => {
		// set_document(document);
		// if (typeof window === 'object') {
		// 	console.log(document);
		// }
	}, []);
	const wrapperRef = useCallback((wrapper) => {
		if (wrapper == null) return;

		wrapper.innerHTML = '';

		// const editor = document.createElement('div');
		// wrapper.append(editor);
		// const q = new Quill(editor, {
		// 	theme: 'snow',
		// 	modules: { toolbar: TOOLBAR_OPTIONS },
		// });
		// q.disable();
		// q.setText('Loading...');
		// setQuill(q);
	}, []);
	return <div className='container' ref={wrapperRef}></div>;
}

export default MyEditor;
