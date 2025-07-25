import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

export default function HeroSection() {
	return (
		<section className="relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-hero"></div>
			<div className="relative container mx-auto px-6 py-20">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-8 animate-fade-in">
						<h1 className="text-5xl lg:text-6xl font-bold text-foreground">
							Organize Your Life with {" "}
							<span className="bg-gradient-primary bg-clip-text text-transparent">Smart Planning</span>
						</h1>
						<p className="text-xl text-muted-foreground leading-relaxed">
							Transform your productivity with our intelligent task management system. Stay organized, meet deadlines, and achieve your goals effortlessly.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Button asChild size="lg" className="shadow-medium">
								<Link href="/signup">Get Started Free</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/login">Sign In</Link>
							</Button>
						</div>
					</div>
					<div className="relative animate-slide-up">
						<Image
							src={heroImage}
							alt="TaskMaster Planner Interface"
							width={700}
							height={500}
							className="rounded-2xl shadow-strong w-full object-cover"
							priority
						/>
					</div>
				</div>
			</div>
		</section>
	);
}