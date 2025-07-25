import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

type ColorKey = "blue" | "green" | "yellow" | "red";

type Props = {
	label: string;
	count: number;
	color: string;
	Icon: ReactNode;
	onClick: () => void;
};

type colorProps = {
	bg: string;
	border: string;
	hover: string;
	text: string;
	textBold: string;
	iconBg: string;
	iconHover: string;
};

const colorMap: Record<ColorKey, colorProps> = {
	blue: {
		bg: "bg-blue-50",
		border: "border-blue-200",
		hover: "hover:bg-blue-100",
		text: "text-blue-600",
		textBold: "text-blue-900",
		iconBg: "bg-blue-100",
		iconHover: "hover:bg-blue-200",
	},
	green: {
		bg: "bg-green-50",
		border: "border-green-200",
		hover: "hover:bg-green-100",
		text: "text-green-600",
		textBold: "text-green-900",
		iconBg: "bg-green-100",
		iconHover: "hover:bg-green-200",
	},
	yellow: {
		bg: "bg-yellow-50",
		border: "border-yellow-200",
		hover: "hover:bg-yellow-100",
		text: "text-yellow-600",
		textBold: "text-yellow-900",
		iconBg: "bg-yellow-100",
		iconHover: "hover:bg-yellow-200",
	},
	red: {
		bg: "bg-red-50",
		border: "border-red-200",
		hover: "hover:bg-red-100",
		text: "text-red-600",
		textBold: "text-red-900",
		iconBg: "bg-red-100",
		iconHover: "hover:bg-red-200",

	},
};

export default function StatsCard({ label, count, color, Icon, onClick }: Props) {
	const fallbackColor: ColorKey = "blue";
	const colors = colorMap[color as ColorKey] || colorMap[fallbackColor];

	return (
		<div className="group">
			<Card
				className={`${colors.bg} ${colors.border} ${colors.hover} ${colors.iconHover} border cursor-pointer group-hover:scale-[1.02] transition-all group p-6`}
				onClick={onClick}
			>
				<div className="flex items-center justify-between">
					<div>
						<p className={`text-sm font-medium ${colors.text}`}>{label}</p>
						<p className={`text-2xl font-bold ${colors.textBold}`}>{count}</p>
					</div>
					<div className={`w-12 h-12 ${colors.text} ${colors.iconBg} rounded-full flex items-center justify-center`}>
						{Icon}
					</div>
				</div>
			</Card>
		</div>
	);
}