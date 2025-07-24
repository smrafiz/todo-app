import {Card} from "@/components/ui/card";
import {ReactNode} from "react";

type Props = {
	label: string;
	count: number;
	color: string;
	Icon: ReactNode;
	onClick: () => void;
};

export default function StatsCard({label, count, color, Icon, onClick}: Props) {
	return (
		<Card
			className={`bg-${color}-50 border-${color}-200 cursor-pointer hover:bg-${color}-100 transition-all group p-6`}
			onClick={onClick}
		>
			<div className="flex items-center justify-between">
				<div>
					<p className={`text-sm font-medium text-${color}-600`}>{label}</p>
					<p className={`text-2xl font-bold text-${color}-900`}>{count}</p>
				</div>
				<div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
					{Icon}
				</div>
			</div>
		</Card>
	);
}