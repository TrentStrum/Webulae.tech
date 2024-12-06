import Link from "next/link";

import { Button } from "@/src/components/ui/button";

const AuthButton = () => (
	<div className="space-x-2">
		<Button variant="ghost" asChild>
			<Link href="/auth/login">Log in</Link>
		</Button>
		<Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
			<Link href="/auth/signup">Sign up</Link>
		</Button>
	</div>
);

export default AuthButton;
