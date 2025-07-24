'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: ReactNode;
	children: ReactNode;
}

export default function Modal({
	                              isOpen,
	                              onClose,
	                              title,
	                              description,
	                              children,
                              }: ModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				<div className="py-2">{children}</div>
			</DialogContent>
		</Dialog>
	);
}