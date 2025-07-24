import {useTodoStore} from "@/lib/store/todoStore";
import {useUserStore} from "@/lib/store/userStore";
import {isToday, isPast} from "date-fns";

export const useUserTodos = () => {
	const {user} = useUserStore();
	const {todos} = useTodoStore();

	const userTodos = todos.filter((t) => t.userId === user?.id);
	const completed = userTodos.filter((t) => t.completed);
	const pending = userTodos.filter((t) => !t.completed);
	const today = userTodos.filter((t) => t.dueDate && isToday(new Date(t.dueDate)));
	const overdue = userTodos.filter(
		(t) => t.dueDate && isPast(new Date(t.dueDate)) && !t.completed
	);
	const upcoming = userTodos.filter(
		(t) => t.dueDate && !isPast(new Date(t.dueDate)) && !t.completed
	);

	return {userTodos, completed, pending, today, overdue, upcoming};
};