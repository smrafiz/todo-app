'use client';
import {Project} from "@/types";
import {getTasksByProjectId} from "@/actions/task.action";

type Props = {
	project: Project
}

const Title = ({project}: Props) => {

	const onClickHandler = async () => {
		const res = await getTasksByProjectId(project.id);
		console.log({res})
	}

	return (
		<h2 className="text-3xl font-bold" onClick={onClickHandler}>{project.name}</h2>
	)
};

export default Title;