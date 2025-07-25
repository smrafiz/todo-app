'use client';

import Link from 'next/link';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import Section from "@/components/global/Section";
import {useUserStore} from '@/lib/store/userStore';

export default function LoginPage() {
	const [formData, setFormData] = useState({email: '', password: ''});
	const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const login = useUserStore((state) => state.login);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setIsLoading(true);

		if (!formData.email) {
			setErrors({email: 'Email is required'});
			setIsLoading(false);

			return;
		}

		if (!formData.password) {
			setErrors({password: 'Password is required'});
			setIsLoading(false);

			return;
		}

		try {
			await login(formData.email, formData.password);
			router.push('/dashboard');
		} catch (error) {
			setErrors({general: (error as Error).message || 'Invalid email or password'});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Section
			sectionClass="login-container h-[calc(100vh-175px)] bg-gradient-hero flex items-center justify-center p-6">
			<div
				className="flex items-center bg-gradient-card justify-center my-12 rounded-lg border text-card-foreground shadow-sm">
				<div className="flex flex-col w-full max-w-xs gap-4">
					<div className="flex flex-col text-center p-6 gap-2">
						<h1 className="font-semibold tracking-tight text-2xl">Welcome Back</h1>
						<p className="text-sm text-muted-foreground tracking-tight">Sign in to your account to continue
							managing your tasks</p>
					</div>

					<div className="p-6 pt-0 space-y-6">
						<Card>
							<form onSubmit={handleSubmit} className="space-y-6">
								{errors.general && (
									<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
										{errors.general}
									</div>
								)}

								<Input
									label="Email"
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({...formData, email: e.target.value})}
									error={errors.email}
									placeholder="Enter your email"
									required
								/>

								<Input
									label="Password"
									type="password"
									value={formData.password}
									onChange={(e) => setFormData({...formData, password: e.target.value})}
									error={errors.password}
									placeholder="Enter your password"
									required
								/>

								<div className="flex items-center justify-between">
									<label className="flex items-center">
										<input
											type="checkbox"
											className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										/>
										<span className="ml-2 text-sm text-gray-600">Remember me</span>
									</label>
									<Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
										Forgot password?
									</Link>
								</div>

								<Button type="submit" disabled={isLoading} className="w-full h-11">
									{isLoading ? 'Signing in...' : 'Sign In'}
								</Button>
							</form>

							<div className="mt-6 text-center">
								<p className="text-sm text-gray-600">
									Don&apos;t have an account?{' '}
									<Link href="/register" className="text-blue-600 hover:text-blue-500 font-sm">
										Sign up here
									</Link>
								</p>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</Section>
	);
}