'use client';

export default function ClientDashboard() {
	return (
		<main className="p-4">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* Dashboard Cards */}
				<div className="p-6 bg-white rounded-lg shadow">
					<h2 className="text-lg font-semibold mb-2">Welcome</h2>
					<p className="text-gray-600">This is your personal dashboard.</p>
				</div>

				<div className="p-6 bg-white rounded-lg shadow">
					<h2 className="text-lg font-semibold mb-2">Statistics</h2>
					<p className="text-gray-600">Your activity overview</p>
				</div>

				<div className="p-6 bg-white rounded-lg shadow">
					<h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
					<p className="text-gray-600">Your latest actions</p>
				</div>
			</div>
		</main>
	);
}
