'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/userStore";
import { usePathname, useRouter } from 'next/navigation';
import {LogOut} from "lucide-react";

const Nav = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout, hasHydrated } = useUserStore();

	const linkClass = (path: string) =>
		pathname === path ? 'text-primary font-semibold' : 'text-text-default';

	if (!hasHydrated) {
		return (
			<nav className="site-navigation py-4">
				<p className="text-sm text-gray-500">Loading menu...</p>
			</nav>
		);
	}

	const handleLogout = () => {
		logout();
		router.push('/login');
	};

	return (
		<nav className="site-navigation py-4">
			<ul className="main-menu flex items-center gap-4">
				{user ? (
					<>
						<li>
							<Button asChild variant="ghost" className={linkClass('/dashboard')}>
								<Link href={'/dashboard'}>Dashboard</Link>
							</Button>
						</li>
						<li>
							<Button asChild variant="ghost" className={linkClass('/tasks')}>
								<Link href={'/tasks'}>Tasks</Link>
							</Button>
						</li>
						<li>
							<Button asChild variant="ghost" className={linkClass('/projects')}>
								<Link href={'/projects'}>Projects</Link>
							</Button>
						</li>
						<li>
							<Button asChild variant="ghost" className={linkClass('/report')}>
								<Link href={'/report'}>Report</Link>
							</Button>
						</li>
						<li>
							<span className="text-sm text-muted-foreground">
								Hi, {user.name}
							</span>
						</li>
						<li>
							<Button onClick={handleLogout} variant="ghost" className="text-red-600 flex items-center gap-2">
								<LogOut className="w-4 h-4 ml-2" />
								Logout
							</Button>
						</li>
					</>
				) : (
					<>
						<li>
							<Button asChild variant="ghost" className={linkClass('/login')}>
								<Link href={'/login'}>Log In</Link>
							</Button>
						</li>
						<li>
							<Button asChild>
								<Link href={'/register'}>Sign Up</Link>
							</Button>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
};

export default Nav;