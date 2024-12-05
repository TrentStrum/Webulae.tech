```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { SubscriptionDashboard } from '@/src/components/subscription/SubscriptionDashboard';
import { PlanSelector } from '@/src/components/subscription/PlanSelector';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/lib/cache/queryCache';

// Mock Stripe
const mockStripe = {
  confirmCardPayment: jest.fn(),
  createPaymentMethod: jest.fn(),
};

// Mock server
const server = setupServer(
  // Subscription endpoints
  rest.post('/api/subscriptions/create', (req, res, ctx) => {
    return res(ctx.json({ subscriptionId: 'sub_123' }));
  }),
  
  rest.post('/api/subscriptions/update', (req, res, ctx) => {
    return res(ctx.json({ status: 'active' }));
  }),
  
  rest.post('/api/subscriptions/cancel', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  
  // Usage endpoint
  rest.get('/api/subscriptions/usage', (req, res, ctx) => {
    return res(
      ctx.json({
        projects: { used: 5, limit: 10 },
        storage: { used: 2.5, limit: 5 },
        api: { used: 8000, limit: 10000 },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  queryClient.clear();
});
afterAll(() => server.close());

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Subscription System', () => {
  describe('Plan Selection', () => {
    it('allows selecting a subscription plan', async () => {
      const onPlanSelect = jest.fn();
      const plans = [
        {
          id: 'plan_basic',
          name: 'Basic',
          price: 9.99,
          interval: 'month',
          features: ['Feature 1', 'Feature 2'],
          stripePriceId: 'price_123',
        },
      ];

      render(<PlanSelector 
        plans={plans}
        onPlanSelect={onPlanSelect}
      />, { wrapper });

      const planButton = screen.getByText('Select Plan');
      await userEvent.click(planButton);

      expect(onPlanSelect).toHaveBeenCalledWith(plans[0]);
    });
  });

  describe('Subscription Management', () => {
    it('displays current subscription status', async () => {
      render(<SubscriptionDashboard userId="user_123" />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText(/Current Subscription/i)).toBeInTheDocument();
      });
    });

    it('handles subscription cancellation', async () => {
      server.use(
        rest.post('/api/subscriptions/cancel', (req, res, ctx) => {
          return res(ctx.json({ success: true }));
        })
      );

      render(<SubscriptionDashboard userId="user_123" />, { wrapper });

      const cancelButton = await screen.findByText('Cancel Auto-renew');
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.getByText('Enable Auto-renew')).toBeInTheDocument();
      });
    });

    it('displays usage statistics', async () => {
      render(<SubscriptionDashboard userId="user_123" />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('Projects Usage')).toBeInTheDocument();
        expect(screen.getByText('Storage Usage')).toBeInTheDocument();
        expect(screen.getByText('API Calls Usage')).toBeInTheDocument();
      });
    });
  });

  describe('Payment Processing', () => {
    it('handles adding a new payment method', async () => {
      server.use(
        rest.post('/api/payment-methods/add', (req, res, ctx) => {
          return res(ctx.json({ success: true }));
        })
      );

      render(<SubscriptionDashboard userId="user_123" />, { wrapper });

      // Navigate to payment methods tab
      const paymentTab = screen.getByText('Payment Methods');
      await userEvent.click(paymentTab);

      // Add new payment method
      const addButton = screen.getByText('Add Payment Method');
      await userEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Payment method added successfully')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message on failed subscription update', async () => {
      server.use(
        rest.post('/api/subscriptions/update', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Update failed' }));
        })
      );

      render(<SubscriptionDashboard userId="user_123" />, { wrapper });

      const updateButton = await screen.findByText('Update Plan');
      await userEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to update subscription')).toBeInTheDocument();
      });
    });
  });
});
```