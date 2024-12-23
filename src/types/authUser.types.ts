

export interface AuthUser {
	id: string;
	firstName: string | null;
	lastName: string | null;
	fullName: string | null;
	imageUrl: string;
	emailAddresses: Array<{
		emailAddress: string;
	}>;
}
