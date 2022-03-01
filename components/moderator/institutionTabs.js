import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import Link from "next/link";

export default function InstituionTabs(props) {
	const { activeTab } = props;
	const router = useRouter();

	return (
		<>
			<Box component="div" sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={activeTab}>
					<Tab
						onClick={() => router.push("/moderator/institution/articles")}
						value="articles"
						label="Articles"
					></Tab>

					<Tab
						onClick={() => router.push("/moderator/institution/resources")}
						value="resources"
						label="Resources"
					></Tab>
					<Tab
						onClick={() => router.push("/moderator/institution/people")}
						value="people"
						label="People"
					></Tab>
					<Tab
						onClick={() => router.push("/moderator/institution/subscription")}
						value="subscription"
						label="Subscription"
					></Tab>
				</Tabs>
			</Box>
			<div className="m-4">{props.children}</div>
		</>
	);
}
