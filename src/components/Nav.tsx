'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

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
					<Link href="/" className={linkClass('/')}>
						ToDos
					</Link>
				</li>
				<li>
					<Link href="/report" className={linkClass('/report')}>
						Report
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Nav;