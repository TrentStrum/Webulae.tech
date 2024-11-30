'use client';

import { useEffect } from 'react';

export default function Profile() {
	return (
		<main className="p-4">
			<h1 className="text-2xl font-bold mb-4">Profile</h1>

			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-lg shadow p-6 mb-4">
					<div className="flex items-center space-x-4 mb-6">
						<div className="w-20 h-20 bg-gray-200 rounded-full"></div>
						<div>
							<h2 className="text-xl font-semibold">John Doe</h2>
							<p className="text-gray-600">john.doe@example.com</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="border-b pb-4">
							<h3 className="text-lg font-medium mb-2">Personal Information</h3>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="text-sm text-gray-600">Full Name</label>
									<p className="font-medium">John Doe</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Email</label>
									<p className="font-medium">john.doe@example.com</p>
								</div>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-2">Account Settings</h3>
							<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
								Edit Profile
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
