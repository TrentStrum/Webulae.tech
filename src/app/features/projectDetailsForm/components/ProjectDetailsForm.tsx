'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

type QuestionnaireInputs = {
	appName: string;
	platforms: string[];
	userRoles: string;
	permissions: string;
	userFeatures: string;
	coreEntities: string;
	entityRelationships: string;
	externalAPIs: string;
	paymentMethods: string;
	colorScheme: string;
	typography: string;
	uiComponents: string;
	darkMode: 'yes' | 'no';
	technicalPreferences: string;
	hostingPreference: string;
	accessibilityRequirements: string;
	existingAssets: string;
};

const platforms = ['Web', 'Mobile', 'Desktop'];

export default function ProjectDetailsForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<QuestionnaireInputs>();

	const onSubmit: SubmitHandler<QuestionnaireInputs> = (data) => {
		console.log(data);
		// Here you would typically send the data to your backend
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
			<h1 className="text-3xl font-bold mb-6 text-center">Detailed Development Questionnaire</h1>
			<p className="text-gray-600 mb-8 text-center">
				Comprehensive questions to guide the dev team in app design and functionality
			</p>

			<Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold">App Overview</h2>

					<Form.Field name="appName">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="appName">
								What is the app&apos;s name or working title?
							</Label.Root>
							<Form.Control asChild>
								<input
									type="text"
									id="appName"
									{...register('appName', { required: 'App name is required' })}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
							</Form.Control>
							{errors.appName && <p className="text-red-500 text-sm">{errors.appName.message}</p>}
						</div>
					</Form.Field>

					<Form.Field name="platforms">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700">
								What platforms should the app support?
							</Label.Root>
							<div className="space-y-2">
								{platforms.map((platform) => (
									<div key={platform} className="flex items-center">
										<Checkbox.Root
											id={`platform-${platform}`}
											className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white"
											{...register('platforms')}
											value={platform}
										>
											<Checkbox.Indicator>
												<CheckIcon className="h-4 w-4 text-indigo-600" />
											</Checkbox.Indicator>
										</Checkbox.Root>
										<label htmlFor={`platform-${platform}`} className="ml-2 text-sm text-gray-700">
											{platform}
										</label>
									</div>
								))}
							</div>
						</div>
					</Form.Field>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl font-semibold">User Roles and Features</h2>

					<Form.Field name="userRoles">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="userRoles">
								What roles will users have? (e.g., admin, regular user)
							</Label.Root>
							<Form.Control asChild>
								<input
									type="text"
									id="userRoles"
									{...register('userRoles', { required: 'User roles are required' })}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
							</Form.Control>
							{errors.userRoles && (
								<p className="text-red-500 text-sm">{errors.userRoles.message}</p>
							)}
						</div>
					</Form.Field>

					<Form.Field name="permissions">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="permissions">
								Are there specific permissions or role-based functionalities?
							</Label.Root>
							<Form.Control asChild>
								<textarea
									id="permissions"
									{...register('permissions')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
									rows={3}
								/>
							</Form.Control>
						</div>
					</Form.Field>

					<Form.Field name="userFeatures">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="userFeatures">
								What are the detailed features or actions each user should have access to?
							</Label.Root>
							<Form.Control asChild>
								<textarea
									id="userFeatures"
									{...register('userFeatures', { required: 'User features are required' })}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
									rows={4}
								/>
							</Form.Control>
							{errors.userFeatures && (
								<p className="text-red-500 text-sm">{errors.userFeatures.message}</p>
							)}
						</div>
					</Form.Field>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl font-semibold">Database & Backend</h2>

					<Form.Field name="coreEntities">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="coreEntities">
								List the core entities the app will manage. (E.g., users, orders, tasks)
							</Label.Root>
							<Form.Control asChild>
								<input
									type="text"
									id="coreEntities"
									{...register('coreEntities', { required: 'Core entities are required' })}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
							</Form.Control>
							{errors.coreEntities && (
								<p className="text-red-500 text-sm">{errors.coreEntities.message}</p>
							)}
						</div>
					</Form.Field>

					<Form.Field name="entityRelationships">
						<div className="flex flex-col space-y-2">
							<Label.Root
								className="text-sm font-medium text-gray-700"
								htmlFor="entityRelationships"
							>
								Describe relationships between entities. (E.g., Users can have multiple orders.)
							</Label.Root>
							<Form.Control asChild>
								<textarea
									id="entityRelationships"
									{...register('entityRelationships')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
									rows={3}
								/>
							</Form.Control>
						</div>
					</Form.Field>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl font-semibold">External Integrations</h2>

					<Form.Field name="externalAPIs">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="externalAPIs">
								Do you need integrations with external APIs? If yes, please list them.
							</Label.Root>
							<Form.Control asChild>
								<textarea
									id="externalAPIs"
									{...register('externalAPIs')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
									rows={3}
								/>
							</Form.Control>
						</div>
					</Form.Field>

					<Form.Field name="paymentMethods">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="paymentMethods">
								Are there specific payment methods or gateways required?
							</Label.Root>
							<Form.Control asChild>
								<input
									type="text"
									id="paymentMethods"
									{...register('paymentMethods')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
							</Form.Control>
						</div>
					</Form.Field>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl font-semibold">Design & UI</h2>

					<Form.Field name="colorScheme">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="colorScheme">
								Color Scheme: What primary and secondary colors should the app use?
							</Label.Root>
							<Form.Control asChild>
								<input
									type="text"
									id="colorScheme"
									{...register('colorScheme')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
							</Form.Control>
						</div>
					</Form.Field>

					<Form.Field name="typography">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="typography">
								Typography: Any preferences for fonts or overall style?
							</Label.Root>
							<Form.Control asChild>
								<input
									type="text"
									id="typography"
									{...register('typography')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
							</Form.Control>
						</div>
					</Form.Field>

					<Form.Field name="uiComponents">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="uiComponents">
								Components: Any specific UI elements you&apos;d like to see (e.g., accordions, tabs)?
							</Label.Root>
							<Form.Control asChild>
								<input
									type="text"
									id="uiComponents"
									{...register('uiComponents')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
							</Form.Control>
						</div>
					</Form.Field>

					<Form.Field name="darkMode">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700">
								Should the design include light/dark mode options?
							</Label.Root>
							<RadioGroup.Root className="flex gap-4" defaultValue="no" {...register('darkMode')}>
								<div className="flex items-center">
									<RadioGroup.Item
										id="darkMode-yes"
										value="yes"
										className="h-4 w-4 rounded-full border border-gray-300 bg-white"
									>
										<RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-indigo-600" />
									</RadioGroup.Item>
									<label htmlFor="darkMode-yes" className="ml-2 text-sm text-gray-700">
										Yes
									</label>
								</div>
								<div className="flex items-center">
									<RadioGroup.Item
										id="darkMode-no"
										value="no"
										className="h-4 w-4 rounded-full border border-gray-300 bg-white"
									>
										<RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-indigo-600" />
									</RadioGroup.Item>
									<label htmlFor="darkMode-no" className="ml-2 text-sm text-gray-700">
										No
									</label>
								</div>
							</RadioGroup.Root>
						</div>
					</Form.Field>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl font-semibold">Technical Requirements</h2>

					<Form.Field name="technicalPreferences">
						<div className="flex flex-col space-y-2">
							<Label.Root
								className="text-sm font-medium text
-gray-700"
								htmlFor="technicalPreferences"
							>
								Are there specific frameworks, libraries, or tools you prefer?
							</Label.Root>
							<Form.Control asChild>
								<textarea
									id="technicalPreferences"
									{...register('technicalPreferences')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
									rows={3}
								/>
							</Form.Control>
						</div>
					</Form.Field>

					<Form.Field name="hostingPreference">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="hostingPreference">
								Do you have a hosting provider in mind, or should we recommend one?
							</Label.Root>
							<Form.Control asChild>
								<input
									type="text"
									id="hostingPreference"
									{...register('hostingPreference')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
							</Form.Control>
						</div>
					</Form.Field>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl font-semibold">Additional Considerations</h2>

					<Form.Field name="accessibilityRequirements">
						<div className="flex flex-col space-y-2">
							<Label.Root
								className="text-sm font-medium text-gray-700"
								htmlFor="accessibilityRequirements"
							>
								Are there any accessibility or compliance requirements (e.g., WCAG)?
							</Label.Root>
							<Form.Control asChild>
								<textarea
									id="accessibilityRequirements"
									{...register('accessibilityRequirements')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
									rows={3}
								/>
							</Form.Control>
						</div>
					</Form.Field>

					<Form.Field name="existingAssets">
						<div className="flex flex-col space-y-2">
							<Label.Root className="text-sm font-medium text-gray-700" htmlFor="existingAssets">
								Are there existing assets or files the devs should use (e.g., Figma designs,
								wireframes)?
							</Label.Root>
							<Form.Control asChild>
								<textarea
									id="existingAssets"
									{...register('existingAssets')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
									rows={3}
								/>
							</Form.Control>
						</div>
					</Form.Field>
				</section>

				<Form.Submit asChild>
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Submit Questionnaire
					</button>
				</Form.Submit>
			</Form.Root>
		</div>
	);
}
