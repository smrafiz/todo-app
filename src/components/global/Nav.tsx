'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Button} from "@/components/ui/button";

const Nav = () => {
	const pathname = usePathname();

	const linkClass = (path: string) =>
		`${
			pathname === path ? 'text-primary' : 'text-secondary'
		}`;

	return (
		<nav className="site-navigation">
			<ul className="main-menu">
				<li>
					<Button asChild variant="ghost">
						<Link href="/dashboard">Dashboard</Link>
					</Button>
				</li>
				<li>
					<Button asChild variant="ghost">
						<Link href="/report">Report</Link>
					</Button>
				</li>
				<li>
					<Button asChild variant="ghost">
						<Link href="/login">Log In</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link href="/register">Sign Up</Link>
					</Button>
				</li>
			</ul>
		</nav>
	);
};

export default Nav;