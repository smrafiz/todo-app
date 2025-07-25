'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

type Props = {
	link: string;
	linkLabel: string;
	icon: React.ReactNode;
};

export default function IconCircleButton({ link, linkLabel, icon }: Props) {
	return (
		<TooltipProvider>
			<div className="flex justify-center mt-4">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link href={link}>
							<Button size="icon" className="rounded-full w-12 h-12 bg-primary hover:bg-primary/80">
								{icon}
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>{linkLabel}</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
}