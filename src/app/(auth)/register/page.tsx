'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Section from '@/components/global/Section';
import { useUserStore } from '@/lib/store/userStore';

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		agreedToTerms: false,
	});

	const [errors, setErrors] = useState<{
		name?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
		agreedToTerms?: string;
		general?: string;
	}>({});

	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const register = useUserStore((state) => state.signup); // Use your signup method here

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setIsLoading(true);

		// Validation
		if (!formData.name.trim()) {
			setErrors({ name: 'Full name is required' });
			setIsLoading(false);
			return;
		}
		if (!formData.email.trim()) {
			setErrors({ email: 'Email is required' });
			setIsLoading(false);
			return;
		}
		if (!formData.password) {
			setErrors({ password: 'Password is required' });
			setIsLoading(false);
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			setErrors({ confirmPassword: 'Passwords do not match' });
			setIsLoading(false);
			return;
		}
		if (!formData.agreedToTerms) {
			setErrors({ agreedToTerms: 'You must agree to the Terms of Service' });
			setIsLoading(false);
			return;
		}

		try {
			await register(formData.name, formData.email, formData.password);
			router.push('/dashboard');
		} catch (error) {
			setErrors({ general: (error as Error).message || 'Failed to register. Please try again.' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Section sectionClass="register-container h-[calc(100vh-175px)] bg-gradient-hero flex items-center justify-center p-6">
			<div className="flex items-center bg-gradient-card justify-center my-12 rounded-lg border text-card-foreground shadow-sm">
				<div className="flex flex-col w-full max-w-md gap-4">
					<div className="flex flex-col text-center p-6 gap-2">
						<h1 className="font-semibold tracking-tight text-2xl">Create your account</h1>
						<p className="text-sm text-muted-foreground tracking-tight">
							Join thousands of users who stay organized
						</p>
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
									label="Full Name"
									name="name"
									type="text"
									value={formData.name}
									onChange={handleChange}
									error={errors.name}
									placeholder="Enter your full name"
									required
								/>

								<Input
									label="Email Address"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									error={errors.email}
									placeholder="Enter your email"
									required
								/>

								<Input
									label="Password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleChange}
									error={errors.password}
									placeholder="Create a password"
									required
								/>

								<Input
									label="Confirm Password"
									name="confirmPassword"
									type="password"
									value={formData.confirmPassword}
									onChange={handleChange}
									error={errors.confirmPassword}
									placeholder="Confirm your password"
									required
								/>

								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										name="agreedToTerms"
										checked={formData.agreedToTerms}
										onChange={handleChange}
										className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
									/>
									<span className="text-sm text-gray-600">
                    I agree to the{' '}
										<Link href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                      Terms of Service
                    </Link>{' '}
										and{' '}
										<Link href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                      Privacy Policy
                    </Link>
                  </span>
								</label>
								{errors.agreedToTerms && (
									<p className="text-sm text-red-600">{errors.agreedToTerms}</p>
								)}

								<Button type="submit" disabled={isLoading} className="w-full h-11">
									{isLoading ? 'Creating Account...' : 'Create Account'}
								</Button>
							</form>

							<div className="mt-6 text-center">
								<p className="text-sm text-gray-600">
									Already have an account?{' '}
									<Link href="/login" className="text-blue-600 hover:text-blue-500 font-sm">
										Sign in here
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