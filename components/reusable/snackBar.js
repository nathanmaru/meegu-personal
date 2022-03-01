import { Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';

function CustomSnackBar({ isOpen, message }) {
	const [state, setState] = useState({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	});

	const { vertical, horizontal, open } = state;

	useEffect(() => {
		setState({ ...state, open: isOpen });
	}, [isOpen]);

	const handleClick = (newState) => () => {
		setState({ open: true, ...newState });
	};

	const handleClose = () => {
		setState({ ...state, open: false });
	};
	return (
		<div>
			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={open}
				onClose={handleClose}
				message={message}
				key={vertical + horizontal}
			/>
		</div>
	);
}

export default CustomSnackBar;
