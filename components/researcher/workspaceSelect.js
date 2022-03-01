import { useRouter } from "next/router";
import Link from "next/link";
import {
	Box,
	InputLabel,
	MenuItem,
	FormControl,
	FormHelperText,
	Select,
} from "@mui/material";

export default function WorkspaceSelect(props) {
	const { tab } = props;
	const router = useRouter();
	const queryParams = router.query;
	console.log(queryParams);

	return (
		<>
			<FormControl sx={{ m: 1, maxWidth: 200, borderRadius: "45px" }}>
				<Select displayEmpty value={tab} sx={{ borderRadius: "15px" }}>
					<MenuItem
						onClick={() => router.push("/researcher/workspace2?tab=personal")}
						value="personal"
					>
						Personal
					</MenuItem>
					<MenuItem
						onClick={() => router.push("/researcher/workspace2?tab=shared")}
						value="shared"
					>
						Shared Workspace
					</MenuItem>
				</Select>
			</FormControl>
			<div className="m-4">{props.children}</div>
		</>
	);
}
