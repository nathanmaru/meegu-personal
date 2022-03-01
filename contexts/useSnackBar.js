import React, { useContext, useState } from 'react';

const SnackBarContext = React.createContext();
const SnackBarUpdateContext = React.createContext();

export function useSnackBar() {
	return useContext(SnackBarContext);
}
export function useSnackBarUpdate() {
	return useContext(SnackBarUpdateContext);
}

export function SnackBarProvider({ children }) {
	const [snackBar, setSnackBar] = useState({
		open: false,
		message: '',
	});

	function updateSnackBar(open, message) {
		setSnackBar({ open, message });
	}

	return (
		<SnackBarContext.Provider value={snackBar}>
			<SnackBarUpdateContext.Provider value={updateSnackBar}>
				{children}
			</SnackBarUpdateContext.Provider>
		</SnackBarContext.Provider>
	);
}
