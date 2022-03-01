import React from "react";
import { useRouter } from "next/router";

export default function useClassroomFileFilters() {
	const router = useRouter();
	const classroomFileID = router.query.id;

	return [
		{
			label: "Submitted",
			value: "submitted",
			route: `/classrooms/${classroomFileID}?status=submitted`,
		},
		{
			label: "Recommended",
			value: "recommended",
			route: `/classrooms/${classroomFileID}?status=recommended`,
		},
	];
}
