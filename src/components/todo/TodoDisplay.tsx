import type { Todo } from '@prisma/client';
import { formatReadableDate } from '@/lib/utils';

type TodoDisplayProps = {
	todo: Todo;
};

export default function TodoDisplay({ todo }: TodoDisplayProps) {
	return (
		<>
			<div className="font-medium">{todo.title}</div>
			<div className="text-sm text-gray-500">
				{formatReadableDate(todo.datetime)}
			</div>
		</>
	);
}