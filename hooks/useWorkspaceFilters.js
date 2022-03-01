import React from 'react';
import { useRouter } from 'next/router';

export function useWorkspaceFilters() {
	const router = useRouter();
	const workspaceID = router.query.id;
	return [
		{ label: 'All', value: 'all', route: `/workspaces/${workspaceID}` },
		{
			label: 'Ongoing',
			value: 'ongoing',
			route: `/workspaces/${workspaceID}?status=ongoing`,
		},
		{
			label: 'Done',
			value: 'done',
			route: `/workspaces/${workspaceID}?status=done`,
		},
		{
			label: 'Submitted',
			value: 'submitted',
			route: `/workspaces/${workspaceID}?status=submitted`,
		},
		{
			label: 'Accepted',
			value: 'accepted',
			route: `/workspaces/${workspaceID}?status=accepted`,
		},
		{
			label: 'Rejected',
			value: 'rejected',
			route: `/workspaces/${workspaceID}?status=rejected`,
		},
		{
			label: 'Published',
			value: 'published',
			route: `/workspaces/${workspaceID}?status=published`,
		},
	];
}
