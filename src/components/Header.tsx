'use client';

import Nav from "@/components/Nav";
import {usePathname} from 'next/navigation';

const Header = () => {
	const pathname = usePathname();
	const heading = pathname === '/report' ? '📊 Report Summary' : '📝 My ToDo List';

	return (
		<header className="site-header">
			<h1 className="text-2xl font-bold text-center">{heading}</h1>
			<Nav/>
		</header>
	)
}

export default Header;
