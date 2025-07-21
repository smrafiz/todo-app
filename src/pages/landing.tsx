import Footer from "@/components/landing/Footer";
import Navigation from "@/components/landing/Navigation";
import CtaSection from "@/components/landing/CTASection";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";


export default function Landing() {
	return (
		<div className="min-h-screen bg-background">
			<Navigation />
			<HeroSection />
			<FeaturesSection />
			<CtaSection />
			<Footer />
		</div>
	);
}