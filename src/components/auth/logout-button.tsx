'use client';

import { useToast } from '@/src/hooks';
import { supabaseClient } from '@/src/lib/supabaseClient';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@radix-ui/react-alert-dialog';
import { useRouter } from 'next/navigation';
import { AlertDialogHeader, AlertDialogFooter } from '../ui/alert-dialog';


export function LogoutButton({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { toast } = useToast();

	const handleLogout = async () => {
		const { error } = await supabaseClient.auth.signOut();

		if (error) {
			toast({
				title: 'Error',
				description: 'There was a problem signing out.',
				variant: 'destructive',
			});
		} else {
			toast({
				title: 'Signed out',
				description: 'You have been successfully signed out.',
			});
			router.push('/');
			router.refresh();
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<button className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
					{children}
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
					<AlertDialogDescription>
						You will need to sign in again to access your account.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
