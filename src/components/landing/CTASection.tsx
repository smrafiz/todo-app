import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
	return (
		<section className="py-20 bg-gradient-primary relative overflow-hidden">
			<div className="container mx-auto px-6 text-center relative z-10">
				<h2 className="text-4xl font-bold text-white mb-4">
					Ready to Get Organized?
				</h2>
				<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
					Join thousands of users who have transformed their productivity with TaskMaster ToDo Planner.
				</p>
				<Button asChild size="lg" variant="secondary" className="shadow-medium">
					<Link href="/dashboard">Start Your Journey</Link>
				</Button>
			</div>
		</section>
	);
}