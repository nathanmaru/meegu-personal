import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import React from 'react';
import { Box } from '@mui/system';

function CustomTabs({ tabs, defaultVal }) {
	const [value, setValue] = React.useState(defaultVal);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%', typography: 'body1' }}>
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: '#e2e2e2' }}>
					<TabList onChange={handleChange} aria-label='lab API tabs example'>
						{tabs.map((tab) => (
							<Tab key={tab.value} label={tab.label} value={tab.value} />
						))}
					</TabList>
				</Box>
				{tabs.map((tab) => (
					<TabPanel key={tab.value} value={tab.value}>
						{tab.content}
					</TabPanel>
				))}
			</TabContext>
		</Box>
	);
}

export default CustomTabs;
