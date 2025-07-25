import React from "react";
import "@/app/globals.css";
import type {Metadata} from 'next';
import {Inter} from 'next/font/google'
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import AuthChecker from "@/components/global/AuthChecker";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'TaskMaster',
    description: 'TaskMaster ToDo Planner',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={`antialiased bg-gray-50 ${inter.className}`}>
        <div id="wrapper" className="wrapper min-h-screen">
            <AuthChecker />
            <Header/>
            <main id="content" className="site-content">
                {children}
            </main>
            <Footer/>
        </div>
        </body>
        </html>
    )
}
