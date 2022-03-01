import { createTheme } from '@mui/material/styles';

export const outsideTheme = createTheme({
	palette: {
		type: 'light',
		primary: {
			main: '#7c86ff',
			dark: '#5b62b2',
			light: '#9ba3ff',
			contrastText: 'rgba(255,255,222,0.87)',
		},
		secondary: {
			main: '#ea5a5a',
		},
		error: {
			main: 'rgba(255,117,113,0.89)',
			contrastText: 'rgba(255,255,255,0.87)',
		},
		warning: {
			main: '#ffd7a8',
			contrastText: 'rgba(255,255,255,0.87)',
		},
		success: {
			main: '#79ff7f',
			contrastText: 'rgba(255,255,255,0.87)',
		},
		info: {
			main: '#8dcfff',
			contrastText: 'rgba(255,255,255,0.87)',
		},
	},
	components: {
		MuiListItemButton: {
			styleOverrides: {
				root: {
					':hover': { color: '#9ba3ff' },
					'&.Mui-selected': {
						backgroundColor: 'rgba(229, 231, 235, 1)',
					},
				},
			},
		},
		MuiListItemIcon: {
			styleOverrides: {
				root: {
					width: '10px',
					':hover': { color: 'rgba(229, 231, 235, 1)', color: '#9ba3ff' },
				},
			},
		},
	},
	overrides: {
		MuiAppBar: {
			colorInherit: {
				backgroundColor: 'transparent',
				color: '#374151',
			},
		},
	},
	props: {
		MuiAppBar: {
			color: 'inherit',
		},
	},
});
