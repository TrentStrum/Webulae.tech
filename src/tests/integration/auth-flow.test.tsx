import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/lib/cache/queryCache';

// Mock API endpoints
const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-token'
      })
    );
  }),
  
  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.json({
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-token'
      })
    );
  }),
  
  rest.post('/api/auth/reset-password', (req, res, ctx) => {
    return res(
      ctx.json({ message: 'Password reset email sent' })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Authentication Flow', () => {
  it('completes login process successfully', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm />, { wrapper });
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });

  it('handles registration with email verification', async () => {
    const user = userEvent.setup();
    
    render(<RegisterForm />, { wrapper });
    
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