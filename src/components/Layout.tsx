// import Nav from './Nav'
// import Meta from './Meta'
// import Header from './Header'
// import styles from '../styles/Layout.module.css'
import {ReactNode} from "react";
import {Inter} from 'next/font/google';
import Header from "@/components/Header";

type LayoutProps = {
	children: ReactNode;
};

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
});

const Layout = ({ children }: LayoutProps) => {
	return (
		<>
			{/*<Meta />*/}
			{/*<Nav />*/}
			<div id="wrapper" className={`wrapper ${inter.className}`}>
				<Header />
				{children}
			</div>
		</>
	)
}

export default Layout;
