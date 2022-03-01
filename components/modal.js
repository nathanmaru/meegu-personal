import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import { maxWidth } from '@mui/system';
import React, { useState } from 'react';

function Modal(props) {
	const { button, title, children, maxWidth, primaryAction, secondaryAction } = props;
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<>
			<Button variant='outlined' onClick={handleClickOpen}>
				{button}
			</Button>
			<Dialog maxWidth={maxWidth ? maxWidth : 'sm'} open={open} onClose={handleClose}>
				<DialogTitle>{title}</DialogTitle>
				{children}
				<DialogActions>
					{primaryAction && (
						<div
							onClick={() => {
								handleClose();
							}}
						>
							{primaryAction}
						</div>
					)}
					{primaryAction && (
						<Button
							onClick={() => {
								handleClose();
								primaryAction.action();
							}}
						>
							{primaryAction.label}
						</Button>
					)}
					{secondaryAction ? (
						<Button
							onClick={() => {
								handleClose();
								secondaryAction.action();
							}}
						>
							{secondaryAction}
						</Button>
					) : (
						<Button color='secondary' onClick={handleClose}>
							Cancel
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</>
	);
}

export default Modal;
