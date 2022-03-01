import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function WorkspaceTabs(props) {
	const { activeTab } = props;
	const router = useRouter();
	return (
		<>
			<Box component='div' sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={activeTab}>
					<Tab
						onClick={() => router.push('/researcher/workspace/personal')}
						value='personal'
						label='Personal'
					></Tab>

					<Tab
						onClick={() => router.push('/researcher/workspace/shared')}
						value='shared'
						label='Shared Workspaces'
					></Tab>
				</Tabs>
			</Box>
			<div className='m-4'>{props.children}</div>
		</>
	);
}
