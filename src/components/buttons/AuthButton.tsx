import { Button } from "@/src/components/ui/button";
import Link from "next/link";

const AuthButtons = () => (
	<div className="space-x-2">
		<Button variant="ghost" asChild>
			<Link href="/login">Log in</Link>
		</Button>
		<Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
			<Link href="/signup">Sign up</Link>
		</Button>
	</div>
);

export default AuthButtons;
    