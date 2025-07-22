export default function Footer() {
	return (
		<footer className="py-8 border-t border-border bg-background">
			<div className="container mx-auto px-6 text-center">
				<p className="text-muted-foreground">
					© {new Date().getFullYear()} TaskMaster ToDo Planner. Built for productivity enthusiasts.
				</p>
			</div>
		</footer>
	);
}