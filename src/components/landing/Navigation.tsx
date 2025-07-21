import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
	return (
		<nav className="flex items-center justify-between p-6 border-b border-border">
			<div className="flex items-center space-x-2">
				<CheckCircle className="h-8 w-8 text-primary" />
				<span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          TaskMaster
        </span>
			</div>
			<div className="flex items-center space-x-4">
				<Button asChild variant="ghost">
					<Link href="/login">Log In</Link>
				</Button>
				<Button asChild>
					<Link href="/signup">Sign Up</Link>
				</Button>
			</div>
		</nav>
	);
}