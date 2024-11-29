'use client';

import { SignUpForm } from './components/SignUpForm';
import { AuthSideContent } from './components/AuthSideContent';
import { UserPlus } from 'lucide-react';

export default function SignUpPage() {
	return (
		<div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="lg:p-8">
				<SignUpForm />
			</div>
			<AuthSideContent
				icon={UserPlus}
				title="Join Webulae"
				quote="Join our community of innovative businesses and experience the power of custom software solutions tailored to your needs."
			/>
		</div>
	);
}
