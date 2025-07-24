import {ReactNode} from 'react';
import {AlertTriangle, Loader2} from 'lucide-react';

interface LoaderWrapperProps {
	isLoading: boolean;
	error: string | null;
	children: ReactNode;
	onRetry?: () => void;
	retryMessage?: string;
}

export default function LoaderWrapper({isLoading, error, children, onRetry, retryMessage}: LoaderWrapperProps) {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-32 text-gray-500">
				<Loader2 className="animate-spin w-6 h-6 mr-2"/>
				<span>Loading...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-32 text-red-600 space-y-2">
				<div className="flex items-center">
					<AlertTriangle className="w-6 h-6 mr-2"/>
					<span>{retryMessage ?? error}</span>
				</div>
				{onRetry && (
					<button
						onClick={onRetry}
						className="mt-2 px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
					>
						Retry
					</button>
				)}
			</div>
		);
	}

	return <>{children}</>;
}