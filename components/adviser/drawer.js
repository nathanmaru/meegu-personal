import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
	Box,
	List,
	CssBaseline,
	Typography,
	Divider,
	IconButton,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tooltip,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';

import MenuIcon from '@mui/icons-material/Menu';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';

import { AiOutlineHome } from 'react-icons/ai';
import { RiTeamLine } from 'react-icons/ri';
import { RiBookletLine } from 'react-icons/ri';
import { BiNote } from 'react-icons/bi';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { IoLibraryOutline } from 'react-icons/io5';
import { FaUsers } from 'react-icons/fa';

import PrimarySearchAppBar from './toolbar';

const drawerWidth = 200;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(9)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

export default function CustomDrawer(props) {
	const router = useRouter();
	const { pageTitle } = props;

	const [open, setOpen] = useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const navs = [
		{
			text: 'Home',
			icon: <AiOutlineHome className='w-6 h-6 ' />,
			path: '/adviser/home',
		},
		{
			text: 'Classroom',
			icon: <RiTeamLine className='w-6 h-6 ' />,
			path: '/adviser/classroom/workspace',
		},
		{
			text: 'Library',
			icon: <IoLibraryOutline className='w-6 h-6 ' />,
			path: '/adviser/library',
		},
		{
			text: 'Notes',
			icon: <BiNote className='w-6 h-6 ' />,
			path: '/adviser/notes',
		},
		{
			text: 'Messages',
			icon: <BiMessageRoundedDetail className='w-6 h-6 ' />,
			path: '/adviser/messages',
		},
		{
			text: 'Log Out',
			icon: <LogoutIcon />,
			path: '/adviser/logout',
		},
	];

	return (
		<>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />

				<AppBar position='fixed' color='transparent' open={open} elevation={0}>
					<PrimarySearchAppBar>
						<IconButton
							color='inherit'
							aria-label='open drawer'
							onClick={handleDrawerOpen}
							edge='start'
							sx={{
								marginRight: '36px',
								...(open && { display: 'none' }),
							}}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							variant='h6'
							noWrap
							component='div'
							sx={{ marginLeft: '10px', color: 'rgba(55, 65, 81, 1)' }}
						>
							{pageTitle}
						</Typography>
					</PrimarySearchAppBar>
				</AppBar>

				<Drawer variant='permanent' hideBackdrop={true} open={open}>
					<DrawerHeader>
						{open ? (
							<Typography
								className='w-full flex justify-center '
								variant='h6'
								noWrap
								component='div'
							>
								meegu
							</Typography>
						) : null}

						<IconButton onClick={handleDrawerClose}>
							{open ? <ChevronLeftIcon /> : null}
						</IconButton>
					</DrawerHeader>

					<Divider />

					<List
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						{navs.map((item, index) => (
							<Link key={item.text} href={item.path} passHref>
								<ListItemButton key={item.text} selected={pageTitle === item.text}>
									<Tooltip title={item.text} placement='right'>
										{item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
									</Tooltip>
									<ListItemText primary={item.text} />
								</ListItemButton>
							</Link>
						))}
					</List>

					<Divider />
				</Drawer>

				<Box
					component='main'
					sx={{
						flexGrow: 1,
						p: 3,
						minHeight: '100vh',
					}}
				>
					<DrawerHeader />
					{props.children}
				</Box>
			</Box>
		</>
	);
}
