import { render, screen, fireEvent } from '@testing-library/react';
import { z } from 'zod';

import { ErrorMessage } from '@/src/components/forms/ErrorMessage';
import { FormField } from '@/src/components/forms/FormField';
import { useFormState } from '@/src/hooks/forms/useFormState';
import { useFormValidation } from '@/src/hooks/forms/useFormValidation';

describe('Form System', () => {
	describe('FormField', () => {
		it('renders with label and shows error state', () => {
			render(
				<FormField label="Email" error="Invalid email address" value="" onChange={() => {}} />
			);

			expect(screen.getByLabelText('Email')).toBeInTheDocument();
			expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address');
		});

		it('handles user input correctly', () => {
			const handleChange = jest.fn();
			render(<FormField label="Username" value="" onChange={handleChange} />);

			fireEvent.change(screen.getByLabelText('Username'), {
				target: { value: 'testuser' },
			});

			expect(handleChange).toHaveBeenCalled();
		});
	});

	describe('Form Validation', () => {
		it('validates form data against schema', () => {
			const schema = z.object({
				email: z.string().email(),
				password: z.string().min(8),
			});

			const TestComponent = (): JSX.Element => {
				const { validate, errors } = useFormValidation({ schema });

				const handleSubmit = (): void => {
					validate({ email: 'invalid', password: '123' });
				};

				return (
					<div>
						<button onClick={handleSubmit}>Submit</button>
						{errors.email && <ErrorMessage message={errors.email} />}
						{errors.password && <ErrorMessage message={errors.password} />}
					</div>
				);
			};

			render(<TestComponent />);

			fireEvent.click(screen.getByText('Submit'));

			expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
			expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
		});
	});

	describe('Form State', () => {
		it('tracks form state changes', () => {
			const initialData = { name: '', email: '' };

			const TestComponent = (): JSX.Element => {
				const { data, isDirty, handleChange } = useFormState(initialData);

				return (
					<div>
						<input value={data.name} onChange={(e) => handleChange('name', e.target.value)} />
						{isDirty && <span>Form is dirty</span>}
					</div>
				);
			};

			render(<TestComponent />);

			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: 'test' } });

			expect(screen.getByText('Form is dirty')).toBeInTheDocument();
		});
	});
});
