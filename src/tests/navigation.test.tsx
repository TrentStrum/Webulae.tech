import { render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/src/contexts/AuthContext';
import { useNavigationGuard } from '@/src/hooks/helpers/use-navigation-guard';

// Mock next/navigation
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
	usePathname: jest.fn(),
}));

// Mock AuthContext
jest.mock('@/src/contexts/AuthContext', () => ({
	useAuth: jest.fn(),
}));

describe('Navigation Guard', () => {
	const mockRouter = {
		push: jest.fn(),
	};

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
		jest.clearAllMocks();
	});

	it('redirects unauthenticated users to login', async () => {
		(useAuth as jest.Mock).mockReturnValue({
			data: null,
			isLoading: false,
		});

		const TestComponent = () => {
			useNavigationGuard({ requireAuth: true });
			return <div>Protected Page</div>;
		};

		render(<TestComponent />);

		await waitFor(() => {
			expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/auth/login'));
		});
	});

	it('allows access to authorized users', async () => {
		(useAuth as jest.Mock).mockReturnValue({
			data: { role: 'admin' },
			isLoading: false,
		});

		const TestComponent = () => {
			useNavigationGuard({ allowedRoles: ['admin'] });
			return <div>Admin Page</div>;
		};

		render(<TestComponent />);

		await waitFor(() => {
			expect(mockRouter.push).not.toHaveBeenCalled();
		});
	});

	it('prevents access for unauthorized roles', async () => {
		(useAuth as jest.Mock).mockReturnValue({
			data: { role: 'client' },
			isLoading: false,
		});

		const TestComponent = () => {
			useNavigationGuard({ allowedRoles: ['admin'] });
			return <div>Admin Page</div>;
		};

		render(<TestComponent />);

		await waitFor(() => {
			expect(mockRouter.push).toHaveBeenCalledWith('/');
		});
	});
});
