import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/lib/cache/queryCache';
import Login from '@/src/app/auth/login/page';
import { SignUpForm } from '@/src/app/auth/register/components/SignUpForm';
import { ResetPasswordForm } from '@/src/app/auth/reset-password/components/ResetPasswordForm';

type WrapperProps = {
	children: React.ReactNode;
};

const mockRouter = {
	push: jest.fn(),
	refresh: jest.fn(),
};

jest.mock('next/navigation', () => ({
	useRouter: () => mockRouter,
}));

const server = setupServer(
	http.post('/api/auth/login', async () => {
		return Response.json({
			user: { id: '1', email: 'test@example.com' },
			token: 'mock-token',
		});
	}),
	http.post('/api/auth/register', async () => {
		return Response.json({
			user: { id: '1', email: 'test@example.com' },
			token: 'mock-token',
		});
	}),
	http.post('/api/auth/reset-password', async () => {
		return Response.json({ message: 'Password reset email sent' });
	})
);

beforeAll(() => server.listen());
afterEach(() => {
	server.resetHandlers();
	queryClient.clear();
	jest.clearAllMocks();
});
afterAll(() => server.close());

const wrapper = ({ children }: WrapperProps): JSX.Element => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Authentication Flow', () => {
	it('should handle login process correctly', async (): Promise<void> => {
		const user = userEvent.setup();
		render(<Login />, { wrapper });

		await user.type(screen.getByLabelText(/email/i), 'test@example.com');
		await user.type(screen.getByLabelText(/password/i), 'Password123!');
		await user.click(screen.getByRole('button', { name: /sign in/i }));

		await waitFor(() => {
			expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
		});
	});

	it('handles registration with email verification', async () => {
		const user = userEvent.setup();

		render(<SignUpForm />, { wrapper });

		await user.type(screen.getByLabelText(/email/i), 'test@example.com');
		await user.type(screen.getByLabelText(/password/i), 'Password123!');
		await user.click(screen.getByRole('button', { name: /sign up/i }));

		await waitFor(() => {
			expect(screen.getByText(/verification email sent/i)).toBeInTheDocument();
		});
	});

	it('completes password reset flow', async () => {
		const user = userEvent.setup();

		render(<ResetPasswordForm />, { wrapper });

		await user.type(screen.getByLabelText(/email/i), 'test@example.com');
		await user.click(screen.getByRole('button', { name: /reset password/i }));

		await waitFor(() => {
			expect(screen.getByText(/password reset email sent/i)).toBeInTheDocument();
		});
	});
});
