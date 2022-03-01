import { useState } from "react";

import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
} from "@mui/material";

const DialogComponent = (props) => {
	const {
		title,
		context,
		action,
		maxWidth,
		maxHeight,
		name,
		button,
		secondAction,
		noAction,
	} = props;
	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<>
			<div onClick={handleClickOpen}>{button}</div>

			<Dialog
				component="div"
				fullWidth={true}
				name={name}
				maxWidth={maxWidth}
				maxHeight={maxHeight ? maxHeight : null}
				open={open}
				onClose={handleClose}
			>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{context}</DialogContentText>
					{props.children}
				</DialogContent>

				<DialogActions sx={{ marginBottom: "20px", marginRight: "20px" }}>
					{action ? (
						<Button
							onClick={() => {
								handleClose();
								if (action.param) {
									action.handler(action.param);
								} else {
									action.handler();
								}
							}}
						>
							{action.label}
						</Button>
					) : null}
					{!noAction ? <Button onClick={handleClose}>Close</Button> : null}

					{secondAction ? (
						<Button
							color="secondary"
							onClick={() => {
								handleClose();
								if (secondAction.param) {
									secondAction.handler(secondAction.param);
								} else {
									secondAction.handler();
								}
							}}
						>
							{secondAction.label}
						</Button>
					) : null}
				</DialogActions>
			</Dialog>
		</>
	);
};

export default DialogComponent;
