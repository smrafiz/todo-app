import Link from "next/link";
import {CheckCircle} from "lucide-react";
import Nav from "@/components/global/Nav";

export default function Header() {
	return (
		<header className="header bg-background flex items-center justify-between p-6 border-b border-border">
			<div className="flex items-center space-x-2">
				<Link href="/" className="flex items-center space-x-2">
					<CheckCircle className="h-8 w-8 text-primary"/>
					<span
						className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">TaskMaster</span>
				</Link>
			</div>
			<Nav/>
		</header>
	);
}