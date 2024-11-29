import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Textarea } from "@/src/components/ui/textarea";
import { Profile } from '@/src/types';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';


type Props = {
	profile: Profile;
	hasChanges: () => boolean;
	onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ProfileForm({
	profile,
	hasChanges,
	onInputChange,
	onSubmit,
}: Props) {
	return (
		<form onSubmit={onSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="fullName">Full Name</Label>
						<Input
							id="fullName"
							name="full_name"
							value={profile.full_name || ''}
							onChange={onInputChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							name="username"
							value={profile.username || ''}
							onChange={onInputChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="bio">Bio</Label>
						<Textarea
							id="bio"
							name="bio"
							value={profile.bio || ''}
							onChange={onInputChange}
							rows={4}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="website">Website</Label>
						<Input
							id="website"
							name="website"
							type="url"
							value={profile.website || ''}
							onChange={onInputChange}
						/>
					</div>
					<div className="flex justify-end">
						<Button type="submit" disabled={!hasChanges()}>
							Save Changes
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
