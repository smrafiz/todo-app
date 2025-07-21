import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, BarChart3, Users } from "lucide-react";

const features = [
	{
		icon: CheckCircle,
		title: "Smart Task Management",
		description: "Organize your tasks with intelligent categorization and priority sorting.",
	},
	{
		icon: Clock,
		title: "Deadline Tracking",
		description: "Never miss a deadline with smart notifications and visual reminders.",
	},
	{
		icon: BarChart3,
		title: "Progress Analytics",
		description: "Track your productivity with detailed reports and insights.",
	},
	{
		icon: Users,
		title: "Team Collaboration",
		description: "Share tasks and collaborate with your team seamlessly.",
	},
];

export default function FeaturesSection() {
	return (
		<section className="py-20 bg-muted/30">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-foreground mb-4">
						Everything You Need to Stay Productive
					</h2>
					<p className="text-xl text-muted-foreground">
						Powerful features designed to help you manage tasks efficiently
					</p>
				</div>
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="p-6 text-center hover:shadow-medium transition-shadow bg-gradient-card"
						>
							<feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
							<p className="text-muted-foreground">{feature.description}</p>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}