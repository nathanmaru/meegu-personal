import { useRouter } from "next/router";
import Link from "next/link";

import { Box, Tab, Tabs } from "@mui/material";

export default function ClassroomWorkspaceTabs(props) {
	const { activeTab } = props;
	const router = useRouter();

	return (
		<>
			<Box component="div" sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={activeTab}>
					<Tab
						onClick={() => router.push("/adviser/classroom/workspace")}
						value="workspace"
						label="Workspace"
					></Tab>

					<Tab
						onClick={() => router.push("/adviser/classroom/recommendation")}
						value="recommendation"
						label="Recommendations"
					></Tab>
				</Tabs>
			</Box>
			<div className="m-4">{props.children}</div>
		</>
	);
}
