'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/userStore";

export default function HeroButtons() {
	const { user, hasHydrated } = useUserStore();

	if (!hasHydrated) {
		return <p className="text-sm text-gray-500">Loading menu...</p>;
	}

	return (
		<div className="flex flex-col sm:flex-row gap-4">
			{user ? (
				<Button asChild size="lg" className="shadow-medium">
					<Link href="/dashboard">Go to Dashboard</Link>
				</Button>
			) : (
				<>
					<Button asChild size="lg" className="shadow-medium">
						<Link href="/register">Get Started Free</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="/login">Sign In</Link>
					</Button>
				</>
			)}
		</div>
	);
}