import React from "react";
import Image from "next/image";

import styles from "./peopleCard.module.scss";

import { AiOutlineEllipsis } from "react-icons/ai";
import {
	Avatar,
	Tooltip,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
} from "@mui/material";

function PeopleCard(props) {
	const { avatar, name, role, children, actions } = props;

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<article className={styles.card}>
				<div className={styles.cardSplit}>
					<div className={styles.cardItem}>
						<div className={styles.card_img}>
							<Avatar alt="Remy Sharp" src={avatar} />
						</div>
					</div>

					<div className={styles.cardItem}>
						<div className={styles.cardItemSplit}>
							<h4 className={styles.card_name}>{name}</h4>
							<div className="">
								<Tooltip title="Set user">
									<IconButton
										onClick={handleClick}
										size="small"
										sx={{ ml: 2 }}
										aria-controls={open ? "account-menu" : undefined}
										aria-haspopup="true"
										aria-expanded={open ? "true" : undefined}
									>
										<AiOutlineEllipsis sx={{ width: 22, height: 22 }} />
									</IconButton>
								</Tooltip>
								<Menu
									id="basic-menu"
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
									MenuListProps={{
										"aria-labelledby": "basic-button",
									}}
								>
									<MenuItem onClick={handleClose}>Inactive</MenuItem>
									<MenuItem onClick={handleClose}>Active</MenuItem>
								</Menu>
							</div>
						</div>
						<h5 className={styles.card_role}>{role}</h5>
					</div>
					{children}
					{actions && (
						<>
							<div className={styles.card_action}>{actions}</div>
							<div className={styles.overlay}></div>
						</>
					)}
				</div>
			</article>
		</>
	);
}

export default PeopleCard;
