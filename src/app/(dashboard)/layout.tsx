import { DashboardNav } from "@/src/components/navigation/DashboardNav";
import { OrganizationSwitcher } from "@/src/components/organizations/OrganizationSwitcher";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<header className="flex items-center justify-between p-4 border-b">
				<OrganizationSwitcher />
				{/* Add any other header items */}
			</header>
			<div className="flex">
				<aside className="w-64 border-r">
					<DashboardNav />
				</aside>
				<main className="flex-1 p-6">
					{children}
				</main>
			</div>
		</div>
	);
}
