'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';

type IntakeFormInputs = {
	primaryGoal: string;
	primaryUsers: string;
	topFeatures: string;
	integrations: string;
	designStyle: string;
	brandAssets: string;
	timelineAndBudget: string;
	inspiration: string;
};

export default function ClientIntakeForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IntakeFormInputs>();

	const onSubmit: SubmitHandler<IntakeFormInputs> = (data) => {
		console.log(data);
		// Here you would typically send the data to your backend
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
			<h1 className="text-3xl font-bold mb-6 text-center">Initial Client Intake Form</h1>
			<p className="text-gray-600 mb-8 text-center">
				High-level questions to understand client needs and begin the process
			</p>

			<Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<Form.Field name="primaryGoal">
					<div className="flex flex-col space-y-2">
						<Label.Root className="text-sm font-medium text-gray-700" htmlFor="primaryGoal">
							1. What is the primary goal of this app?
						</Label.Root>
						<Form.Control asChild>
							<input
								type="text"
								id="primaryGoal"
								{...register('primaryGoal', { required: 'This field is required' })}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								placeholder="E.g., customer engagement, internal business tool, marketplace, etc."
							/>
						</Form.Control>
						{errors.primaryGoal && (
							<p className="text-red-500 text-sm">{errors.primaryGoal.message}</p>
						)}
					</div>
				</Form.Field>

				<Form.Field name="primaryUsers">
					<div className="flex flex-col space-y-2">
						<Label.Root className="text-sm font-medium text-gray-700" htmlFor="primaryUsers">
							2. Who are the primary users of the app, and what do you want them to achieve?
						</Label.Root>
						<Form.Control asChild>
							<textarea
								id="primaryUsers"
								{...register('primaryUsers', { required: 'This field is required' })}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								rows={3}
							/>
						</Form.Control>
						{errors.primaryUsers && (
							<p className="text-red-500 text-sm">{errors.primaryUsers.message}</p>
						)}
					</div>
				</Form.Field>

				<Form.Field name="topFeatures">
					<div className="flex flex-col space-y-2">
						<Label.Root className="text-sm font-medium text-gray-700" htmlFor="topFeatures">
							3. What are the top three features or functionalities you need in the app?
						</Label.Root>
						<Form.Control asChild>
							<textarea
								id="topFeatures"
								{...register('topFeatures', { required: 'This field is required' })}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								rows={3}
							/>
						</Form.Control>
						{errors.topFeatures && (
							<p className="text-red-500 text-sm">{errors.topFeatures.message}</p>
						)}
					</div>
				</Form.Field>

				<Form.Field name="integrations">
					<div className="flex flex-col space-y-2">
						<Label.Root className="text-sm font-medium text-gray-700" htmlFor="integrations">
							4. Do you have any integrations or external services in mind?
						</Label.Root>
						<Form.Control asChild>
							<input
								type="text"
								id="integrations"
								{...register('integrations')}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								placeholder="E.g., payment gateways, APIs"
							/>
						</Form.Control>
					</div>
				</Form.Field>

				<Form.Field name="designStyle">
					<div className="flex flex-col space-y-2">
						<Label.Root className="text-sm font-medium text-gray-700" htmlFor="designStyle">
							5. What tone or style do you want the app to have?
						</Label.Root>
						<Form.Control asChild>
							<input
								type="text"
								id="designStyle"
								{...register('designStyle', { required: 'This field is required' })}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								placeholder="E.g., modern, playful, professional, minimalist"
							/>
						</Form.Control>
						{errors.designStyle && (
							<p className="text-red-500 text-sm">{errors.designStyle.message}</p>
						)}
					</div>
				</Form.Field>

				<Form.Field name="brandAssets">
					<div className="flex flex-col space-y-2">
						<Label.Root className="text-sm font-medium text-gray-700" htmlFor="brandAssets">
							6. Do you have specific brand colors or assets we should incorporate?
						</Label.Root>
						<Form.Control asChild>
							<textarea
								id="brandAssets"
								{...register('brandAssets')}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								rows={3}
								placeholder="Describe any logos, images, fonts, or color schemes"
							/>
						</Form.Control>
					</div>
				</Form.Field>

				<Form.Field name="timelineAndBudget">
					<div className="flex flex-col space-y-2">
						<Label.Root className="text-sm font-medium text-gray-700" htmlFor="timelineAndBudget">
							7. What is your timeline and budget for this project?
						</Label.Root>
						<Form.Control asChild>
							<input
								type="text"
								id="timelineAndBudget"
								{...register('timelineAndBudget', { required: 'This field is required' })}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							/>
						</Form.Control>
						{errors.timelineAndBudget && (
							<p className="text-red-500 text-sm">{errors.timelineAndBudget.message}</p>
						)}
					</div>
				</Form.Field>

				<Form.Field name="inspiration">
					<div className="flex flex-col space-y-2">
						<Label.Root className="text-sm font-medium text-gray-700" htmlFor="inspiration">
							8. Are there similar apps or websites that inspire you? Please share links or
							examples.
						</Label.Root>
						<Form.Control asChild>
							<textarea
								id="inspiration"
								{...register('inspiration')}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								rows={3}
							/>
						</Form.Control>
					</div>
				</Form.Field>

				<Form.Submit asChild>
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Submit
					</button>
				</Form.Submit>
			</Form.Root>
		</div>
	);
}
