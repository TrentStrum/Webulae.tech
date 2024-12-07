import { useState } from 'react';

import { useResetPassword } from '@/src/hooks/react-query/useResetPassword';

export function ResetPasswordForm() {
	const [email, setEmail] = useState('');
	const resetPassword = useResetPassword();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await resetPassword.mutate(email);
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="email">Email</label>
			<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<button type="submit">Reset Password</button>
		</form>
	);
}
