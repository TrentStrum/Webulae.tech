import '@testing-library/jest-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http } from 'msw';
import { setupServer } from 'msw/node';

import { SubscriptionDashboard } from '@/src/components/subscription/SubscriptionDashboard';
import { queryClient } from '@/src/lib/cache/queryCache';

type WrapperProps = {
	children: React.ReactNode;
};

const mockToast = jest.fn();
jest.mock('@/src/hooks', () => ({
	useToast: () => ({ toast: mockToast }),
}));

const server = setupServer(
	http.post('/api/payment-methods/add', async () => {
		return Response.json({ success: true });
	}),
	http.post('/api/subscriptions/update', async () => {
		return Response.json({ error: 'Update failed' }, { status: 500 });
	})
);

beforeAll(() => server.listen());
afterEach(() => {
	server.resetHandlers();
	queryClient.clear();
	mockToast.mockClear();
});
afterAll(() => server.close());

const wrapper = ({ children }: WrapperProps): JSX.Element => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Subscription System', () => {
	describe('Payment Processing', () => {
		it('handles adding a new payment method', async (): Promise<void> => {
			render(<SubscriptionDashboard userId="user_123" />, { wrapper });

			const paymentTab = screen.getByText('Payment Methods');
			await userEvent.click(paymentTab);

			const addButton = screen.getByText('Add Payment Method');
			await userEvent.click(addButton);

			await waitFor(() => {
				expect(screen.getByText('Payment method added successfully')).toBeInTheDocument();
			});
		});
	});

	describe('Error Handling', () => {
		it('displays error message on failed subscription update', async (): Promise<void> => {
			render(<SubscriptionDashboard userId="user_123" />, { wrapper });

			const updateButton = await screen.findByText('Update Plan');
			await userEvent.click(updateButton);

			await waitFor(() => {
				expect(screen.getByText('Failed to update subscription')).toBeInTheDocument();
			});
		});
	});
});
