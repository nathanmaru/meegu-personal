// import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

export const themeOptions = {
	palette: {
		type: 'dark',
		primary: {
			main: '#a39de8',
			dark: '#5b62b2',
			light: '#9ba3ff',
			contrastText: '#edf2fd',
		},
		secondary: {
			main: '#98ada0',
			contrastText: 'rgba(255,255,255,0.87)',
		},
		error: {
			main: 'rgba(255,117,113,0.89)',
			contrastText: 'rgba(255,255,255,0.87)',
		},
		warning: {
			main: '#ffd7a8',
			contrastText: 'rgba(243,227,227,0.87)',
		},
		success: {
			main: '#79ff7f',
		},
		info: {
			main: '#8dcfff',
		},
		background: {
			default: '#0b0f1f',
		},
		text: {
			primary: '#edf2fd',
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
};
