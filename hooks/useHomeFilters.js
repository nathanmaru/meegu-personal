import React from "react";
import { useRouter } from "next/router";

export function useHomeFilters() {
	const router = useRouter();
	// const workspaceID = router.query.id;
	return [
		{
			label: "All",
			value: "all",
			// route: `/workspaces/${workspaceID}`
		},
		{
			label: "Education",
			value: "education",
			// route: `/workspaces/${workspaceID}?status=education`,
		},
		{
			label: "Political Science",
			value: "polSci",
			// route: `/workspaces/${workspaceID}?status=polSci`,
		},
		{
			label: "Technology",
			value: "technology",
			// route: `/workspaces/${workspaceID}?status=technology`,
		},
	];
}
